import { test, expect } from '@playwright/test';

test('heap differs from FIFO, repairs after removal and keeps work at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/learn/priority-heap');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm hàng đợi ưu tiên' });
  await expect(lab.getByRole('list', { name: 'Mảng theo tầng' }).getByRole('listitem')).toHaveText([
    'F · 1',
    'E · 5',
    'C · 2',
    'B · 7',
    'D · 6',
    'A · 4',
    'G · 3',
  ]);
  const next = lab.getByRole('button', { name: 'Lấy một việc', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 1 việc. Tiếp theo: C · 2');
  await lab.getByText('Xem lịch sử lấy việc', { exact: true }).click();
  await expect(lab.getByText(/Đưa G · 3 từ cuối lên gốc/)).toContainText('Đổi G · 3 với con C · 2');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 1 việc. Tiếp theo: C · 2');
  await lab.getByLabel('Cách chọn việc').selectOption('fifo');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await expect(lab.getByRole('img')).toHaveCount(0);
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 0 việc. Tiếp theo: A · 4');
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 1 việc. Tiếp theo: B · 7');
  await lab.getByLabel('Cách chọn việc').selectOption('heap');
  await lab.getByRole('button', { name: 'Lấy hết việc', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 7 việc. Không còn việc chờ');
  await expect(next).toBeDisabled();
  await expect(lab.locator('p').filter({ hasText: 'Thứ tự đã lấy:' })).toContainText(
    'F · 1 → C · 2 → G · 3 → A · 4 → E · 5 → D · 6 → B · 7',
  );
  await lab.getByRole('button', { name: 'Bắt đầu lại', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText('Đã lấy 0 việc. Tiếp theo: F · 1');
  await next.click();
  await next.click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Chọn việc in cho ngày hội' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
