import { test, expect } from '@playwright/test';
test('module practice saves partial answers, requires a correct check and resets stale feedback', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/learn/os-practice');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Bài tập tổng hợp module' });
  const next = page.getByRole('button', { name: 'Thử tình huống mới', exact: true });
  const check = lab.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true });
  await expect(next).toBeDisabled();
  await lab.locator('fieldset').first().getByRole('button').first().press('Enter');
  await expect(lab.locator('fieldset').first().getByRole('button').first()).toBeFocused();
  await check.click();
  await expect(lab.getByRole('status')).toContainText('Đúng 1/6');
  await expect(lab.getByText('Chưa trả lời.', { exact: true })).toHaveCount(5);
  await expect(next).toBeDisabled();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status')).toContainText('Đúng 1/6');
  for (const [i, answer] of [0, 1, 0, 1, 1, 1].entries())
    await lab.locator('fieldset').nth(i).getByRole('button').nth(answer).click();
  await expect(lab.getByRole('status')).toContainText('Đã chọn 6/6. Chưa kiểm tra lại');
  await expect(next).toBeDisabled();
  await check.click();
  await expect(lab.getByRole('status')).toContainText('Đúng 6/6');
  await expect(next).toBeEnabled();
  await lab.locator('fieldset').first().getByRole('button').nth(1).click();
  await expect(lab.getByRole('status')).toContainText('Chưa kiểm tra lại');
  await expect(next).toBeDisabled();
  await check.click();
  await expect(lab.getByRole('status')).toContainText('Đúng 5/6');
  await expect(lab.getByText('Cần xem lại.', { exact: true })).toHaveCount(1);
  await lab.locator('fieldset').first().getByRole('button').first().click();
  await check.click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await next.click();
  await expect(page.getByRole('heading', { name: 'Rà lỗi ứng dụng ngày hội' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
