// @ts-check
const { test, expect } = require('@playwright/test')

test('should display the title on the home page', async ({ page }) => {
	await page.goto('http://localhost:1313')

	await expect(page).toHaveTitle(/ryan forte/i)
})
