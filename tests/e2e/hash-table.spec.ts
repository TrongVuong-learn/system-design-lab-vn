import { test, expect } from '@playwright/test';
test('hash collision requires full-key comparison, restores work, and keeps 320px readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/learn/hash-table');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm hash table' });
  const next = lab.getByRole('button', { name: 'So một khóa', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 1 khóa. Chưa kết luận');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 1 khóa');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 4 khóa. Tìm thấy mã 14');
  await lab.getByLabel('Số ngăn').selectOption('8');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 2 khóa. Tìm thấy mã 14');
  await lab.getByLabel('Mã cần tìm').selectOption('missing');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 2 khóa. Không có mã 18');
  await lab.getByText('Xem các khóa đã so', { exact: true }).click();
  await expect(lab.locator('ol li')).toHaveCount(2);
  await lab.getByLabel('Cách tìm').selectOption('linear');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã so 4 khóa. Không có mã 18');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(
    page.getByRole('heading', { name: 'Tra đúng thẻ sách trong cùng ngăn' }),
  ).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
