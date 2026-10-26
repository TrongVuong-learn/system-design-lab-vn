import { test, expect, type Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import type { Lesson } from '@sdl/content-schema';
import catalog from '../../apps/web/src/generated/catalog.json' with { type: 'json' };

const lessons = (catalog.lessons as Lesson[]).filter(
  (l) =>
    !['service-design', 'os-practice'].includes(l.id) &&
    l.chapters &&
    l.id !== 'requirements-boundaries' &&
    ![
      'api-contracts',
      'data-models',
      'database-indexes',
      'transactions-isolation',
      'service-delivery',
    ].includes(l.id),
);
async function apply(page: Page, lesson: Lesson) {
  await page.goto('/#/learn/' + lesson.id);
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.locator('.answer-options button').nth(lesson.prediction.answer).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  const lab = page.getByRole('region', { name: 'Bài tập tổng hợp module' });
  for (const [i, q] of lesson.practice!.items.entries())
    await lab.locator('fieldset').nth(i).getByRole('button').nth(q.answer).click();
  await lab.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true }).click();
  await page.getByRole('button', { name: 'Thử tình huống mới', exact: true }).click();
  await page.locator('.answer-options button').nth(lesson.challenge.answer).click();
}
for (const lesson of lessons) {
  test(
    lesson.id + ': mechanisms, checked practice and transfer completion persist',
    async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      await apply(page, lesson);
      const complete = page.getByRole('button', { name: 'Lưu bài đã hoàn thành' });
      if (lesson.designTask) {
        await expect(complete).toBeDisabled();
        const fields = page.locator('.design-draft textarea');
        await expect(fields).toHaveCount(lesson.designTask.deliverables.length + 1);
        for (let i = 0; i < lesson.designTask.deliverables.length + 1; i++)
          await fields
            .nth(i)
            .fill(
              'Lập luận thử nghiệm của học sinh, cần tự đối chiếu tiêu chí.\nGiới hạn: chỉ là bản nháp.',
            );
        await expect(
          page.getByText('Đã có bản nháp ở mọi mục. Nội dung tự viết chưa được chấm.'),
        ).toBeVisible();
      }
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
        .toBeLessThanOrEqual(1);
      await complete.click();
      await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
      await page.reload();
      await expect(
        page.getByRole('button', {
          name: lesson.designTask
            ? 'Đã lưu bài tự luyện và bản thiết kế'
            : 'Đã hoàn thành bài nhập môn',
        }),
      ).toBeVisible();
      expect(errors).toEqual([]);
    },
  );
}
test('all pathways filter to available lessons and module search finds its content', async ({
  page,
}) => {
  await page.goto('/#/explore');
  const filter = page.getByLabel('Học theo lộ trình');
  await filter.selectOption('capstones');
  await expect(page.locator('.lesson-card')).toHaveCount(6);
  await filter.selectOption('cases');
  await expect(page.locator('.lesson-card')).toHaveCount(8);
  for (const track of catalog.pathways.tracks) {
    await page.getByRole('button', { name: track.title, exact: true }).click();
    await expect(filter).toHaveValue(track.id);
    await expect(filter).toBeFocused();
    await expect(page.locator('.lesson-card')).toHaveCount(track.lessonIds.length);
  }
  await filter.selectOption('all');
  await page.getByRole('textbox', { name: 'Tìm bài học hoặc chủ đề' }).fill('L3.2');
  await expect(page.locator('.lesson-card')).toHaveCount(1);
  await expect(page.locator('.lesson-card')).toHaveAttribute('href', '#/learn/consensus-raft');
});
test('design drafts survive partial reload, redoing practice, export/import and offline', async ({
  page,
  context,
}) => {
  const lesson = lessons.find((l) => l.id === 'track-ai')!;
  await apply(page, lesson);
  const fields = page.locator('.design-draft textarea');
  const note =
    'Truy xuất tài liệu → kiểm tra quyền → tạo câu trả lời.\nĐo tỷ lệ câu trả lời có căn cứ.';
  await fields.first().fill(note);
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(fields.first()).toHaveValue(note);
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollWidth - innerWidth))
    .toBeLessThanOrEqual(1);
  await expect(page.getByRole('button', { name: 'Lưu bài đã hoàn thành' })).toBeDisabled();
  await page.getByRole('button', { name: 'Chặng trước', exact: true }).click();
  await page.getByRole('button', { name: 'Làm lại bài áp dụng', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Thử tình huống mới', exact: true }),
  ).toBeDisabled();
  const lab = page.getByRole('region', { name: 'Bài tập tổng hợp module' });
  for (const [i, q] of lesson.practice!.items.entries())
    await lab.locator('fieldset').nth(i).getByRole('button').nth(q.answer).click();
  await lab.getByRole('button', { name: 'Kiểm tra bài áp dụng', exact: true }).click();
  await page.getByRole('button', { name: 'Thử tình huống mới', exact: true }).click();
  await expect(fields.first()).toHaveValue(note);
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.goto('/#/progress');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Xuất bản lưu' }).click();
  const data = await readFile((await (await download).path())!, 'utf8');
  expect(
    JSON.parse(data).lessons['track-ai'].lab['design-' + lesson.designTask!.deliverables[0]!.id],
  ).toBe(note);
  const fresh = await context.browser()!.newContext({ baseURL: new URL(page.url()).origin });
  const restored = await fresh.newPage();
  try {
    await restored.goto('/#/progress');
    await expect(restored.getByRole('button', { name: 'Nhập bản lưu', exact: true })).toBeEnabled();
    await restored.locator('input[type=file]').setInputFiles({
      name: 'progress.json',
      mimeType: 'application/json',
      buffer: Buffer.from(
        JSON.stringify({
          ...JSON.parse(data),
          lessons: {
            ...JSON.parse(data).lessons,
            'track-ai': { ...JSON.parse(data).lessons['track-ai'], completed: true },
          },
        }),
      ),
    });
    await expect(restored.getByRole('status').filter({ hasText: 'Đã nhập' })).toBeVisible();
    // Import acknowledgement is in-memory; a full navigation must await durable storage.
    await expect(restored.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
    await restored.goto('/#/learn/track-ai');
    await expect(restored.locator('.design-draft textarea').first()).toHaveValue(note);
    await expect(restored.getByRole('button', { name: 'Lưu bài đã hoàn thành' })).toBeDisabled();
    await expect(
      restored.getByRole('button', { name: 'Đã lưu bài tự luyện và bản thiết kế' }),
    ).toHaveCount(0);
  } finally {
    await fresh.close();
  }
  const panel = page.getByRole('region', { name: 'Học khi mất mạng' });
  await panel.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(panel.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 20000 });
  await context.setOffline(true);
  await page.goto('/#/learn/capstone-architecture');
  await expect(page.getByRole('region', { name: 'Giải thích từng cơ chế' })).toBeVisible();
  await page.goto('/#/learn/track-ai');
  await page.reload();
  await expect(fields.first()).toHaveValue(note);
});
