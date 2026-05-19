import { test, expect } from '@playwright/test';

const URL = 'http://localhost:5173';

test.describe('Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.waitForSelector('.calculator');
  });

  test('renders calculator UI', async ({ page }) => {
    await expect(page.locator('.display')).toBeVisible();
    await expect(page.locator('.display')).toHaveText('0');
    await expect(page.locator('.btn')).toHaveCount(19);
  });

  test('basic addition', async ({ page }) => {
    await page.locator('.btn', { hasText: '2' }).click();
    await page.locator('.btn', { hasText: '+' }).click();
    await page.locator('.btn', { hasText: '3' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('5');
  });

  test('subtraction', async ({ page }) => {
    await page.locator('.btn', { hasText: '9' }).click();
    await page.locator('.btn', { hasText: '−' }).click();
    await page.locator('.btn', { hasText: '4' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('5');
  });

  test('multiplication', async ({ page }) => {
    await page.locator('.btn', { hasText: '6' }).click();
    await page.locator('.btn', { hasText: '×' }).click();
    await page.locator('.btn', { hasText: '7' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('42');
  });

  test('division', async ({ page }) => {
    await page.locator('.btn', { hasText: '8' }).click();
    await page.locator('.btn', { hasText: '÷' }).click();
    await page.locator('.btn', { hasText: '2' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('4');
  });

  test('clear resets to 0', async ({ page }) => {
    await page.locator('.btn', { hasText: '5' }).click();
    await page.locator('.btn', { hasText: '3' }).click();
    await page.locator('.btn-clear').click();
    await expect(page.locator('.display')).toHaveText('0');
  });

  test('decimal support', async ({ page }) => {
    await page.locator('.btn', { hasText: '1' }).click();
    await page.locator('.btn', { hasText: '.' }).click();
    await page.locator('.btn', { hasText: '5' }).click();
    await page.locator('.btn', { hasText: '+' }).click();
    await page.locator('.btn', { hasText: '2' }).click();
    await page.locator('.btn', { hasText: '.' }).click();
    await page.locator('.btn', { hasText: '5' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('4');
  });

  test('backspace deletes last character', async ({ page }) => {
    await page.locator('.btn', { hasText: '1' }).click();
    await page.locator('.btn', { hasText: '2' }).click();
    await page.locator('.btn', { hasText: '3' }).click();
    await page.locator('.btn', { hasText: '⌫' }).click();
    await expect(page.locator('.display')).toHaveText('12');
  });

  test('keyboard input works', async ({ page }) => {
    await page.locator('.display').focus();
    await page.keyboard.type('7+8');
    await page.keyboard.press('Enter');
    await expect(page.locator('.display')).toHaveText('15');
  });

  test('keyboard Escape clears', async ({ page }) => {
    await page.locator('.btn', { hasText: '9' }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('.display')).toHaveText('0');
  });

  test('division by zero shows Error', async ({ page }) => {
    await page.locator('.btn', { hasText: '5' }).click();
    await page.locator('.btn', { hasText: '÷' }).click();
    await page.locator('.btn', { hasText: '0' }).click();
    await page.locator('.btn-equals').click();
    await expect(page.locator('.display')).toHaveText('Error');
  });

  test('no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('pageerror', err => errors.push(err.message));
    await page.goto(URL);
    await page.waitForSelector('.calculator');
    expect(errors).toEqual([]);
  });
});
