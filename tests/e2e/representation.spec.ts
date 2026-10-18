import { test, expect } from '@playwright/test';
async function openLab(page: import('@playwright/test').Page, id: string) {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
test('JSON UTF-8 keeps Unicode, quoted strings, types and restored progress', async ({ page }) => {
  await openLab(page, 'serialization');
  const lab = page.getByRole('region', { name: 'Thí nghiệm serialization' });
  await lab.getByLabel('Tên trong bản ghi').selectOption('quoted');
  await lab.getByRole('button', { name: 'Tạo JSON UTF-8', exact: true }).press('Enter');
  await expect(lab.getByRole('button', { name: 'Đọc lại JSON', exact: true })).toBeFocused();
  await expect(lab.locator('pre')).toContainText('\\"B\\"');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('button', { name: 'Đọc lại JSON', exact: true })).toBeVisible();
  await lab.getByRole('button', { name: 'Đọc lại JSON', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã khôi phục đúng bản ghi');
  await expect(lab.locator('p').filter({ hasText: 'Tên khôi phục:' })).toContainText('An, "B"');
  await lab.getByLabel('Tên trong bản ghi').selectOption('vietnamese');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByLabel('Cách viết JSON').selectOption('true');
  await lab.getByRole('button', { name: 'Tạo JSON UTF-8', exact: true }).click();
  await lab.getByRole('button', { name: 'Đọc lại JSON', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã khôi phục đúng bản ghi');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Gửi phiếu đặt chỗ ngày hội' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
test('RLE shrinks long runs, expands alternating bytes and restores both exactly', async ({
  page,
}) => {
  await openLab(page, 'compression');
  const lab = page.getByRole('region', { name: 'Thí nghiệm compression' });
  await lab.getByRole('button', { name: 'Nén chuỗi', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Sau nén: 4 byte');
  await lab.getByRole('button', { name: 'Giải nén', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Khôi phục đúng chuỗi gốc');
  await lab.getByLabel('Mẫu dữ liệu').selectOption('alternating');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Nén chuỗi', exact: true }).press('Enter');
  await expect(lab.getByRole('button', { name: 'Giải nén', exact: true })).toBeFocused();
  await expect(lab.getByRole('status').first()).toContainText('Sau nén: 32 byte');
  await expect(lab.getByRole('list').getByRole('listitem')).toHaveCount(16);
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Sau nén: 32 byte');
  await lab.getByRole('button', { name: 'Giải nén', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Khôi phục đúng chuỗi gốc');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await lab.getByRole('button', { name: 'Bắt đầu lại', exact: true }).click();
  await lab.getByRole('button', { name: 'Nén chuỗi', exact: true }).click();
  await lab.getByRole('button', { name: 'Giải nén', exact: true }).click();
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Lưu bảng tín hiệu của lớp' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
});
