import { expect, test } from '@playwright/test';

test('district navigation works with keyboard and filtering keeps lessons reachable', async ({
  page,
}) => {
  await page.goto('/#/explore');
  const map = page.getByRole('region', { name: 'Sáu khu học' });
  const districts = map.getByRole('button', { expanded: false });
  await districts.first().focus();
  await page.keyboard.press('Enter');
  await expect(map.getByRole('button', { expanded: true })).toHaveCount(1);
  await map.getByRole('button', { name: 'Lọc bài của khu này' }).click();
  await expect(page.getByLabel('Học theo lộ trình')).toBeFocused();
  await expect(page.getByLabel('Học theo lộ trình')).toHaveValue('L1');
  await page.getByLabel('Tìm bài học hoặc chủ đề').fill('giao dich');
  const lesson = page.locator('.lesson-card').first();
  await expect(lesson).toHaveAttribute('href', '#/learn/transactions-isolation');
  await lesson.click();
  await expect(page.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true })).toBeFocused();
});

test('game previews show engine consequences without writing a game or lesson save', async ({
  page,
}) => {
  await page.goto('/#/games');
  const storageBefore = await page.evaluate(() => JSON.stringify(localStorage));
  for (const name of ['Thử giao gói đầu', 'Thử lấy bản tin', 'Thử chạy băng chuyền']) {
    await page.getByRole('button', { name, exact: true }).click();
  }
  await expect(page.getByRole('button', { name: 'Đặt lại xem trước' })).toHaveCount(3);
  expect(await page.evaluate(() => JSON.stringify(localStorage))).toBe(storageBefore);
  await page.locator('.game-cover-cache').getByRole('link', { name: 'Vào chơi' }).click();
  await expect(page.getByText('Lượt 1 / 6', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  await expect(page.locator('.progress-summary strong')).toContainText('0');
});

for (const width of [320, 390, 768, 1280]) {
  test(`pixel screens and real content fit at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [name, route] of [
      ['home', '/'],
      ['explore', '/explore'],
      ['level', '/levels/L3'],
      ['progress', '/progress'],
      ['games', '/games'],
      ['cache', '/games/cache'],
      ['balance', '/games/balance'],
      ['queue', '/games/queue'],
      ['lesson', '/learn/cache'],
      ['review', '/review/school-day'],
    ]) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth - innerWidth),
      ).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `.cache/pixel-city/${width}-${name}.png` });
    }
  });
}
