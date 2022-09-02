const setNavBarActiveStyle = selector => {
	const highlightedNavStyles =
		'color: white; text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 5px;'

	const element = document.querySelector(selector)
	element.style = highlightedNavStyles
}

const path = window.location.pathname

if (path === '/') {
	setNavBarActiveStyle('#nav-bar__home-link')
}

if (path === '/blog/') {
	setNavBarActiveStyle('#nav-bar__blog-link')
}
