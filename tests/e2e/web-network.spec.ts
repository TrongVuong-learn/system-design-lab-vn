import { test, expect, type Page } from '@playwright/test';
async function openLab(page: Page, id: string) {
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-option').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
async function exchange(page: Page) {
  await page.getByRole('button', { name: 'Gửi yêu cầu', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Thông điệp phản hồi' })).toContainText(
    'Yêu cầu đã đến máy chủ',
  );
  await page.getByRole('button', { name: 'Xem phản hồi', exact: true }).click();
}
async function resume(page: Page) {
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  const before = await page.locator('.lab-panel').innerText();
  await page.reload();
  await expect(page.locator('.lab-panel')).toHaveText(before, { useInnerText: true });
}
async function complete(page: Page, answer: number) {
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await page.locator('.answer-option').nth(0).click();
  await expect(page.getByText('Cùng nhìn lại nguyên nhân.')).toBeVisible();
  await page.locator('.answer-option').nth(answer).click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Một bước hiểu mới của bạn.')).toBeVisible();
}
test('HTTP shows explicit responses for success, missing resources and maintenance, then resumes', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await openLab(page, 'http');
  await exchange(page);
  const response = page.getByRole('region', { name: 'Thông điệp phản hồi' });
  await expect(response).toContainText('200 OK');
  await expect(response).toContainText('{"phong":201}');
  await page.getByRole('button', { name: 'Đường dẫn không có', exact: true }).click();
  await exchange(page);
  await expect(response).toContainText('404 Not Found');
  await expect(page.locator('.lab-panel > .feedback[role=status]')).toContainText(
    'máy chủ đã trả lời',
  );
  await page.getByRole('button', { name: 'Cho dịch vụ bảo trì' }).click();
  await exchange(page);
  await expect(response).toContainText('503 Service Unavailable');
  await resume(page);
  await page.getByRole('button', { name: 'Kết thúc bảo trì' }).click();
  await exchange(page);
  await expect(response).toContainText('404 Not Found');
  await complete(page, 1);
  expect(errors).toEqual([]);
});
test('network rate changes only transfer time and preserves RTT and the saved configuration', async ({
  page,
}) => {
  await openLab(page, 'network');
  await expect(page.locator('.metrics')).toContainText('1.150');
  for (let i = 0; i < 8; i++)
    await page.getByRole('button', { name: 'Tăng Tốc độ truyền giả định' }).click();
  await expect(page.locator('.metrics')).toContainText('650');
  await expect(page.locator('.download-parts')).toContainText('500 ms');
  await expect(page.locator('.download-parts')).toContainText('100 ms');
  await expect(page.locator('.download-parts')).toContainText('50 ms');
  await resume(page);
  await page.getByRole('button', { name: 'Tăng Thời gian đi về' }).click();
  await expect(page.locator('.metrics')).toContainText('670');
  await expect(page.locator('.download-parts')).toContainText('500 ms');
  await complete(page, 1);
});
