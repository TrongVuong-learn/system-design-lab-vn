import { test, expect, type Page } from '@playwright/test';
async function open(page: Page, id: string) {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
async function finish(page: Page, title: string) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: title })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
}
test('process addresses translate independently and invalid writes leave RAM unchanged', async ({
  page,
}) => {
  await open(page, 'address-space');
  const lab = page.getByRole('region', { name: 'Thí nghiệm không gian địa chỉ' });
  await lab.getByRole('button', { name: 'Thử truy cập', exact: true }).press('Enter');
  await expect(lab.getByRole('status').first()).toContainText('VA 0 → PA 4. Kết quả: A0');
  await lab.getByLabel('Process', { exact: true }).selectOption('B');
  await lab.getByRole('button', { name: 'Thử truy cập', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('VA 0 → PA 8. Kết quả: B0');
  await lab.getByLabel('Thao tác', { exact: true }).selectOption('write');
  await lab.getByLabel('Địa chỉ ảo', { exact: true }).selectOption('4');
  await lab.getByRole('button', { name: 'Thử truy cập', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Bị chặn: vượt giới hạn. RAM không đổi',
  );
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Bị chặn');
  await lab.getByLabel('Địa chỉ ảo', { exact: true }).selectOption('3');
  await lab.getByRole('button', { name: 'Thử truy cập', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('PA 11. Kết quả: B mới');
  await finish(page, 'Hai ứng dụng ghi danh cùng chạy');
});
test('open descriptor survives unlink and is released after close', async ({ page }) => {
  await open(page, 'file-handles');
  const lab = page.getByRole('region', { name: 'Thí nghiệm file và đường dẫn' });
  await lab.getByRole('button', { name: 'Mở file', exact: true }).press('Enter');
  await expect(lab.getByRole('button', { name: 'Xóa tên file', exact: true })).toBeFocused();
  await lab.getByRole('button', { name: 'Xóa tên file', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Đường dẫn: đã xóa tên. Descriptor: đang mở. File: còn được giữ',
  );
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await lab.getByRole('button', { name: 'Đọc qua fd 3', exact: true }).click();
  await expect(lab.locator('strong').filter({ hasText: 'Đọc qua fd 3:' })).toContainText(
    'Lịch: phòng 205',
  );
  await lab.getByRole('button', { name: 'Đóng fd 3', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('File: được giải phóng');
  await finish(page, 'Ứng dụng đang đọc lịch bị xóa tên');
});
test('event-loop frees CPU for B while A waits, without accelerating A', async ({ page }) => {
  await open(page, 'event-loop');
  const lab = page.getByRole('region', { name: 'Thí nghiệm event loop' });
  const next = lab.getByRole('button', { name: 'Qua một khoảng', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Mốc 2. A: chưa xong. B: xong');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Mốc 2');
  await next.click();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('phần xử lý tiếp của A chưa chạy');
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Mốc 5. A: xong. B: xong');
  await expect(next).toBeDisabled();
  await lab.getByLabel('Cách chờ I/O').selectOption('blocking');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  for (let i = 0; i < 5; i++) await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Mốc 5. A: xong. B: chưa xong');
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Mốc 6. A: xong. B: xong');
  await finish(page, 'Lấy ảnh và trả thông báo ngắn');
});
