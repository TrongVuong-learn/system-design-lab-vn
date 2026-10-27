import { expect, test } from '@playwright/test';

test('production policy permits lessons, game animation, WASM and offline without CSP violations', async ({
  page,
}) => {
  const violations: string[] = [];
  await page.exposeFunction('recordPolicyViolation', (value: string) => violations.push(value));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', (event) => {
      void (
        window as unknown as { recordPolicyViolation: (value: string) => Promise<void> }
      ).recordPolicyViolation(
        `${event.violatedDirective}: ${event.blockedURI} at ${event.sourceFile}:${event.lineNumber}:${event.columnNumber}`,
      );
    });
  });
  const response = await page.goto('/');
  expect(response?.headers()['content-security-policy']).toContain(
    "script-src 'self' 'wasm-unsafe-eval'",
  );
  expect(response?.headers()['x-frame-options']).toBe('DENY');
  expect(response?.headers()['x-content-type-options']).toBe('nosniff');
  await page.getByRole('button', { name: 'Gửi một yêu cầu', exact: true }).click();
  await expect(page.locator('.workshop-caption strong')).toHaveText('Máy chủ');
  await page.goto('/#/games/cache');
  await page.getByRole('button', { name: 'Đọc nguồn', exact: true }).click();
  await expect(page.locator('.game-scene figcaption')).toContainText('Nguồn gốc trả đúng');
  await expect(page.locator('.game-scene')).toHaveAttribute('data-phase', '-1', { timeout: 7000 });
  await page.goto('/#/progress');
  const offline = page.getByRole('region', { name: 'Học khi mất mạng' });
  await offline.getByRole('button', { name: 'Tải gói học', exact: true }).click();
  await expect(offline.getByRole('status')).toContainText('Gói đã tải đủ', { timeout: 30000 });
  expect(violations).toEqual([]);
});
