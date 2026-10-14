import { test, expect } from '@playwright/test';
async function lab(page: import('@playwright/test').Page, id: string, answer: number) {
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(answer).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
test('wrong answers reveal hints gradually and save levels independently', async ({ page }) => {
  await page.goto('/#/learn/network');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await expect(page.locator('.question-panel')).not.toContainText('Chỉ thời gian chuyển ảnh bằng');
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await expect(page.getByRole('region', { name: 'Gợi ý 1' })).toBeVisible();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await expect(page.getByRole('region', { name: 'Gợi ý 2' })).toBeVisible();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Xem lời giải' })).toBeVisible();
  await page.getByRole('button', { name: 'Xem lời giải' }).click();
  await expect(page.locator('.question-panel')).toContainText('Chỉ thời gian chuyển ảnh bằng');
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await page.getByRole('button', { name: 'Tăng Thời gian đi về' }).click({ clickCount: 2 });
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await page.locator('.answer-options button').first().click();
  await expect(page.getByRole('button', { name: 'Mở gợi ý 1' })).toBeVisible();
  await expect(page.locator('.question-panel')).not.toContainText('Tổng mới là 100');
});
test('cache and queue explain real transitions and restore the last observation', async ({
  page,
}) => {
  await lab(page, 'cache', 0);
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn', exact: true }).click();
  const compare = page.getByRole('region', { name: 'So sánh bước vừa thử' });
  await expect(compare).toContainText('Chỉ lịch ở nguồn đổi');
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(compare).toContainText('phòng 201 từ cache');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(compare).toContainText('phòng 201 từ cache');
  await page.getByRole('button', { name: 'Đặt lại thí nghiệm' }).click();
  await expect(compare).toHaveCount(0);
  await lab(page, 'queue', 0);
  await page.getByRole('button', { name: 'Qua 1 giây', exact: true }).click();
  await expect(compare).toContainText('0 + 6 − 2 = 4');
  await page.getByRole('button', { name: 'Tăng Số worker' }).click();
  await expect(compare).toContainText('Chưa qua thêm giây');
  await expect(page.locator('.metrics')).toContainText('4');
  await page.getByRole('button', { name: 'Qua 1 giây', exact: true }).click();
  await expect(compare).toContainText('4 + 6 − 4 = 6');
});
test('network comparison shows unchanged terms and works with keyboard', async ({ page }) => {
  await lab(page, 'network', 1);
  const increase = page.getByRole('button', { name: 'Tăng Tốc độ truyền giả định' });
  await increase.focus();
  await page.keyboard.press('Enter');
  const compare = page.getByRole('region', { name: 'So sánh bước vừa thử' });
  await expect(compare).toContainText('1.150 ms');
  await expect(compare).toContainText('1.038,89 ms');
  await expect(compare.getByRole('row', { name: /Máy chủ xử lý/ })).toContainText('50 ms');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(compare).toContainText('1.038,89 ms');
});
