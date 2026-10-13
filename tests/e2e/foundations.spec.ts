import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import type { Lesson } from '@sdl/content-schema';
const lessons = JSON.parse(readFileSync('content/lessons/vi/foundations.json', 'utf8')) as Lesson[];
async function openLab(page: Page, id: string) {
  await page.goto(`/#/learn/${id}`);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-option').first().click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
}
test('four foundations teach the model, resume, and complete with a new scenario', async ({
  page,
}) => {
  for (const lesson of lessons) {
    await openLab(page, lesson.id);
    if (lesson.id === 'metrics') {
      await page.getByRole('button', { name: 'Tăng Số thủ thư' }).click();
      await page.getByRole('button', { name: 'Hai việc cuối: 100 ms', exact: true }).click();
      await expect(page.locator('.metrics')).toContainText('550');
      await expect(page.locator('.metrics')).toContainText('1.900');
    } else if (lesson.id === 'dns') {
      await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
      await page.getByRole('button', { name: 'Đổi IP ở nguồn' }).click();
      await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
      await expect(page.locator('.lab-panel [role=status]')).toContainText(
        'dùng cache: 203.0.113.10',
      );
      for (let i = 0; i < 5; i++) await page.getByRole('button', { name: 'Qua 1 giây' }).click();
      await page.getByRole('button', { name: 'Tra địa chỉ', exact: true }).click();
      await expect(page.locator('.lab-panel [role=status]')).toContainText(
        'lấy nguồn: 203.0.113.20',
      );
    } else if (lesson.id === 'transport') {
      await page.getByRole('button', { name: 'Gửi ba mảnh' }).click();
      await page.getByRole('button', { name: 'Nhận tại đích' }).click();
      await expect(page.getByText('Giữ trong bộ đệm', { exact: true })).toBeVisible();
      await page.getByRole('button', { name: 'Xem bước khôi phục' }).click();
      await expect(page.getByText('Ứng dụng nhận', { exact: true })).toHaveCount(4);
      await page.getByRole('button', { name: 'UDP', exact: true }).click();
      await page.getByRole('button', { name: 'Gửi ba mảnh' }).click();
      await page.getByRole('button', { name: 'Nhận tại đích' }).click();
      await page.getByRole('button', { name: 'Xem bước khôi phục' }).click();
      await expect(page.locator('.lab-panel [role=status]')).toContainText('không tự gửi lại');
    } else {
      await page.getByRole('button', { name: 'Tăng Lượt mỗi người mỗi ngày' }).click();
      await page.getByRole('button', { name: 'Tăng Lượt mỗi người mỗi ngày' }).click();
      await expect(page.locator('.metrics')).toContainText('1.200');
      await expect(page.locator('.metrics')).toContainText('100');
    }
    await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    const before = await page.locator('.lab-panel').innerText();
    await page.reload();
    await expect(page.locator('.lab-panel')).toHaveText(before, { useInnerText: true });
    await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
    await page
      .locator('.answer-option')
      .nth((lesson.challenge.answer + 1) % lesson.challenge.options.length)
      .click();
    await expect(page.getByText('Cùng nhìn lại nguyên nhân.')).toBeVisible();
    await page.locator('.answer-option').nth(lesson.challenge.answer).click();
    await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
    await expect(page.getByText('Một bước hiểu mới của bạn.')).toBeVisible();
  }
  await page.goto('/#/progress');
  await expect(page.getByText('Ôn lại và thử thêm', { exact: true })).toHaveCount(4);
});
