import { test, expect, type Page } from '@playwright/test';

async function openLab(page: Page, id: string) {
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options').getByRole('button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}

test('lesson previews show the mechanism for concurrency, CPU I/O and TLS', async ({
  page,
}, info) => {
  for (const width of [320, 390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#/explore');
    for (const [id, mechanism] of [
      ['concurrency', 'A ghi 31 · B ghi 31'],
      ['cpu-io', '10\u00a0ms → 6\u00a0ms'],
      ['tls', 'Giữ kín · Phát hiện sửa'],
    ]) {
      const card = page.locator(`a[href="#/learn/${id}"]`);
      await expect(card).toContainText(mechanism!);
      await expect(card).not.toContainText('120 ms');
      await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await card.evaluate((el) => el.scrollIntoView({ block: 'center' }));
      await card.screenshot({ path: info.outputPath(`${id}-${width}.png`) });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
      true,
    );
  }
});

test('DNS explains resolver queries and keeps TTL behaviour after reload', async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await openLab(page, 'dns');
  await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
  await expect(page.locator('.dns-trace')).toContainText('resolver tự hỏi nơi tiếp theo');
  await page.getByRole('button', { name: 'Đổi IP ở nguồn', exact: true }).click();
  await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
  await expect(page.getByText('Kết quả lần tra gần nhất:')).toContainText('203.0.113.10');
  for (let second = 0; second < 5; second++)
    await page.getByRole('button', { name: 'Qua 1 giây', exact: true }).click();
  await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
  await expect(page.getByText('Kết quả lần tra gần nhất:')).toContainText('203.0.113.20');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('.dns-trace')).toContainText('resolver tự hỏi nơi tiếp theo');
  await expect(page.getByText('Kết quả lần tra gần nhất:')).toContainText('203.0.113.20');
  await page.locator('.lab-panel').screenshot({ path: info.outputPath('dns-320.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('cache average read rate stays fractional and survives resume', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await openLab(page, 'balance');
  for (let n = 0; n < 6; n++)
    await page.getByRole('button', { name: 'Giảm Yêu cầu đến mỗi giây', exact: true }).click();
  await page.getByRole('checkbox', { name: /Thêm cache/ }).check();
  const row = page.getByRole('row').filter({ hasText: 'Đọc nguồn kỳ vọng' });
  await expect(row).toContainText('0,5 lượt/giây');
  await expect(page.getByText(/Số lẻ biểu diễn tốc độ trung bình/)).toBeVisible();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(row).toContainText('0,5 lượt/giây');
  await page.locator('.lab-panel').screenshot({ path: info.outputPath('cache-rate-390.png') });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});

test('old rounded observations are identified while imported progress is preserved', async ({
  page,
}) => {
  await page.goto('/#/progress');
  await expect(page.getByRole('button', { name: 'Nhập bản lưu', exact: true })).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles({
    name: 'old-balance.json',
    mimeType: 'application/json',
    buffer: Buffer.from(
      JSON.stringify({
        version: 1,
        lessons: {
          balance: {
            stage: 2,
            prediction: 1,
            challenge: 0,
            actions: 3,
            completed: true,
            lab: {
              arrivals: 2,
              cache: true,
              observation: JSON.stringify({
                schemaVersion: 1,
                action: 'Tính lại cửa sổ 1 giây',
                rows: [{ label: 'Đọc nguồn', before: '2 lượt/giây', after: '1 lượt/giây' }],
                reason: 'Quan sát đã lưu ở phiên bản trước.',
              }),
            },
          },
        },
      }),
    ),
  });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/balance');
  await expect(page.getByText(/Bảng đã lưu từ bản cũ dùng số đọc nguồn làm tròn/)).toBeVisible();
  await page.getByRole('button', { name: 'Tăng Số máy xử lý', exact: true }).click();
  await expect(page.getByText(/Bảng đã lưu từ bản cũ dùng số đọc nguồn làm tròn/)).toHaveCount(0);
  await expect(page.getByRole('row').filter({ hasText: 'Đọc nguồn kỳ vọng' })).toContainText(
    '0,5 lượt/giây',
  );
  await page.goto('/#/progress');
  await expect(
    page.getByRole('link').filter({ hasText: 'Thêm máy có luôn nhanh hơn?' }),
  ).toContainText('Ôn lại và thử thêm');
});
