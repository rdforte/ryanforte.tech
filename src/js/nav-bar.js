const setNavBarActiveStyle = selector => {
	const element = document.querySelector(selector)
	element.style.color = 'white'
	element.style.textDecoration = 'underline'
	element.style.textDecorationThickness = '2px'
	element.style.textUnderlineOffset = '5px'
}

const path = window.location.pathname

if (path === '/') {
	setNavBarActiveStyle('#nav-bar__home-link')
}

if (path?.includes('blog')) {
	setNavBarActiveStyle('#nav-bar__blog-link')
}
