const hamburgerButton = document.querySelector('.hamburger')

// hamburgerButton.addEventListener('click', () => {
// 	document
// 		.querySelector('.hamburger__bar-one')
// 		.classList.toggle('hamburger__bar-one--is-active')
// 	document
// 		.querySelector('.hamburger__bar-two')
// 		.classList.toggle('hamburger__bar-two--is-active')
// 	document
// 		.querySelector('.hamburger__bar-three')
// 		.classList.toggle('hamburger__bar-three--is-active')
// })

hamburgerButton.addEventListener('click', () => {
	const barOneElement = document.querySelector('.hamburger__bar-one')
	const barTwoElement = document.querySelector('.hamburger__bar-two')
	const barThreeElement = document.querySelector('.hamburger__bar-three')

	if (barOneElement.classList.contains('hamburger__bar-one--is-not-active')) {
		barOneElement.classList.remove('hamburger__bar-one--is-not-active')
		barTwoElement.classList.remove('hamburger__bar-two--is-not-active')
		barThreeElement.classList.remove('hamburger__bar-three--is-not-active')

		barOneElement.classList.add('hamburger__bar-one--is-active')
		barTwoElement.classList.add('hamburger__bar-two--is-active')
		barThreeElement.classList.add('hamburger__bar-three--is-active')
	} else {
		barOneElement.classList.add('hamburger__bar-one--is-not-active')
		barTwoElement.classList.add('hamburger__bar-two--is-not-active')
		barThreeElement.classList.add('hamburger__bar-three--is-not-active')

		barOneElement.classList.remove('hamburger__bar-one--is-active')
		barTwoElement.classList.remove('hamburger__bar-two--is-active')
		barThreeElement.classList.remove('hamburger__bar-three--is-active')
	}
})
