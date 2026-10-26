import { test, expect } from '@playwright/test';

test('action diagrams move, settle, replay without advancing and reload without autoplay', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [id, choice, summary] of [
    ['balance', 'Gửi máy B', 'Tổng tải A: 0, B: 3'],
    ['cache', 'Đọc nguồn', 'Nguồn gốc trả đúng'],
    ['queue', '1 worker', 'worker xử lý 2'],
  ]) {
    await page.goto(`/#/games/${id}`);
    await page.getByRole('button', { name: choice, exact: true }).click();
    const scene = page.locator('.game-scene');
    await expect(scene).not.toHaveAttribute('data-phase', '-1');
    await expect(scene.locator('figcaption')).toContainText(summary!);
    const token = scene.locator('[data-packet]').first();
    await expect
      .poll(() => token.evaluate((element) => element.getAttribute('transform')))
      .not.toBe(await token.getAttribute('data-to'));
    await expect(scene).toHaveAttribute('data-phase', '-1', { timeout: 7000 });
    await expect
      .poll(async () => (await token.getAttribute('transform'))?.replace(/\s/g, ''))
      .toBe((await token.getAttribute('data-to'))?.replace(/\s/g, ''));
    const saved = await page.evaluate((key) => localStorage.getItem(key), `sdl-game-v1-${id}`);
    await scene.getByRole('button', { name: 'Xem lại lượt' }).click();
    await expect(scene).not.toHaveAttribute('data-phase', '-1');
    await expect(scene).toHaveAttribute('data-phase', '-1', { timeout: 7000 });
    expect(await page.evaluate((key) => localStorage.getItem(key), `sdl-game-v1-${id}`)).toBe(
      saved,
    );
    await expect(page.getByText('Lượt 2 / 6', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.locator('.game-scene')).toHaveAttribute('data-phase', '-1');
    await expect(page.locator('.game-scene figcaption')).toContainText(summary!);
  }
});

test('queue overflow and cache stale responses are depicted from the actual result at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/games/queue');
  for (let i = 0; i < 4; i++)
    await page.getByRole('button', { name: '1 worker', exact: true }).click();
  const scene = page.locator('.game-scene');
  await expect(scene.locator('figcaption')).toContainText('Còn chờ 4, mất 2');
  await expect(scene.locator('[data-packet]')).toHaveCount(8);
  await expect(scene.locator('[data-packet] .scene-error')).toHaveCount(2);
  await expect(scene).toHaveAttribute('data-phase', '-1');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
  await page.goto('/#/games/cache');
  await page.getByRole('button', { name: 'Đọc nguồn', exact: true }).click();
  for (let i = 0; i < 2; i++)
    await page.getByRole('button', { name: 'Đọc cache', exact: true }).click();
  await expect(page.locator('.game-scene figcaption')).toContainText(
    'Cache trả sai phiên bản. Nguồn đang là v2, cache v1',
  );
  await expect(page.locator('.scene-reader')).toHaveClass(/scene-error/);
  await expect(page.locator('[data-packet]')).toContainText('v1');
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
  ).toBeLessThanOrEqual(1);
});

test('rapid actions, reduced-motion changes and reset cancel the previous visual only', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/games/balance');
  await page.getByRole('button', { name: 'Gửi máy A', exact: true }).click();
  await expect(page.locator('.game-scene')).not.toHaveAttribute('data-phase', '-1');
  await page.getByRole('button', { name: 'Gửi máy B', exact: true }).click();
  await expect(page.locator('.game-scene figcaption')).toContainText('Tổng tải A: 3, B: 2');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.game-scene')).toHaveAttribute('data-phase', '-1');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.getByRole('button', { name: 'Gửi máy A', exact: true }).click();
  await expect(page.locator('.game-scene')).not.toHaveAttribute('data-phase', '-1');
  await page.getByRole('button', { name: 'Chơi lại từ đầu' }).click();
  await expect(page.locator('.game-scene')).toHaveAttribute('data-phase', '-1');
  await expect(page.locator('.game-scene')).toContainText('Hệ thống chờ bạn');
  await expect(page.locator('[data-packet]')).toHaveCount(0);
  await page.reload();
  await expect(page.getByText('Lượt 1 / 6', { exact: true })).toBeVisible();
});
