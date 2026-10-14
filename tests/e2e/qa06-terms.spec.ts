import { test, expect } from '@playwright/test';
test('case feedback explains backlog and payload at the point of reading', async ({ page }) => {
  for (const [id, word] of [
    ['network', 'payload'],
    ['queue', 'backlog'],
  ]) {
    await page.goto(`/#/learn/${id}`);
    await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
    await page.locator('.answer-options button').first().click();
    await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
    const action = page.locator('.lab-panel').getByRole('button', { disabled: false }).first();
    await action.click();
    await action.click();
    await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
    await page.locator('.answer-options button').nth(1).click();
    const area =
      id === 'network'
        ? page.locator('.case-reflection')
        : page.locator('.question-panel .feedback');
    await area.getByRole('button', { name: `Giải thích: ${word}`, exact: true }).click();
    await expect(page.locator('.term-note:popover-open')).toBeVisible();
    await expect(page.locator('.term-note:popover-open')).toContainText(
      id === 'network' ? 'dữ liệu ảnh' : 'công việc chưa hoàn thành',
    );
    await page.getByRole('button', { name: /^Đóng giải thích/ }).click();
  }
});
