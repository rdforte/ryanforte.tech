const hamburgerButton = document.querySelector('.hamburger')
const slideOutNavigation = document.querySelector('.mobile-navigation')

const barOneElement = document.querySelector('.hamburger__bar-one')
const barTwoElement = document.querySelector('.hamburger__bar-two')
const barThreeElement = document.querySelector('.hamburger__bar-three')

// Remove Slide Down animation after initial load of home screen.
if (barOneElement != null && barTwoElement != null && barThreeElement != null) {
	barOneElement.addEventListener('animationend', () => {
		barOneElement.classList.remove('slide-down-animation')
		barTwoElement.classList.remove('slide-down-animation')
		barThreeElement.classList.remove('slide-down-animation')
	})
}

hamburgerButton.addEventListener('click', () => {
	if (barOneElement.classList.contains('hamburger__bar-one--is-not-active')) {
		barOneElement.classList.remove('hamburger__bar-one--is-not-active')
		barTwoElement.classList.remove('hamburger__bar-two--is-not-active')
		barThreeElement.classList.remove('hamburger__bar-three--is-not-active')

		barOneElement.classList.add('hamburger__bar-one--is-active')
		barTwoElement.classList.add('hamburger__bar-two--is-active')
		barThreeElement.classList.add('hamburger__bar-three--is-active')

		slideOutNavigation.classList.remove('mobile-navigation--is-not-active')
		slideOutNavigation.classList.add('mobile-navigation--is-active')
	} else {
		barOneElement.classList.add('hamburger__bar-one--is-not-active')
		barTwoElement.classList.add('hamburger__bar-two--is-not-active')
		barThreeElement.classList.add('hamburger__bar-three--is-not-active')

		barOneElement.classList.remove('hamburger__bar-one--is-active')
		barTwoElement.classList.remove('hamburger__bar-two--is-active')
		barThreeElement.classList.remove('hamburger__bar-three--is-active')

		slideOutNavigation.classList.remove('mobile-navigation--is-active')
		slideOutNavigation.classList.add('mobile-navigation--is-not-active')
	}
})
