const { test, expect } = require('@playwright/test')

const HOME_PAGE_URL = 'http://localhost:1313'
const BLOG_PAGE_URL = 'http://localhost:1313/blog'

const SMALL_VIEW_PORT = { width: 600, height: 600 }

test.describe('Nav Bar', () => {
	test('should navigate to blog when click the blog button in nav bar', async ({
		page
	}) => {
		await page.goto(HOME_PAGE_URL)

		const blogLink = page.locator('#nav-bar__blog-link')

		await expect(blogLink).toHaveText(/blog/i)

		await blogLink.click()

		await expect(page).toHaveTitle(/tech blog/i)
	})

	test('should navigate to home when click the home button in nav bar', async ({
		page
	}) => {
		await page.goto(BLOG_PAGE_URL)

		const homeLink = page.locator('#nav-bar__home-link')

		await expect(homeLink).toHaveText(/home/i)

		await homeLink.click()

		await expect(page).toHaveTitle(/ryan forte/i)
	})

	// test('should navigate to competitive programming when click the home button in nav bar', async ({
	// 	page
	// }) => {
	// 	await page.goto(BLOG_PAGE_URL)
	//
	// 	const homeLink = page.locator('#nav-bar__cp-link')
	//
	// 	await expect(homeLink).toHaveText(/competitive/i)
	//
	// 	await homeLink.click()
	//
	// 	await expect(page).toHaveTitle(/show-all/i)
	// })
})

// test.describe('Hamburger Menu', () => {
// 	test('mobile navigation window should open and close when click hamburger menu', async ({
// 		page
// 	}) => {
// 		page.setViewportSize(SMALL_VIEW_PORT)

// 		await page.goto(HOME_PAGE_URL)

// 		const hamburger = page.locator('#hamburger')
// 		const mobileNavigation = page.locator('#mobile-navigation-window')

// 		await expect(mobileNavigation).not.toBeVisible()

// 		await hamburger.click()
// 		await expect(mobileNavigation).toBeVisible()

// 		await hamburger.click()
// 		await expect(mobileNavigation).not.toBeVisible()
// 	})
// })
