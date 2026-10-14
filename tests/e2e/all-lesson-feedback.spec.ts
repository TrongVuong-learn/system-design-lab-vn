import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Lesson } from '@sdl/content-schema';
const lessons = ['intro', 'foundations', 'web-network', 'routing'].flatMap(
  (f) => JSON.parse(readFileSync(`content/lessons/vi/${f}.json`, 'utf8')) as Lesson[],
);
async function narrative(page: Page) {
  return page.locator('.question-panel .feedback > div > p').evaluate((element) => {
    const prose = element.cloneNode(true) as HTMLElement;
    prose.querySelectorAll('.term-note').forEach((note) => note.remove());
    return prose.textContent?.trim();
  });
}
for (const ids of [
  ['request', 'balance', 'replica', 'design'],
  ['metrics', 'dns', 'transport', 'capacity'],
  ['http', 'routing'],
]) {
  test(`remaining lessons show saved observations and progressive hints: ${ids.join(', ')}`, async ({
    page,
  }) => {
    for (const id of ids) {
      const l = lessons.find((x) => x.id === id)!;
      await page.goto(`/#/learn/${id}`);
      await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
      await page
        .locator('.answer-options button')
        .nth((l.prediction.answer + 1) % l.prediction.options.length)
        .click();
      await expect.poll(() => narrative(page)).not.toBe(l.prediction.explanation);
      await page.getByRole('button', { name: 'Mở gợi ý 1' }).click();
      await expect(page.getByRole('region', { name: 'Gợi ý 1' })).toBeVisible();
      await page.getByRole('button', { name: 'Mở gợi ý 2' }).click();
      await page.getByRole('button', { name: 'Xem lời giải' }).click();
      await expect.poll(() => narrative(page)).toBe(l.prediction.explanation);
      await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
      const action =
        id === 'transport'
          ? page.getByRole('button', { name: /Gửi ba mảnh|Nhận tại đích|Xem bước khôi phục/ })
          : page.locator('.lab-panel').getByRole('button', { disabled: false }).first();
      await action.click();
      await action.click();
      const comparison = page.getByRole('region', { name: 'So sánh bước vừa thử' });
      await expect(comparison).toBeVisible();
      await expect(
        comparison.getByRole('columnheader', { name: 'Sau', exact: true }),
      ).toBeVisible();
      const last = await comparison.innerText();
      await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
      await page.reload();
      await expect(comparison).toHaveText(last, { useInnerText: true });
      await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
      await page
        .locator('.answer-options button')
        .nth((l.challenge.answer + 1) % l.challenge.options.length)
        .click();
      await expect(page.getByRole('button', { name: 'Mở gợi ý 1' })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Lợi ích và đánh đổi' })).toHaveCount(0);
      await page.locator('.answer-options button').nth(l.challenge.answer).click();
      await expect(page.getByRole('heading', { name: 'Lợi ích và đánh đổi' })).toBeVisible();
    }
  });
}
