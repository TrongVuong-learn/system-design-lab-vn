import { expect, test, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { lessonSchema } from '@sdl/content-schema';
const lessons = (
  JSON.parse(
    readFileSync(new URL('../../content/lessons/vi/intro.json', import.meta.url), 'utf8'),
  ) as unknown[]
).map((l) => lessonSchema.parse(l));

async function openLab(page: Page, id: string) {
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  const l = lessons.find((l) => l.id === id)!;
  await page
    .getByRole('button', { name: l.prediction.options[l.prediction.answer], exact: false })
    .click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
function metric(page: Page, label: string) {
  return page
    .locator('.metric')
    .filter({ has: page.getByText(label, { exact: true }) })
    .locator('strong');
}

test('all six lessons complete, retain correct model outcomes and resume without JS errors', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('response', (r) => {
    if (r.status() >= 400 && r.url().startsWith('http://127.0.0.1'))
      errors.push(`${r.status()} ${r.url()}`);
  });
  for (const l of lessons) {
    await openLab(page, l.id);
    if (l.id === 'request') {
      for (let i = 0; i < 3; i++)
        await page.getByRole('button', { name: 'Từng bước', exact: true }).click();
      await expect(
        page.getByText('Đã nhận lịch. Tổng thời gian: 120 ms.', { exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'Từng bước', exact: true })).toBeDisabled();
    } else if (l.id === 'balance') {
      await expect(metric(page, 'Lượt đọc còn chờ')).toContainText('4');
      await page.getByRole('button', { name: 'Tăng Số máy xử lý' }).click();
      await expect(metric(page, 'Lượt đọc còn chờ')).toContainText('4');
      await page.getByRole('checkbox', { name: 'Thêm cache', exact: false }).check();
      await expect(metric(page, 'Lượt đọc còn chờ')).toContainText('0');
    } else if (l.id === 'cache') {
      await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
      await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
      await expect(metric(page, 'Lượt thấy dữ liệu cũ')).toHaveText('1');
      await expect(metric(page, 'Xem qua cache')).toHaveText('1');
      await expect(metric(page, 'Xem qua nguồn')).toHaveText('0');
      await page.getByRole('button', { name: 'Lấy lịch mới', exact: true }).click();
      await expect(metric(page, 'Lượt xem')).toHaveText('1');
      await expect(metric(page, 'Xem qua nguồn')).toHaveText('0');
      await expect(page.getByText('Các số trên chỉ đếm lượt bấm', { exact: false })).toBeVisible();
      for (let i = 0; i < 5; i++)
        await page.getByRole('button', { name: 'Qua 1 phút', exact: true }).click();
      await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
      await expect(metric(page, 'Lượt xem')).toHaveText('2');
      await expect(metric(page, 'Xem qua nguồn')).toHaveText('1');
      await expect(page.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText(
        'trả phòng 205',
      );
    } else if (l.id === 'queue') {
      await page.getByRole('button', { name: 'Qua 1 giây' }).click();
      await expect(metric(page, 'Đã nhận')).toHaveText('6');
      await expect(metric(page, 'Đã làm xong')).toHaveText('2');
      await expect(metric(page, 'Đang chờ')).toHaveText('4');
      await page.getByRole('button', { name: 'Đặt lại hàng đợi' }).click();
      await expect(metric(page, 'Đang chờ')).toHaveText('0');
    } else if (l.id === 'replica') {
      await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
      await expect(
        page.getByText('Nguồn chính ghi 205, bản sao vẫn trả 201.', { exact: false }),
      ).toBeVisible();
      for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Qua 1 giây' }).click();
      await expect(
        page
          .getByRole('group', { name: 'Các thành phần của mô hình' })
          .getByText('Phòng 205', { exact: true }),
      ).toHaveCount(2);
    } else {
      await page.getByRole('button', { name: 'Tăng Số máy xử lý' }).click();
      await page.getByRole('checkbox', { name: 'Thêm cache', exact: false }).check();
      for (let i = 0; i < 2; i++)
        await page.getByRole('button', { name: 'Tăng Worker gửi thông báo' }).click();
      await expect(
        page.getByText('Đạt tải đọc, tải gửi và ngân sách', { exact: false }),
      ).toBeVisible();
      await expect(metric(page, 'Chi phí giả lập')).toHaveText('6 / 6');
    }
    await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
    const wrong = l.challenge.options.find((_, i) => i !== l.challenge.answer)!;
    await page.getByRole('button', { name: wrong, exact: false }).click();
    await expect(page.getByRole('button', { name: 'Lưu bài đã hoàn thành' })).toHaveCount(0);
    await page
      .getByRole('button', { name: l.challenge.options[l.challenge.answer], exact: false })
      .click();
    await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByText('Một bước hiểu mới của bạn.', { exact: true })).toBeVisible();
  }
  await page.goto('/#/progress');
  await expect(page.getByText('Ôn lại và thử thêm', { exact: true })).toHaveCount(6);
  expect(errors).toEqual([]);
});

test('two tabs cannot silently overwrite saved progress', async ({ page, context }) => {
  const other = await context.newPage();
  await page.goto('/#/learn/cache');
  await other.goto('/#/learn/queue');
  await expect(other.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await other.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await expect(other.getByRole('alert')).toContainText('tab khác');
  await other.goto('/#/progress');
  await expect(other.getByText('Tiếp tục chặng 2/4', { exact: true })).toBeVisible();
  const download = other.waitForEvent('download');
  await other.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const exportPath = await (await download).path();
  expect(JSON.parse(await readFile(exportPath!, 'utf8')).lessons.queue.stage).toBe(1);
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Dự đoán', exact: true })).toBeVisible();
  await other.close();
});

test('stepper boundaries, missing routes and keyboard skip remain usable', async ({
  page,
  browserName,
}) => {
  await page.goto('/');
  await page.keyboard.press(
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.getByRole('link', { name: 'Đến nội dung chính' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await openLab(page, 'replica');
  for (let i = 0; i < 3; i++)
    await page.getByRole('button', { name: 'Giảm Độ trễ sao chép' }).click();
  await expect(page.getByRole('button', { name: 'Giảm Độ trễ sao chép' })).toBeDisabled();
  for (let i = 0; i < 5; i++)
    await page.getByRole('button', { name: 'Tăng Độ trễ sao chép' }).click();
  await expect(page.getByRole('button', { name: 'Tăng Độ trễ sao chép' })).toBeDisabled();
  await page.goto('/#/learn/unknown');
  await expect(page.getByRole('heading', { name: 'Chưa tìm thấy trang này.' })).toBeVisible();
  await page.goto('/#/levels/L9');
  await expect(page.getByRole('heading', { name: 'Chưa tìm thấy trang này.' })).toBeVisible();
});

test('malformed imported model checkpoints cannot show negative jobs or invalid rooms', async ({
  page,
}) => {
  const checkpoint = { stage: 2, prediction: 0, challenge: -1, actions: 2, completed: false };
  const progress = {
    version: 1,
    lessons: {
      queue: { ...checkpoint, lab: { second: 1, received: 6, processed: 2, queued: -4 } },
      replica: { ...checkpoint, lab: { time: -1, primary: 'NaN', replica: 201, pending: '[]' } },
    },
  };
  await page.goto('/#/progress');
  await expect(page.getByRole('button', { name: 'Nhập bản lưu' })).toBeEnabled();
  await page.locator('input[type="file"]').setInputFiles({
    name: 'checkpoint.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(progress)),
  });
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/learn/queue');
  await expect(metric(page, 'Đang chờ')).toHaveText('0');
  await page.getByRole('button', { name: 'Qua 1 giây' }).click();
  await expect(metric(page, 'Đang chờ')).toHaveText('4');
  await page.goto('/#/learn/replica');
  await expect(
    page
      .getByRole('group', { name: 'Các thành phần của mô hình' })
      .getByText('Phòng 201', { exact: true }),
  ).toHaveCount(2);
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
  await expect(
    page
      .getByRole('group', { name: 'Các thành phần của mô hình' })
      .getByText('Phòng 205', { exact: true }),
  ).toBeVisible();
});

test('search handles accents, case, surrounding spaces and empty results', async ({ page }) => {
  await page.goto('/#/explore');
  const input = page.getByRole('textbox', { name: 'Tìm bài học hoặc chủ đề' });
  await input.fill('  CACHE  ');
  await expect(
    page.getByRole('heading', { name: 'Vì sao vẫn hiện phòng học cũ?', exact: true }),
  ).toBeVisible();
  await input.fill('HANG DOI');
  await expect(
    page.getByRole('heading', { name: 'Nhận việc chưa phải làm xong', exact: true }),
  ).toBeVisible();
  await input.fill('no-such-topic-123');
  await expect(
    page.getByText('Không tìm thấy chủ đề. Thử từ khóa ngắn hơn.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByText('Chưa có bài thử cho từ khóa này.', { exact: false })).toBeVisible();
  await input.fill('   ');
  await expect(page.locator('.lesson-grid>a')).toHaveCount(16);
  await expect(page.locator('.level-list>a')).toHaveCount(6);
});

test('upgrades existing v1 storage without losing progress and blocks old-version writers', async ({
  page,
}) => {
  await page.goto('/icon.svg');
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('system-design-lab', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('progress');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('progress', 'readwrite');
      tx.objectStore('progress').put(
        JSON.stringify({
          version: 1,
          lessons: {
            cache: {
              stage: 1,
              prediction: 0,
              challenge: -1,
              actions: 0,
              completed: false,
              lab: {},
            },
          },
        }),
        'current',
      );
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  await page.goto('/#/learn/cache');
  await expect(page.getByRole('heading', { name: 'Dự đoán', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Phòng 201', exact: false })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const legacyError = await page.evaluate(
    () =>
      new Promise<string>((resolve) => {
        const r = indexedDB.open('system-design-lab', 1);
        r.onerror = () => resolve(r.error?.name ?? 'unknown');
        r.onsuccess = () => {
          r.result.close();
          resolve('unexpected success');
        };
      }),
  );
  expect(legacyError).toBe('VersionError');
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeFocused();
});
