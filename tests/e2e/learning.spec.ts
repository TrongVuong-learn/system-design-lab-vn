import { expect, test } from '@playwright/test';
test('learn cache, observe stale data, complete and resume after reload', async ({ page }) => {
  await page.goto('/#/learn/cache');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await page.getByRole('button', { name: 'Phòng 201', exact: false }).click();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(page.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText(
    'phòng 201 từ cache',
  );
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Xem lịch', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText(
    'phòng 201 từ cache',
  );
  await page.getByRole('button', { name: 'Lấy lịch mới', exact: true }).click();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(page.getByRole('region', { name: 'So sánh bước vừa thử' })).toContainText(
    'phòng 205 từ cache',
  );
  await expect(page.locator('.time-badge')).toContainText('Phút');
  await page.getByRole('button', { name: 'Thử tình huống mới' }).click();
  await page.getByText('Giới hạn tình huống', { exact: true }).click();
  await expect(
    page.getByText('Đồng hồ trong lab và câu hỏi đều dùng phút mô phỏng.', { exact: false }),
  ).toBeVisible();
  await page
    .getByRole('button', { name: 'Không; dữ liệu có thể cũ quá một phút.', exact: false })
    .click();
  await page.getByRole('button', { name: 'Lưu bài đã hoàn thành' }).click();
  await expect(page.getByText('Một bước hiểu mới của bạn.')).toBeVisible();
  await page.goto('/#/progress');
  await expect(page.getByText('Ôn lại và thử thêm')).toBeVisible();
});
test('curriculum has 6 modules per level and no unpublished start button', async ({ page }) => {
  await page.goto('/#/levels/L3');
  await expect(page.locator('.module-list>div')).toHaveCount(6);
  await expect(page.getByText('Đang biên soạn', { exact: true })).toHaveCount(6);
  await expect(page.getByRole('link', { name: /Bắt đầu thí nghiệm/ })).toHaveCount(0);
});
test('all core screens fit a narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  for (const path of ['/', '/explore', '/progress', '/learn/cache']) {
    await page.goto(`/#${path}`);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  }
});
test('home experiment demonstrates stale cache without completing a lesson', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
  await expect(page.getByText('Chưa nhận thay đổi', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Bạn thấy phòng 201.');
  await page.getByRole('button', { name: 'Lấy lịch mới', exact: true }).click();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Bạn thấy phòng 205.');
  await page.goto('/#/progress');
  await expect(page.getByText('Ôn lại và thử thêm')).toHaveCount(0);
});
test('lesson stages explain the next action and restore keyboard focus', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/learn/cache');
  await expect(page.getByRole('heading', { name: 'Hiểu câu chuyện', exact: true })).toBeFocused();
  await expect(
    page.getByRole('list', { name: 'Các chặng học' }).locator('[aria-current="step"]'),
  ).toContainText('Hiểu câu chuyện');
  await page.getByRole('button', { name: 'Đưa ra dự đoán' }).click();
  await expect(page.getByRole('heading', { name: 'Dự đoán', exact: true })).toBeFocused();
  await expect(page.getByRole('button', { name: 'Mở thí nghiệm' })).toBeDisabled();
  await page.keyboard.press(
    browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab',
  );
  await expect(page.getByRole('button', { name: 'Phòng 201', exact: false })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Mở thí nghiệm' })).toBeEnabled();
  await page.getByRole('button', { name: 'Mở thí nghiệm' }).click();
  await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeFocused();
  await expect(
    page.getByText('Thử thêm 2 thao tác để mở chặng áp dụng.', { exact: true }),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Xem lịch', exact: true }).click();
  await expect(
    page.getByText('Thử thêm 1 thao tác để mở chặng áp dụng.', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Thử tình huống mới' })).toBeDisabled();
  await page.getByRole('button', { name: 'Đổi phòng ở nguồn' }).click();
  await expect(page.getByRole('button', { name: 'Thử tình huống mới' })).toBeEnabled();
  await expect(page.getByText('Đã lưu trên thiết bị', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Tự thử', exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Chặng trước' }).click();
  await expect(page.getByRole('heading', { name: 'Dự đoán', exact: true })).toBeFocused();
});
