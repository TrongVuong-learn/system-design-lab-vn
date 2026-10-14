import { test, expect } from '@playwright/test';
test('TLS protects content, rejects altered records and blocks wrong identity; saves resume', async ({
  page,
}) => {
  await page.goto('/#/learn/tls');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm HTTPS và TLS' });
  const status = lab.locator('.feedback[role=status]');
  await lab.getByLabel('Can thiệp trên đường').selectOption('tamper');
  await lab.getByRole('button', { name: 'Gửi lịch', exact: true }).click();
  await expect(status).toContainText('Phát hiện sửa dữ liệu');
  await expect(lab.getByRole('list', { name: 'Ba góc nhìn' })).not.toContainText('Phòng 999');
  await lab.getByLabel('Kênh truyền').selectOption('http');
  await expect(status).toContainText('Chưa gửi');
  await expect(lab.getByLabel('Chứng chỉ máy trường')).toBeDisabled();
  await lab.getByRole('button', { name: 'Gửi lịch', exact: true }).click();
  await expect(lab.getByRole('list', { name: 'Ba góc nhìn' })).toContainText('Phòng 999');
  await lab.getByLabel('Kênh truyền').selectOption('https');
  for (const certificate of ['wrong-name', 'expired', 'untrusted']) {
    await lab.getByLabel('Chứng chỉ máy trường').selectOption(certificate);
    await lab.getByRole('button', { name: 'Gửi lịch', exact: true }).click();
    await expect(status).toContainText('Dừng ở kiểm tra chứng chỉ');
    await expect(lab.getByRole('list', { name: 'Ba góc nhìn' })).toContainText(
      'Chưa có nội dung HTTP được gửi',
    );
  }
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByLabel('Chứng chỉ máy trường')).toHaveValue('untrusted');
  await expect(status).toContainText('Dừng ở kiểm tra chứng chỉ');
  await lab.getByRole('button', { name: 'Đặt lại', exact: true }).click();
  await expect(status).toContainText('Chưa gửi');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Gửi lịch', exact: true }).click();
  await expect(status).toContainText('Đã nhận lịch');
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Lịch trường qua Wi-Fi ở quán' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});

test('TLS hints and inline terms remain usable at320 and survive reload', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/learn/tls');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await expect(page.getByRole('region', { name: 'Gợi ý 2' })).toBeVisible();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Gợi ý 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Xem lời giải' }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const term = page.getByRole('button', { name: 'Giải thích: HTTPS', exact: true }).first();
  await term.click();
  await expect(
    page.getByRole('dialog', { name: 'Giải thích: HTTP được bảo vệ', exact: true }),
  ).toContainText('HTTP dùng kênh TLS');
  await page
    .getByRole('dialog', { name: 'Giải thích: HTTP được bảo vệ', exact: true })
    .getByRole('button', { name: 'Đóng giải thích HTTP được bảo vệ' })
    .click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
