import { test, expect } from '@playwright/test';
import serviceDesign from '../../content/lessons/vi/service-design.json' with { type: 'json' };

for (const lesson of serviceDesign) {
  test(`${lesson.id}: reads mechanisms, applies decisions, saves and completes transfer case`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`/#/learn/${lesson.id}`);
    const chapters = page.getByRole('region', { name: 'Giải thích từng cơ chế' });
    await expect(chapters.locator('details')).toHaveCount(lesson.chapters.items.length);
    const last = chapters.locator('details').last();
    await last.locator('summary').focus();
    await last.locator('summary').press('Enter');
    await expect(last.getByRole('heading', { name: 'Thử theo ví dụ' })).toBeVisible();
    await expect(last.locator('ol li')).toHaveCount(lesson.chapters.items.at(-1)!.steps.length);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
    await page.locator('.answer-options button').nth(lesson.prediction.answer).click();
    await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
    const lab = page.getByRole('region', { name: 'Bài tập tổng hợp module' });
    const next = page.getByRole('button', { name: 'Thử tình huống mới', exact: true });
    const fields = lab.locator('fieldset');
    await fields.first().getByRole('button').nth(lesson.practice.items[0]!.answer).click();
    await lab.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true }).click();
    await expect(lab.getByRole('status')).toContainText(`Đúng 1/${lesson.practice.items.length}`);
    await expect(next).toBeDisabled();
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    await page.reload();
    await expect(lab.getByRole('status')).toContainText(`Đúng 1/${lesson.practice.items.length}`);
    for (const [i, item] of lesson.practice.items.entries()) {
      const button = fields.nth(i).getByRole('button').nth(item.answer);
      const box = await button.boundingBox();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      await button.click();
    }
    await lab.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true }).click();
    await expect(lab.getByRole('status')).toContainText(
      `Đúng ${lesson.practice.items.length}/${lesson.practice.items.length}`,
    );
    await expect(next).toBeEnabled();
    await next.click();
    await expect(
      page.getByRole('heading', { name: lesson.caseStudy.title, exact: true }),
    ).toBeVisible();
    await page.locator('.answer-options button').nth(lesson.challenge.answer).click();
    await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
    expect(errors).toEqual([]);
  });
}
