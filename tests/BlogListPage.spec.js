const { test, expect } = require('@playwright/test')

const BLOG_PAGE_URL = 'http://localhost:1313/blog'

test('should display the title on the home page', async ({ page }) => {
	await page.goto(BLOG_PAGE_URL)

	await expect(page).toHaveTitle(/tech blog/i)
})

test('should display the correct heading', async ({ page }) => {
	await page.goto(BLOG_PAGE_URL)

	const locator = page.locator('body')

	await expect(locator).toHaveText(/tech blog/i)
})

test('should navigate to the individual blog page when select blog', async ({
	page
}) => {
	await page.goto(BLOG_PAGE_URL)

	await page.locator('text=30 days of Vim').click()

	await expect(page).toHaveTitle(/30 days of vim with vscode/i)
})
