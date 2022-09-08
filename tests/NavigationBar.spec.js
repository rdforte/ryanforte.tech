const { test, expect } = require('@playwright/test')

const HOME_PAGE_URL = 'http://localhost:1313'
const BLOG_PAGE_URL = 'http://localhost:1313/blog'

test('should navigate to blog when click the blog button in nav bar', async ({
	page
}) => {
	await page.goto(HOME_PAGE_URL)

	await page.locator('text=Blog').click()

	await expect(page).toHaveTitle(/tech blog/i)
})

test('should navigate to home when click the home button in nav bar', async ({
	page
}) => {
	await page.goto(BLOG_PAGE_URL)

	await page.locator('text=Home').click()

	await expect(page).toHaveTitle(/ryan forte/i)
})
