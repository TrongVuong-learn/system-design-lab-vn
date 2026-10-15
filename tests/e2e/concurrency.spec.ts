import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('lost update, protected region, waiting and a half-completed trace resume correctly', async ({
  page,
}) => {
  await page.goto('/#/learn/concurrency');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm concurrency' });
  const status = lab.locator('.feedback[role=status]');
  for (const name of [
    'A đọc số chung',
    'B đọc số chung',
    'A ghi số đã đọc +1',
    'B ghi số đã đọc +1',
  ])
    await lab.getByRole('button', { name, exact: true }).click();
  await expect(status).toContainText('Kết quả 31');
  await expect(lab.locator('.concurrency-shared > strong')).toHaveText('31');
  await lab.getByLabel('Dùng cùng một khóa cho cả đọc–tăng–ghi').check();
  await expect(lab.locator('.concurrency-shared > strong')).toHaveText('30');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'A đọc số chung', exact: true }).click();
  await lab.getByRole('button', { name: 'B đọc số chung', exact: true }).click();
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText(
    'phải chờ A',
  );
  await expect(lab.getByRole('region', { name: 'Luồng B' })).toContainText('Chưa đọc');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.getByRole('region', { name: 'Luồng A' })).toContainText('Đã đọc: 30');
  await expect(lab.getByRole('region', { name: 'Luồng B' })).toContainText('Chờ A trả khóa');
  await lab.getByRole('button', { name: 'A ghi số đã đọc +1', exact: true }).click();
  await lab.getByRole('button', { name: 'B đọc số chung', exact: true }).click();
  await expect(lab.getByRole('region', { name: 'Luồng B' })).toContainText('Đã đọc: 31');
  await lab.getByRole('button', { name: 'B ghi số đã đọc +1', exact: true }).click();
  await expect(status).toContainText('Kết quả 32');
  await lab.getByText('Xem thứ tự đọc và ghi', { exact: true }).click();
  await expect(lab.locator('.concurrency-trace > li')).toHaveCount(4);
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Giữ đủ hai lượt ghi danh' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});

test('320px hints, term toggles and exported partial work survive reimport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/learn/concurrency');
  await page.getByRole('button', { name: 'Giải thích: RAM', exact: true }).first().click();
  const note = page.getByRole('dialog', { name: 'Giải thích: Bộ nhớ làm việc', exact: true });
  await expect(note).toContainText('Nơi chương trình giữ dữ liệu');
  await note.getByRole('button', { name: 'Đóng giải thích Bộ nhớ làm việc' }).click();
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Gợi ý 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm concurrency' });
  await lab.getByRole('button', { name: 'A đọc số chung', exact: true }).click();
  await lab.getByRole('button', { name: 'A ghi số đã đọc +1', exact: true }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/#/progress');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const buffer = await readFile((await (await download).path())!);
  const file = page.locator('input[type=file]');
  await file.setInputFiles({
    name: 'empty.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":1,"lessons":{}}'),
  });
  await expect(page.getByText('Tiếp tục chặng 3/4', { exact: true })).toHaveCount(0);
  await file.setInputFiles({ name: 'restored.json', mimeType: 'application/json', buffer });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/concurrency');
  await expect(lab.locator('.concurrency-shared > strong')).toHaveText('31');
  await expect(lab.getByRole('button', { name: 'A đã ghi xong', exact: true })).toBeDisabled();
  for (const name of ['B đọc số chung', 'B ghi số đã đọc +1'])
    await lab.getByRole('button', { name, exact: true }).click();
  await expect(lab.locator('.feedback[role=status]')).toContainText('Kết quả 32');
});

test('impossible imported locked schedule cannot forge counter or ownership', async ({ page }) => {
  await page.goto('/#/progress');
  await page
    .locator('input[type=file]')
    .setInputFiles({
      name: 'malformed-lab.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          version: 1,
          lessons: {
            concurrency: {
              stage: 2,
              prediction: 0,
              challenge: -1,
              actions: 2,
              completed: false,
              lab: {
                locked: true,
                modelVersion: 1,
                schedule: '["a","b"]',
                shared: 999,
                owner: 'b',
              },
            },
          },
        }),
      ),
    });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/concurrency');
  const lab = page.getByRole('region', { name: 'Thí nghiệm concurrency' });
  await expect(lab.locator('.concurrency-shared > strong')).toHaveText('30');
  await expect(lab.getByText('Khóa đang rảnh.', { exact: false })).toBeVisible();
  await lab.getByRole('button', { name: 'B đọc số chung', exact: true }).click();
  await expect(lab.getByRole('region', { name: 'Luồng B' })).toContainText('Đã đọc: 30');
});
