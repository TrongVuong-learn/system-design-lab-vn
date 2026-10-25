import catalog from '../../apps/web/src/generated/catalog.json' with { type: 'json' };
import type { Lesson } from '@sdl/content-schema';
import { expect, test, type Page } from '@playwright/test';

async function fits(page: Page) {
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
}
const lessons = catalog.lessons as Lesson[];
// Bound each test's work as the curriculum grows; keep every published lesson.
const batches = Array.from({ length: Math.ceil(lessons.length / 12) }, (_, i) =>
  lessons.slice(i * 12, (i + 1) * 12),
);
for (const width of [320, 360, 390, 430, 768, 1024, 1440]) {
  test(`catalog and save failures remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width >= 768 ? 1024 : 844 });
    for (const route of ['/', '/explore', '/levels/L3', '/progress']) {
      await page.goto(`/#${route}`);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await fits(page);
    }
    await page.addInitScript(() => {
      IDBObjectStore.prototype.put = function () {
        throw new DOMException('Test quota', 'QuotaExceededError');
      };
    });
    await page.goto('/#/learn/cache');
    await page.reload();
    await page.getByRole('button', { name: 'Đưa ra dự đoán' }).tap();
    await page.locator('.answer-options').getByRole('button').first().tap();
    await expect(page.getByRole('alert')).toContainText('Chưa lưu được');
    await expect(page.getByRole('button', { name: 'Thử lưu lại' })).toBeVisible();
    await fits(page);
  });
  for (const [index, batch] of batches.entries()) {
    test(`learning batch ${index + 1} remains usable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: width >= 768 ? 1024 : 844 });
      for (const lesson of batch) {
        await test.step(lesson.id, async () => {
          await page.goto(`/#/learn/${lesson.id}`);
          await expect(
            page.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true }),
          ).toBeFocused();
          await fits(page);
          await page.getByRole('button', { name: 'Đưa ra dự đoán' }).tap();
          await fits(page);
          await page.locator('.answer-options').getByRole('button').first().tap();
          await page.getByRole('button', { name: 'Mở thí nghiệm' }).tap();
          await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeFocused();
          await fits(page);
          const controls = page
            .locator('.lab-panel')
            .getByRole('button')
            .and(page.locator('button:not(.term-trigger)'));
          for (const control of await controls.all()) {
            const box = await control.boundingBox();
            expect(box?.height).toBeGreaterThanOrEqual(44);
            expect(box?.width).toBeGreaterThanOrEqual(44);
          }
          if (lesson.practice) {
            for (const [i, q] of lesson.practice.items.entries())
              await page
                .locator('.module-practice-item')
                .nth(i)
                .getByRole('button')
                .nth(q.answer)
                .tap();
            await page.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true }).tap();
          } else {
            const action = page
              .locator('.lab-panel')
              .getByRole('button', { disabled: false })
              .and(page.locator('button:not(.term-trigger)'))
              .first();
            await action.tap();
            await action.tap();
          }
          await page.getByRole('button', { name: 'Thử tình huống mới' }).tap();
          await expect(page.getByRole('heading', { name: 'Áp dụng', exact: true })).toBeFocused();
          await fits(page);
        });
      }
    });
  }
}

test('touch controls work with reduced motion and landscape tablet layout', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Đổi phòng ở nguồn' });
  await button.tap();
  await expect(page.getByText('Chưa nhận thay đổi', { exact: true })).toBeVisible();
  await fits(page);
  const transition = await button.evaluate((el) => getComputedStyle(el).transitionDuration);
  for (const value of transition.split(',')) expect(parseFloat(value)).toBeLessThanOrEqual(0.001);
});
