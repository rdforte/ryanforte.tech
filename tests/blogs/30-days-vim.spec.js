const { test, expect } = require('@playwright/test')

const BLOG_BASE_URL = 'http://localhost:1313/blog/'

const blogCases = [
	{
		heading: /30 days of Vim with VSCode. Was it worth it… 🤔/i,
		title: /30 days vim/i,
		blog: '30-days-vim'
	}
]

for (const blogCase of blogCases) {
	test.describe(`Blog: ${blogCase.blog}`, () => {
		const blogURL = BLOG_BASE_URL + blogCase.blog
		test(`should display the title on the single blog page`, async ({
			page
		}) => {
			await page.goto(blogURL)

			await expect(page).toHaveTitle(blogCase.title)
		})

		test('should display the correct heading', async ({ page }) => {
			await page.goto(blogURL)

			const locator = page.locator('body')

			await expect(locator).toHaveText(blogCase.heading)
		})
	})
}
