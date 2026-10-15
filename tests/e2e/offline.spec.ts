import { test, expect } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

async function fixtureServer() {
  let version = 'fixture-one';
  let fail = false;
  const root = resolve('dist');
  const server = createServer(async (request, response) => {
    const path = new URL(request.url!, 'http://localhost').pathname;
    try {
      const file = resolve(root, '.' + (path === '/' ? '/index.html' : path));
      if (!file.startsWith(root + '/')) throw new Error('outside root');
      let body = await readFile(file);
      if (path === '/sw.js')
        body = Buffer.from(
          body.toString().replace(/"version":"[a-f0-9]+"/, `"version":"${version}"`),
        );
      if (fail && path === '/icon.svg') {
        response.writeHead(503).end();
        return;
      }
      const types: Record<string, string> = {
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.html': 'text/html',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
        '.woff': 'font/woff',
      };
      response
        .writeHead(200, {
          'Content-Type': types[extname(file)] ?? 'application/json',
          'Cache-Control': 'no-store',
        })
        .end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('no port');
  return {
    url: `http://127.0.0.1:${address.port}`,
    next: () => {
      version = 'fixture-two';
    },
    fail: (value: boolean) => {
      fail = value;
    },
    close: () => new Promise<void>((done) => server.close(() => done())),
  };
}

test('downloaded artifact opens unvisited lessons offline and preserves progress after deletion', async ({
  page,
  context,
}) => {
  await page.goto('/#/progress');
  const panel = page.getByRole('region', { name: 'Học khi mất mạng' });
  await expect(panel.getByRole('status')).toContainText('Chưa tải');
  expect(
    await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length),
  ).toBe(0);
  await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 20000 });
  await context.setOffline(true);
  await page.goto('/#/learn/cpu-io');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await page.getByRole('button', { name: 'Qua 1 ms', exact: true }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  const other = await context.newPage();
  await other.goto('/#/learn/tls');
  await expect(other.getByRole('heading', { level: 1 })).toBeVisible();
  await other.close();
  await page.reload();
  await expect(page.locator('.cpu-io-clock')).toContainText('Mốc 1 ms');
  await page.goto('/#/progress');
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ');
  await panel.getByRole('button', { name: 'Xóa gói tải' }).click();
  await expect(panel.getByRole('status')).toContainText('Tiến độ học vẫn được giữ');
  expect(
    await page.evaluate(async () =>
      (await caches.keys()).filter((k) => k.startsWith('sdl-offline-')),
    ),
  ).toEqual([]);
  await context.setOffline(false);
  await page.goto('/#/learn/cpu-io');
  await page.reload();
  await expect(page.locator('.cpu-io-clock')).toContainText('Mốc 1 ms');
});

test('partial cache is detected and retry rebuilds a complete pack', async ({ page }) => {
  await page.goto('/#/progress');
  const panel = page.getByRole('region', { name: 'Học khi mất mạng' });
  await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 20000 });
  await page.evaluate(async () => {
    const name = (await caches.keys()).find((k) => k.startsWith('sdl-offline-'))!;
    await (await caches.open(name)).delete('/icon.svg');
  });
  await panel.getByRole('button', { name: 'Kiểm tra gói', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói bị thiếu');
  await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 20000 });
});

test('failed install never signals ready; update waits for all old tabs to close', async ({
  page,
  context,
}) => {
  const server = await fixtureServer();
  try {
    server.fail(true);
    await page.goto(server.url + '/#/progress');
    const panel = page.getByRole('region', { name: 'Học khi mất mạng' });
    await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
    await expect(panel.getByRole('button', { name: 'Tải gói học', exact: true })).toBeEnabled({
      timeout: 20000,
    });
    await expect(panel.getByRole('status')).not.toContainText('Gói đã tải đủ');
    expect(
      await page.evaluate(async () =>
        (await caches.keys()).filter((k) => k.startsWith('sdl-offline-')),
      ),
    ).toEqual([]);
    server.fail(false);
    await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
    await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 20000 });
    server.next();
    server.fail(true);
    await panel.getByRole('button', { name: 'Tải bản mới nếu có' }).click();
    await expect(panel.getByRole('button', { name: 'Tải bản mới nếu có' })).toBeEnabled({
      timeout: 20000,
    });
    await expect(panel.getByRole('status')).not.toContainText('Gói đã tải đủ');
    await panel.getByRole('button', { name: 'Kiểm tra gói', exact: true }).click();
    await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ');
    await expect(panel).toContainText('fixture-one');
    server.fail(false);
    await panel.getByRole('button', { name: 'Tải bản mới nếu có' }).click();
    await expect(panel.getByRole('status')).toContainText('Bản mới tải đủ, đang chờ', {
      timeout: 20000,
    });
    await expect(panel).toContainText('fixture-one');
    await page.reload();
    await expect(panel).toContainText('fixture-one');
    // Close the last controlled document, not merely reload it.
    await page.goto('about:blank');
    const next = await context.newPage();
    await next.goto(server.url + '/#/progress');
    const newPanel = next.getByRole('region', { name: 'Học khi mất mạng' });
    await expect(newPanel).toContainText('fixture-two', { timeout: 20000 });
    await expect(newPanel.getByRole('status')).toContainText('Gói đã tải đủ');
    await next.close();
  } finally {
    await server.close();
  }
});
