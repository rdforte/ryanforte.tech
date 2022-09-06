const baseConfig = {
	content: ['content/**/*.md', 'layouts/**/*.html'],
	plugins: [require('@tailwindcss/typography')], // add default styles to markdown
	theme: {
		extend: {
			fontSize: {
				eighty: '80px',
				ninety: '90px'
			}
		}
	}
}

const getTailwindConfig = () => {
	if (process.env.NODE_ENV === 'production') return baseConfig

	return {
		...baseConfig,
		safelist: [
			{
				pattern: /.*/ // add all tailwind classes for development
			}
		]
	}
}

/** @type {import('tailwindcss').Config} */
module.exports = getTailwindConfig()
