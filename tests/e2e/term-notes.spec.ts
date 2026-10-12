import { expect, test } from '@playwright/test';

test('inline definitions open with focus and dismiss with Escape or close', async ({ page }) => {
  await page.goto('/#/learn/request');
  const term = page
    .locator('.story-panel')
    .getByRole('button', { name: 'Giải thích: yêu cầu', exact: false });
  await term.focus();
  const note = page.getByRole('dialog', { name: 'Giải thích: Yêu cầu', exact: true });
  await expect(note).toBeVisible();
  await expect(note).toContainText('Thông điệp xin máy xử lý làm một việc');
  await page.keyboard.press('Escape');
  await expect(note).toBeHidden();
  await term.click();
  await expect(note).toBeVisible();
  await note.getByRole('button', { name: 'Đóng giải thích Yêu cầu' }).click();
  await expect(note).toBeHidden();
  await expect(term).toBeFocused();
  await expect(term).toHaveAttribute('aria-expanded', 'false');
});

test('mouse hover keeps definition readable across pointer movement', async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, 'Hover is exercised on desktop; touch has its own test.');
  await page.goto('/#/learn/request');
  const term = page
    .locator('.story-panel')
    .getByRole('button', { name: 'Giải thích: yêu cầu', exact: false });
  await term.hover();
  const note = page.getByRole('dialog', { name: 'Giải thích: Yêu cầu', exact: true });
  await expect(note).toBeVisible();
  await note.hover();
  await expect(note).toBeVisible();
  await page.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true }).hover();
  await expect(note).toBeHidden();
});

test('tap toggles on mobile and glossary still provides all definitions', async ({
  page,
  hasTouch,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/#/learn/request');
  const term = page
    .locator('.story-panel')
    .getByRole('button', { name: 'Giải thích: yêu cầu', exact: false });
  if (hasTouch) await term.tap();
  else await term.click();
  const note = page.getByRole('dialog', { name: 'Giải thích: Yêu cầu', exact: true });
  await expect(note).toBeVisible();
  const box = await note.boundingBox();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(320);
  if (hasTouch) await term.tap();
  else await term.click();
  await expect(note).toBeHidden();
  await page.getByText('Giải thích từ mới', { exact: true }).click();
  await expect(
    page.getByText('Thời gian từ khi gửi yêu cầu đến khi nhận câu trả lời.', { exact: true }),
  ).toBeHidden();
  await page
    .locator('.glossary')
    .getByRole('button', { name: 'Giải thích: Độ trễ', exact: true })
    .click();
  await expect(page.getByRole('dialog', { name: 'Giải thích: Độ trễ', exact: true })).toContainText(
    'Thời gian từ khi gửi yêu cầu',
  );
  await page.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Đưa ra dự đoán' })).toBeEnabled();
});

test('plain glossary remains usable when Popover API is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Reflect.deleteProperty(HTMLElement.prototype, 'showPopover');
  });
  await page.goto('/#/learn/request');
  await expect(page.locator('.story-panel')).toContainText('yêu cầu');
  await expect(page.locator('.term-trigger')).toHaveCount(0);
  await page.getByText('Giải thích từ mới', { exact: true }).click();
  await expect(
    page.getByText('Thông điệp xin máy xử lý làm một việc, như tìm lịch học.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Đưa ra dự đoán' })).toBeEnabled();
});
