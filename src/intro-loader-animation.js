const loaderBoarderElement = document.querySelector('#logo-animated__border')

loaderBoarderElement.addEventListener('animationend', () => {
	document.querySelector('#intro-loader').style.display = 'none'
	document.querySelector('#main-content').style.display = 'block'
})
