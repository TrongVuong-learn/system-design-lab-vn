import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
async function clicks(page: Page, name: string, count: number) {
  for (let i = 0; i < count; i++) await page.getByRole('button', { name, exact: true }).click();
}
async function cache(page: Page) {
  await page.getByRole('checkbox', { name: /Dùng cache đọc lịch/ }).check();
  await clicks(page, 'Giảm Thời hạn bản ghi', 4);
}
test('two scenarios require actual runs, explain backlog, preserve reflection and never complete lessons', async ({
  page,
}) => {
  await page.goto('/#/explore');
  await page.getByRole('link', { name: 'Thử bài ôn website trường' }).click();
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  const result = page.getByRole('region', { name: 'Kết quả lần chạy gần nhất' });
  await expect(page.getByRole('heading', { name: 'Kiểm từng yêu cầu' })).toBeFocused();
  await expect(result).toContainText('16 việc chờ');
  await clicks(page, 'Tăng Server đọc lịch', 1);
  await cache(page);
  await clicks(page, 'Tăng Worker gửi thông báo', 2);
  await expect(result).toContainText('Bạn đã đổi phương án');
  await expect(page.getByRole('button', { name: 'Lưu lượt ôn', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  await expect(result).toContainText('Phương án đạt');
  const reflection = page.locator('#review-reflection');
  await reflection.fill(
    'Cache giảm tải đọc nguồn; worker riêng làm xong việc gửi. Hit75% chỉ là giả định.',
  );
  await page.getByRole('button', { name: 'Lưu lượt ôn', exact: true }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Đã lưu lượt ôn', exact: true })).toBeVisible();
  await expect(reflection).toHaveValue(/Hit75%/);
  await page.getByRole('button', { name: /2\. Thông báo đã dồn lại/ }).click();
  await cache(page);
  await clicks(page, 'Tăng Worker gửi thông báo', 3);
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  await expect(result).toContainText('8 việc chờ sau 4 giây');
  await clicks(page, 'Tăng Worker gửi thông báo', 1);
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  await expect(result).toContainText('0 việc chờ sau 4 giây');
  await reflection.fill(
    'Công suất cần lớn hơn việc mới để giảm tám việc tồn. Thêm worker tốn điểm ngân sách.',
  );
  await page.getByRole('button', { name: 'Lưu lượt ôn', exact: true }).click();
  await page.getByText('Xem hàng chờ từng giây', { exact: true }).click();
  await expect(page.getByRole('row', { name: '4 10 việc 0 việc' })).toBeVisible();
  await page.getByText('So với lần chạy trước', { exact: true }).click();
  await expect(page.getByRole('row', { name: 'Việc còn chờ 8 0' })).toBeVisible();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  await expect(page.locator('.progress-summary')).toContainText('0 / 14');
  await expect(page.getByRole('region', { name: 'Ôn tổng hợp' })).toContainText('Đã lưu 2/2');
});
test('old lesson saves survive review export/import and narrow reduced-motion UI', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/progress');
  const old = {
    version: 1,
    lessons: {
      cache: {
        stage: 2,
        prediction: 0,
        challenge: -1,
        actions: 2,
        completed: false,
        lab: { source: 205, cached: 201 },
      },
    },
  };
  await page.locator('input[type=file]').setInputFiles({
    name: 'old.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(old)),
  });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Thử bài ôn website trường' }).click();
  await page.getByRole('button', { name: 'Giải thích: cache', exact: true }).click();
  await expect(page.locator('.term-note:popover-open')).toBeVisible();
  await page.getByRole('button', { name: /^Đóng giải thích/ }).click();
  await clicks(page, 'Tăng Server đọc lịch', 1);
  await page.getByRole('button', { name: 'Mở gợi ý 1', exact: true }).click();
  await page.locator('#review-reflection').fill('Tôi muốn kiểm đường đọc và việc gửi riêng.');
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const download = await downloading;
  const json = JSON.parse(await readFile((await download.path())!, 'utf8'));
  expect(json.lessons).toEqual(old.lessons);
  expect(json.reviews['school-day'].hints.opening).toBe(1);
  await page.locator('input[type=file]').setInputFiles({
    name: 'restored.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(json)),
  });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Tiếp tục ôn website trường' }).click();
  await expect(page.locator('#review-reflection')).toHaveValue(
    'Tôi muốn kiểm đường đọc và việc gửi riêng.',
  );
  await expect(page.getByText('Gợi ý 1:', { exact: true })).toBeVisible();
});
test('failed review writes retain state, retry once and clear stale result on reset', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as Window & { failReviewWrites?: boolean };
    w.failReviewWrites = true;
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (
      this: IDBObjectStore,
      value: unknown,
      key?: IDBValidKey,
    ) {
      if (w.failReviewWrites && this.name === 'progress')
        throw new DOMException('Test quota', 'QuotaExceededError');
      return put.call(this, value, key);
    };
  });
  await page.goto('/#/review/school-day');
  await clicks(page, 'Tăng Server đọc lịch', 1);
  await page.getByRole('button', { name: 'Chạy phương án', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Chưa lưu được');
  await page.evaluate(() => {
    (window as Window & { failReviewWrites?: boolean }).failReviewWrites = false;
  });
  await page.getByRole('button', { name: 'Thử lưu lại', exact: true }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('region', { name: 'Kết quả lần chạy gần nhất' })).toBeVisible();
  await page.getByRole('button', { name: 'Đặt lại phương án', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Kết quả lần chạy gần nhất' })).toHaveCount(0);
  await page.goto('/#/review/unknown');
  await expect(page.getByRole('heading', { name: 'Chưa có bài ôn này.' })).toBeVisible();
});
