const { test, expect } = require('@playwright/test')

const BLOG_SINGLE_PAGE_URL = 'http://localhost:1313/blog/30-days-vim/'

test('should display the title on the single blog page', async ({ page }) => {
	await page.goto(BLOG_SINGLE_PAGE_URL)

	await expect(page).toHaveTitle(/30 days of vim/i)
})

test('should display the correct heading', async ({ page }) => {
	await page.goto(BLOG_SINGLE_PAGE_URL)

	const locator = page.locator('body')

	await expect(locator).toHaveText(
		/30 days of Vim with VSCode. Was it worth it/i
	)
})
