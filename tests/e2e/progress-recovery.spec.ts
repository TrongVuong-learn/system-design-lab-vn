import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('failed writes retain the latest lesson state and can be retried', async ({ page }) => {
  await page.addInitScript(() => {
    const control = window as Window & { failProgressWrites?: boolean };
    control.failProgressWrites = true;
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (
      this: IDBObjectStore,
      value: unknown,
      key?: IDBValidKey,
    ) {
      if (control.failProgressWrites && this.name === 'progress')
        throw new DOMException('Test quota', 'QuotaExceededError');
      return put.call(this, value, key);
    };
  });
  await page.goto('/#/learn/cache');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.getByRole('button', { name: 'Phòng 201', exact: false }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Chưa lưu được thay đổi mới');
  await expect(page.getByText('Bạn thấy phòng 201.', { exact: false })).toBeVisible();
  await page.evaluate(() => {
    (window as Window & { failProgressWrites?: boolean }).failProgressWrites = false;
  });
  await page.getByRole('button', { name: 'Thử lưu lại' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeVisible();
  await expect(page.getByText('Bạn thấy phòng 201.', { exact: false })).toBeVisible();
  await expect(page.getByText('Phòng 205', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Thử tình huống mới' })).toBeEnabled();
});

test('unreadable stored progress is preserved while a session can be exported', async ({
  page,
}) => {
  await page.goto('/#/progress');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).waitFor({ state: 'visible' });
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const r = indexedDB.open('system-design-lab');
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction('progress', 'readwrite');
      tx.objectStore('progress').put('unreadable fixture', 'current');
      tx.oncomplete = () => resolve();
      tx.onabort = () => reject(tx.error);
    });
    db.close();
  });
  await page.goto('/#/learn/cache');
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Chưa mở được bản lưu');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await expect(page.getByRole('button', { name: 'Thử lưu lại' })).toHaveCount(0);
  const stored = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve) => {
      const r = indexedDB.open('system-design-lab');
      r.onsuccess = () => resolve(r.result);
    });
    const value = await new Promise<unknown>((resolve) => {
      const r = db.transaction('progress', 'readonly').objectStore('progress').get('current');
      r.onsuccess = () => resolve(r.result);
    });
    db.close();
    return value;
  });
  expect(stored).toBe('unreadable fixture');
  await page.getByRole('link', { name: 'Mở Tiến độ để xuất bản lưu' }).click();
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const path = await (await downloaded).path();
  expect(JSON.parse(await readFile(path!, 'utf8')).lessons.cache.stage).toBe(1);
});

test('invalid and oversized imports preserve progress; exported progress can be restored', async ({
  page,
}) => {
  await page.goto('/#/learn/cache');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  const downloaded = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const exportPath = await (await downloaded).path();
  const exported = await readFile(exportPath!);
  const input = page.locator('input[type="file"]');
  for (const buffer of [
    Buffer.from('{"version":99,"lessons":{}}'),
    Buffer.from('x'.repeat(2_000_001)),
  ]) {
    await input.setInputFiles({ name: 'invalid.json', mimeType: 'application/json', buffer });
    await expect(page.getByText('Chưa nhập được:', { exact: false })).toBeVisible();
    await expect(page.getByText('Tiếp tục chặng 2/4', { exact: true })).toBeVisible();
  }
  await input.setInputFiles({
    name: 'empty.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"version":1,"lessons":{}}'),
  });
  await expect(page.getByText('Tiếp tục chặng 2/4', { exact: true })).toHaveCount(0);
  await input.setInputFiles({
    name: 'restored.json',
    mimeType: 'application/json',
    buffer: exported,
  });
  await expect(page.getByText('Tiếp tục chặng 2/4', { exact: true })).toBeVisible();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('Tiếp tục chặng 2/4', { exact: true })).toBeVisible();
});
