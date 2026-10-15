import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
test('CPU and blocking IO distinguish queued work, overlapping waits, CPU bottleneck and resume', async ({
  page,
}) => {
  await page.goto('/#/learn/cpu-io');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm CPU và I/O' });
  const next = lab.getByRole('button', { name: 'Qua 1 ms', exact: true });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(next).toBeFocused();
  await expect(lab.locator('.cpu-io-jobs')).toContainText('Chờ I/O');
  await expect(lab.locator('.cpu-io-jobs')).toContainText('Chờ worker');
  await next.click();
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText('CPU nghỉ');
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(lab.locator('.cpu-io-clock')).toContainText('Mốc 2 ms');
  await lab.getByRole('button', { name: 'Chạy đến khi xong' }).click();
  await expect(lab.locator('.feedback[role=status]')).toContainText('mốc 10 ms');
  await expect(lab.locator('.cpu-io-clock')).toContainText('CPU bận 4 ms · nghỉ 6 ms');
  await lab.getByLabel('Số worker').selectOption('2');
  await expect(lab.locator('.cpu-io-clock')).toContainText('Mốc 0 ms');
  await expect(lab.getByRole('region', { name: 'So sánh bước vừa thử' })).toHaveCount(0);
  await lab.getByRole('button', { name: 'Chạy đến khi xong' }).click();
  await expect(lab.locator('.feedback[role=status]')).toContainText('mốc 6 ms');
  await expect(lab.locator('.cpu-io-jobs li').nth(1)).toContainText('từ lúc đến đến xong: 6 ms');
  await lab.getByText('Xem CPU và hai việc theo từng khoảng', { exact: true }).click();
  await expect(lab.locator('.cpu-io-timeline tbody tr')).toHaveCount(6);
  await lab.getByLabel('Loại việc').selectOption('cpu');
  await lab.getByRole('button', { name: 'Chạy đến khi xong' }).click();
  await expect(lab.locator('.feedback[role=status]')).toContainText('mốc 8 ms');
  await lab.getByLabel('Số worker').selectOption('1');
  await lab.getByRole('button', { name: 'Chạy đến khi xong' }).click();
  await expect(lab.locator('.cpu-io-clock')).toContainText('CPU bận 8 ms · nghỉ 0 ms');
  await expect(next).toBeDisabled();
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await expect(page.getByRole('heading', { name: 'Cổng ảnh trường đang chờ gì?' })).toBeVisible();
  await page.locator('.answer-options button').first().click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
});
test('narrow hint and glossary flow, expanded timeline and exported work restore safely', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/learn/cpu-io');
  await page
    .getByRole('button', { name: /Giải thích: worker/i })
    .first()
    .click();
  const note = page.getByRole('dialog', { name: 'Giải thích: Bên nhận xử lý việc', exact: true });
  await expect(note).toContainText('Worker không phải một CPU');
  await note.getByRole('button', { name: 'Đóng giải thích Bên nhận xử lý việc' }).click();
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(1).click();
  await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
  await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Gợi ý 2' })).toBeVisible();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Thí nghiệm CPU và I/O' });
  await lab.getByLabel('Số worker').selectOption('2');
  for (let i = 0; i < 4; i++)
    await lab.getByRole('button', { name: 'Qua 1 ms', exact: true }).click();
  await lab.getByText('Xem CPU và hai việc theo từng khoảng', { exact: true }).click();
  await expect(lab.locator('.cpu-io-timeline tbody tr')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const buffer = await readFile((await (await download).path())!);
  const input = page.locator('input[type=file]');
  await input.setInputFiles({
    name: 'empty.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":1,"lessons":{}}'),
  });
  await expect(page.getByText('Tiếp tục chặng 3/4', { exact: true })).toHaveCount(0);
  await input.setInputFiles({ name: 'restored.json', mimeType: 'application/json', buffer });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/cpu-io');
  await expect(lab.locator('.cpu-io-clock')).toContainText('Mốc 4 ms');
  await expect(lab.getByLabel('Số worker')).toHaveValue('2');
  await lab.getByRole('button', { name: 'Chạy đến khi xong' }).click();
  await expect(lab.locator('.feedback[role=status]')).toContainText('mốc 6 ms');
  await lab.getByRole('button', { name: 'Bắt đầu lại', exact: true }).click();
  await expect(lab.locator('.cpu-io-clock')).toContainText('Mốc 0 ms');
});
test('invalid imported steps do not forge completion or overwrite derived CPU counters', async ({
  page,
}) => {
  await page.goto('/#/progress');
  await page
    .locator('input[type=file]')
    .setInputFiles({
      name: 'invalid-model.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          version: 1,
          lessons: {
            'cpu-io': {
              stage: 2,
              prediction: 0,
              challenge: -1,
              actions: 2,
              completed: false,
              lab: {
                mode: 'io',
                workers: 2,
                modelVersion: 1,
                step: 99,
                time: 999,
                finished: true,
                busy: 999,
              },
            },
          },
        }),
      ),
    });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/cpu-io');
  const lab = page.getByRole('region', { name: 'Thí nghiệm CPU và I/O' });
  await expect(lab.locator('.cpu-io-clock')).toContainText('Mốc 0 ms');
  await expect(lab.locator('.cpu-io-clock')).toContainText('CPU bận 0 ms');
  await expect(lab.getByRole('button', { name: 'Qua 1 ms', exact: true })).toBeEnabled();
});
