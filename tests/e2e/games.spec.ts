import { test, expect } from '@playwright/test';

test('three games have reachable goals, resume and remain separate from lesson progress', async ({
  page,
}) => {
  for (const [id, actions] of [
    ['balance', ['Gửi máy A', 'Gửi máy B', 'Gửi máy A', 'Gửi máy A', 'Gửi máy B', 'Gửi máy B']],
    ['cache', ['Đọc nguồn', 'Đọc cache', 'Đọc nguồn', 'Đọc cache', 'Đọc nguồn', 'Đọc cache']],
    ['queue', ['1 worker', '2 worker', '1 worker', '2 worker', '1 worker', '1 worker']],
  ] as const) {
    await page.goto(`/#/games/${id}`);
    for (const [i, action] of actions.entries()) {
      await page.getByRole('button', { name: action, exact: true }).click();
      if (i === 1) {
        await page.reload();
        await expect(page.getByText('Lượt 3 / 6', { exact: true })).toBeVisible();
      }
    }
    await expect(page.getByRole('heading', { name: 'Đạt mục tiêu!' })).toBeVisible();
    await expect(page.locator('.game-rules li')).toHaveCount(6);
    await page.getByRole('link', { name: 'Học cơ chế này' }).click();
    await expect(page.getByRole('heading', { name: 'Chưa tìm thấy trang này.' })).toHaveCount(0);
  }
  await page.goto('/#/progress');
  await expect(page.locator('.progress-summary strong')).toContainText('0');
});

test('loss feedback, retry, corrupted save, blocked storage and keyboard controls', async ({
  page,
}) => {
  await page.goto('/#/games/cache');
  for (let i = 0; i < 6; i++)
    await page.getByRole('button', { name: 'Đọc cache', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Thử một cách khác nhé.' })).toBeVisible();
  await page.getByRole('button', { name: 'Chơi lại từ đầu' }).click();
  await expect(page.getByText('Lượt 1 / 6', { exact: true })).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem('sdl-game-v1-cache', '{"id":"cache","actions":[99]}'),
  );
  await page.reload();
  await expect(page.getByText('Lượt 1 / 6', { exact: true })).toBeVisible();
  await page.evaluate(() => {
    Storage.prototype.setItem = () => {
      throw new DOMException('blocked', 'QuotaExceededError');
    };
  });
  await page.getByRole('button', { name: 'Đọc nguồn', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('alert')).toContainText('Chưa lưu được');
  await expect(page.getByText('Lượt 2 / 6', { exact: true })).toBeVisible();
});

test('mobile layout and reduced-motion preserve controls without WebGL', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type, ...args) {
      if (type.startsWith('webgl')) return null;
      return original.call(this, type, ...args);
    } as typeof original;
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Gửi một yêu cầu' }).click();
  await expect(page.locator('.workshop-caption strong')).toHaveText('Máy chủ');
  for (const route of ['/games', '/games/queue', '/explore', '/learn/cache']) {
    await page.goto('/#' + route);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
    ).toBeLessThanOrEqual(1);
  }
});

test('downloaded pack opens an unvisited game and Lottie runtime offline', async ({
  page,
  context,
}) => {
  await page.goto('/#/progress');
  const panel = page.getByRole('region', { name: 'Học khi mất mạng' });
  await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 30000 });
  await context.setOffline(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/games/cache');
  await page.getByRole('button', { name: 'Đọc nguồn', exact: true }).click();
  await expect(page.getByText('Lượt 2 / 6', { exact: true })).toBeVisible();
  await expect(page.locator('.game-scene')).not.toHaveAttribute('data-phase', '-1');
  await page.reload();
  await expect(page.getByText('Lượt 2 / 6', { exact: true })).toBeVisible();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-phase', '-1');
});
