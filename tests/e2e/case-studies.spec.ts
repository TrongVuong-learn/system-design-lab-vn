import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Lesson } from '@sdl/content-schema';
const lessons = ['intro', 'foundations', 'web-network'].flatMap(
  (name) => JSON.parse(readFileSync(`content/lessons/vi/${name}.json`, 'utf8')) as Lesson[],
);

test('case context, feedback and a return to the lab preserve the learner work', async ({
  page,
}) => {
  for (const id of ['cache', 'network', 'queue']) {
    const lesson = lessons.find((l) => l.id === id)!;
    await page.goto(`/#/learn/${id}`);
    await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
    await page.locator('.answer-options').getByRole('button').first().click();
    await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
    const action = page.locator('.lab-panel').getByRole('button', { disabled: false }).first();
    await action.click();
    await action.click();
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    const before = await page.locator('.lab-panel').innerText();
    await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
    await expect(
      page.getByRole('heading', { name: lesson.caseStudy!.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByText('Tình huống giả định', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Lợi ích và đánh đổi' })).toHaveCount(0);
    await page.locator('.answer-options').getByRole('button').nth(lesson.challenge.answer).click();
    await expect(page.getByRole('heading', { name: 'Lợi ích và đánh đổi' })).toBeVisible();
    await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
    await page.getByRole('button', { name: 'Thử lại trong thí nghiệm', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeFocused();
    await expect(page.locator('.lab-panel')).toHaveText(before, { useInnerText: true });
    await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
    await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
    await expect(page.locator('.answer-option[aria-pressed="true"]')).toContainText(
      lesson.challenge.options[lesson.challenge.answer]!,
    );
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
  }
});

test('legacy v1 completed checkpoints show all twelve new cases without regrading', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const old = {
    version: 1,
    lessons: Object.fromEntries(
      lessons.map((l) => [
        l.id,
        {
          stage: 3,
          prediction: l.prediction.answer,
          challenge: l.challenge.answer,
          actions: 2,
          completed: true,
          lab: {},
        },
      ]),
    ),
  };
  await page.evaluate(async (value) => {
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('system-design-lab', 2);
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const db = request.result,
          tx = db.transaction('progress', 'readwrite');
        tx.objectStore('progress').put(JSON.stringify(value), 'current');
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      };
    });
  }, old);
  await page.reload();
  for (const lesson of lessons) {
    await page.goto(`/#/learn/${lesson.id}`);
    await expect(
      page.getByRole('heading', { name: lesson.caseStudy!.title, exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('button', { name: 'Đã hoàn thành bài nhập môn' })).toBeVisible();
    await expect(page.locator('.answer-option[aria-pressed="true"]')).toContainText(
      lesson.challenge.options[lesson.challenge.answer]!,
    );
  }
});
