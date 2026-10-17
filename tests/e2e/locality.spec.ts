import { test, expect } from '@playwright/test';
test('one-block locality explains hits, thrashing and saved progress at 320px', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/#/learn/locality');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm đọc bộ nhớ' });
  const next = lab.getByRole('button', { name: 'Đọc một ô', exact: true });
  await next.press('Enter');
  await expect(next).toBeFocused();
  await next.click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Đã đọc 2/8 ô. Đọc từ cache: 1 lượt. Nạp khối: 1 lượt',
  );
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('status').first()).toContainText('Đã đọc 2/8 ô');
  await lab.getByRole('button', { name: 'Đọc hết lượt', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Đọc từ cache: 6 lượt. Nạp khối: 2 lượt',
  );
  await lab.getByLabel('Thứ tự đọc').selectOption('interleaved');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Đọc hết lượt', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Đọc từ cache: 0 lượt. Nạp khối: 8 lượt',
  );
  await lab.getByText('Xem từng lượt đọc', { exact: true }).click();
  await expect(
    lab.getByText('Lượt 2: ô 4; nạp khối chứa ô 4–7, thay khối cũ.', { exact: true }),
  ).toBeVisible();
  await lab.getByLabel('Thứ tự đọc').selectOption('repeated');
  await lab.getByLabel('Kích thước khối').selectOption('1');
  await lab.getByRole('button', { name: 'Đọc hết lượt', exact: true }).click();
  await expect(lab.getByRole('status').first()).toContainText(
    'Đọc từ cache: 7 lượt. Nạp khối: 1 lượt',
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await lab.getByRole('button', { name: 'Bắt đầu lại', exact: true }).click();
  await next.click();
  await next.click();
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Đọc danh sách tám mục' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
