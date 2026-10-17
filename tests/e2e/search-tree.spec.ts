import { test, expect } from '@playwright/test';

test('tree shape changes lookup paths, missing keys stop at empty branch, work resumes at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/learn/search-tree');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm cây tìm kiếm' });
  const next = lab.getByRole('button', { name: 'Xét một nút', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 1 nút. Chưa kết luận');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 1 nút');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 3 nút. Tìm thấy mã 14');
  await lab.getByLabel('Hình dạng cây').selectOption('skewed');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 7 nút. Tìm thấy mã 14');
  await lab.getByLabel('Mã cần tìm').selectOption('first');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 1 nút. Tìm thấy mã 2');
  await lab.getByLabel('Hình dạng cây').selectOption('balanced');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 3 nút. Tìm thấy mã 2');
  await lab.getByLabel('Mã cần tìm').selectOption('missing');
  await lab.getByRole('button', { name: 'Tra đến khi xong' }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã xét 3 nút. Không có mã 9');
  await lab.getByText('Xem đường đi bằng chữ', { exact: true }).click();
  await expect(lab.locator('ol li')).toHaveCount(3);
  await expect(lab.locator('ol li').last()).toContainText('nhánh trống, dừng');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(
    page.getByRole('heading', { name: 'Chọn cách tổ chức danh mục thư viện' }),
  ).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
