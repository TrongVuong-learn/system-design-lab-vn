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
test('browser cookie cannot identify a revoked server session', async ({ page }) => {
  await open(page, 'cookie-session');
  const lab = page.getByRole('region', { name: 'Thí nghiệm cookie và session' });
  const next = lab.getByRole('button', { name: 'Tiến một chặng', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await next.click();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Server nhận diện: An');
  await lab.getByLabel('Tình huống').selectOption('revoke');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await next.click();
  await next.click();
  await expect(lab.locator('dd').first()).toHaveText('sid=S1');
  await expect(lab.locator('dd').nth(1)).toHaveText('S1 không còn hiệu lực');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Chặng 2/3');
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Server nhận diện: Khách');
  await lab.getByLabel('Tình huống').selectOption('drop');
  for (let i = 0; i < 3; i++) await next.click();
  await expect(lab.locator('dd').first()).toHaveText('Không có cookie');
  await expect(lab.locator('dd').nth(1)).toHaveText('S1 → An');
  await expect(lab.getByRole('status').first()).toContainText('Khách');
  await finish(page, 'Mở lại lịch sau khi phiên bị thu hồi');
});
test('reverse proxy routes one public host to different backends without implying cache', async ({
  page,
}) => {
  await open(page, 'reverse-proxy');
  const lab = page.getByRole('region', { name: 'Thí nghiệm reverse proxy' });
  const next = lab.getByRole('button', { name: 'Đi một chặng', exact: true });
  for (let i = 0; i < 3; i++) await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Browser đã nhận 200');
  await expect(lab.getByRole('list')).toContainText('Proxy chọn Máy lịch');
  await lab.getByLabel('Tài nguyên').selectOption('image');
  await next.press('Enter');
  await expect(next).toBeFocused();
  await next.click();
  await expect(lab.getByRole('list')).toContainText('Proxy chọn Máy ảnh');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Chặng 2/3');
  await next.click();
  await lab.getByLabel('Đường đi').selectOption('direct');
  await expect(lab.locator('p').filter({ hasText: 'Browser gọi' })).toContainText(
    'anh.example/anh',
  );
  for (let i = 0; i < 3; i++) await next.click();
  await expect(lab.getByRole('list')).not.toContainText('→ proxy');
  await finish(page, 'Cửa vào chung của cổng ngày hội');
});
test('transport HOL separates arrived bytes from application delivery', async ({ page }) => {
  await open(page, 'multiplexing');
  const lab = page.getByRole('region', { name: 'Thí nghiệm multiplexing' });
  const next = lab.getByRole('button', { name: 'Xử lý sự kiện', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('A chưa có, B đã có');
  await lab.getByLabel('Giao thức').selectOption('h2');
  await next.click();
  await next.click();
  await expect(lab.locator('dd').first()).toHaveText('Có');
  await expect(lab.locator('dd').nth(1)).toHaveText('Chưa');
  await expect(lab.getByRole('status').first()).toContainText('A chưa có, B chưa có');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Sự kiện 2/3');
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('A đã có, B đã có');
  await lab.getByLabel('Mất dữ liệu A').selectOption('false');
  await next.click();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('A đã có, B đã có');
  await next.click();
  await finish(page, 'Ảnh bị mất gói trong lúc tải lịch');
});
