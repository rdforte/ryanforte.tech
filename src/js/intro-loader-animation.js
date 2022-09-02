const loaderBoarderElement = document.querySelector('#logo-animated__border')

if (loaderBoarderElement != null) {
	loaderBoarderElement.addEventListener('animationend', () => {
		document.querySelector('#intro-loader').style.display = 'none'
		document.querySelector('#main-content').style.display = 'block'
	})
}
