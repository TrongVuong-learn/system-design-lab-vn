import { test, expect } from '@playwright/test';
test('routing separates IP reachability, TCP services and restores the saved trace', async ({
  page,
}) => {
  await page.goto('/#/learn/routing');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm IP và port' });
  await lab.getByRole('button', { name: 'Gửi tới router' }).click();
  await lab.getByRole('button', { name: 'Chuyển tới máy đích' }).click();
  await lab.getByRole('button', { name: 'Chọn dịch vụ tại đích' }).click();
  await expect(lab.getByRole('status')).toContainText('dịch vụ lịch học');
  await lab.getByLabel('Port TCP đích').selectOption('9090');
  for (const name of ['Gửi tới router', 'Chuyển tới máy đích', 'Chọn dịch vụ tại đích'])
    await lab.getByRole('button', { name }).click();
  await expect(lab.getByRole('status')).toContainText('dịch vụ thư viện');
  await lab.getByLabel('Port TCP đích').selectOption('8181');
  for (const name of ['Gửi tới router', 'Chuyển tới máy đích', 'Chọn dịch vụ tại đích'])
    await lab.getByRole('button', { name }).click();
  await expect(lab.getByRole('status')).toContainText('không có dịch vụ TCP lắng nghe');
  await lab.getByRole('button', { name: 'Bỏ route ở router' }).click();
  await lab.getByLabel('Port TCP đích').selectOption('8080');
  await lab.getByRole('button', { name: 'Gửi tới router' }).click();
  await expect(lab.getByRole('status')).toContainText('Dừng ở router');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status')).toContainText('Dừng ở router');
  await lab.getByRole('button', { name: 'Khôi phục route ở router' }).click();
  await lab.getByLabel('IP đích').selectOption('other');
  await lab.getByRole('button', { name: 'Gửi tới router' }).click();
  await lab.getByRole('button', { name: 'Chuyển tới máy đích' }).click();
  await expect(lab.getByRole('status')).toContainText('Đã tới máy khác');
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Sửa đường tới máy lưu ảnh' })).toBeVisible();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
