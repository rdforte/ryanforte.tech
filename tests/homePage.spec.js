const { test, expect } = require('@playwright/test')

const HOME_PAGE_URL = 'http://localhost:1313'

test('should display the title on the home page', async ({ page }) => {
	await page.goto(HOME_PAGE_URL)

	await expect(page).toHaveTitle(/ryan forte/i)
})

test('should display the correct heading and subheading', async ({ page }) => {
	await page.goto(HOME_PAGE_URL)

	const locator = page.locator('body')

	await expect(locator).toHaveText(/ryan forte/i)
	await expect(locator).toHaveText(/software engineer/i)
})
