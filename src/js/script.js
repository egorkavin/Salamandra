'use strict'

//Sidebar
const sidebarOpenButtons = document.querySelectorAll('.sidebar__btn')
if (sidebarOpenButtons) {
	sidebarOpenButtons.forEach(button => {
		button.addEventListener('click', () => {
			const buttonClasses = button.classList
			const buttonLastClass = buttonClasses.item(buttonClasses.length - 1)
			const parentSelector = `.sidebar--${buttonLastClass.split('--').pop()}`
			const parentSidebar = document.querySelector(parentSelector)
			parentSidebar.classList.toggle(`${parentSelector.substr(1)}--hidden`)
		})
	})

	const filters = document.querySelectorAll('.filter')
	filters.forEach(filter => {
		const filterName = filter.querySelector('.filter__name span')
		if (filterName) {
			const itemsList = filter.querySelector('.filter__items-list')
			const itemsCount = document.createElement('span')
			itemsCount.innerHTML = ` (${itemsList.childElementCount})`
			filterName.insertAdjacentElement('beforeend', itemsCount)
			filterName.insertAdjacentHTML(
				'beforeend',
				'<span class="filter__icon filter__icon--arrow"></span>'
			)
			toggleItemsListByFilterName(itemsList, filterName.parentNode)
			setItemsCountInList(itemsCount, itemsList)
		}
	})

	const filtersItemsQuantity = document.querySelectorAll('.filter__item-quantity')
	filtersItemsQuantity.forEach(filterItemQuantity => {
		if (filterItemQuantity.textContent === '(+0)') {
			const parent = filterItemQuantity.closest('.filter__item')
			parent.classList.add('filter__item--disabled')
			parent.addEventListener('click', e => e.preventDefault())
		}
	})

	function toggleItemsListByFilterName(itemsList, filterName) {
		filterName.addEventListener('click', e => {
			e.preventDefault()
			if (!e.target.classList.contains('icon-cancel-filter')) {
				filterName.classList.toggle('filter__name--active')
				const itemsListHeight = itemsList.clientHeight
				const itemsWrapper = itemsList.parentNode
				if (itemsWrapper.style.maxHeight) {
					itemsWrapper.removeAttribute('style')
				} else {
					itemsWrapper.style.maxHeight = `${itemsListHeight}px`
				}
			}
		})
	}

	const getCheckedItems = itemsList =>
		itemsList.querySelectorAll('input[type="checkbox"]:checked')

	function setItemsCountInList(itemsCount, itemsList) {
		itemsList.addEventListener('change', () => {
			const parent = itemsCount.parentNode
			const count = getCheckedItems(itemsList).length
			if (count === 0) {
				setItemsCountToZero(itemsCount)
			} else {
				itemsCount.innerHTML = `(${count}/${itemsList.childElementCount})`
				if (parent.parentNode.childElementCount === 1) {
					parent.insertAdjacentHTML(
						'beforebegin',
						'<span class="svg-icon icon-square-box"><span>'
					)
					parent.insertAdjacentHTML(
						'afterend',
						'<span class="svg-icon icon-cancel-filter"><span>'
					)
					addCancelListener(itemsCount)

					function addCancelListener(itemsCount) {
						const cancel = parent.parentNode.querySelector(
							'.svg-icon.icon-cancel-filter'
						)
						cancel.addEventListener('click', () => {
							const checkedItems = getCheckedItems(itemsList)
							checkedItems.forEach(item => {
								item.checked = false
							})
							setItemsCountToZero(itemsCount)
						})
					}
				}
			}

			function setItemsCountToZero(itemsCount) {
				itemsCount.innerHTML = `(${itemsList.childElementCount})`
				const icons = parent.parentNode.querySelectorAll('.svg-icon')
				icons.forEach(icon => parent.parentNode.removeChild(icon))
			}
		})
	}
}

//Pagination
const paginationSection = document.querySelector('.pages-navigation')
//const pageNumberButtons = paginationSection.querySelector('.pages-navigation__page-numbers');
if (paginationSection) {
	const itemsFromAllPages = document.querySelectorAll('.product')
	const itemsPerPage = 4
	let currentPage = 1
	displayPage(1, itemsPerPage, itemsFromAllPages)
	createPagination(paginationSection, itemsPerPage, itemsFromAllPages)

	function displayPage(pageNumber, itemsPerPage, allItems) {
		const from = (pageNumber - 1) * itemsPerPage
		const arrOfNodes = Array.prototype.slice.call(allItems)
		const pageItems = arrOfNodes.splice(from, itemsPerPage)
		pageItems.forEach(item => item.removeAttribute('style'))
		arrOfNodes.forEach(item => {
			item.style.display = 'none'
		})
	}

	function createPagination(paginationSection, itemsPerPage, allItems) {
		const numberOfPages = Math.ceil(itemsFromAllPages.length / itemsPerPage)
		const pageNumbersList = paginationSection.querySelector('.pages-navigation__list-of-pages')
		for (let i = 0; i < numberOfPages; i++) {
			const btn = createPageButton(i + 1, itemsPerPage, allItems)
			pageNumbersList.appendChild(btn)
		}
	}

	function createPageButton(pageNumber, itemsPerPage, allItems) {
		const li = document.createElement('li')
		const button = document.createElement('button')
		li.classList.add('pages-navigation__page-wrapper')
		button.classList.add('pages-navigation__page-button')
		button.textContent = pageNumber

		if (pageNumber === currentPage) {
			li.classList.add('pages-navigation__page-wrapper--active')
		}
		button.addEventListener('click', () => {
			currentPage = pageNumber
			displayPage(pageNumber, itemsPerPage, allItems)
			const prevPage = document.querySelector(
				'.pages-navigation__page-wrapper.pages-navigation__page-wrapper--active'
			)
			prevPage.classList.remove('pages-navigation__page-wrapper--active')
			li.classList.add('pages-navigation__page-wrapper--active')
		})
		li.appendChild(button)
		return li
	}
}

//Tabs
const tabs = document.querySelectorAll('.product-tabs__item')
if (tabs) {
	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const prevActiveTab = document.querySelector('.product-tabs__item--active')
			const prevActiveTabBody = document.querySelector(`#${prevActiveTab.dataset.tab}`)
			const newActiveTabBody = document.querySelector(`#${tab.dataset.tab}`)
			prevActiveTab.classList.remove('product-tabs__item--active')
			prevActiveTabBody.classList.remove('product-tabs__block--active')
			tab.classList.add('product-tabs__item--active')
			newActiveTabBody.classList.add('product-tabs__block--active')
		})
	})
}

//Stars rating
const stars = document.querySelectorAll('.product-rating__star')
if (stars) {
	stars.forEach(item =>
		item.addEventListener('click', () => {
			const { value } = item.dataset
			item.parentNode.dataset.totalValue = value
			const note = document.querySelector('.product-rating__note')
			if (note) note.remove()
		})
	)
}

const yearRates = document.querySelectorAll('.year-rate')
if (yearRates) {
	const value = document.querySelectorAll('.year-rate__value')
	value.forEach(yearRate => {
		const percentValue = parseInt(yearRate.textContent)
		const circumference = 2 * Math.PI * 13
		const offset = circumference - (percentValue / 100) * circumference
		const circle = `
		<svg class="percent-circle" width="30" height="30">
			<circle class="percent-circle__circle" stroke="#fff"
				fill="transparent" stroke-width="2" cx="15" cy="15"
				r="13" stroke-dasharray="${circumference} ${circumference}" 
				stroke-dashoffset="${offset}"/>
		</svg>
		`
		yearRate.innerHTML = percentValue === 100 ? '★' : `${percentValue}`
		yearRate.innerHTML += circle
	})
}

//Slider
const slider = document.querySelector('.product-slider')
if (slider) {
	const sliderTrack = slider.querySelector('.product-slider__track')
	const sliderBtnNext = slider.querySelector('.product-slider__button_next')
	const sliderBtnPrev = slider.querySelector('.product-slider__button_prev')
	const sliderItems = slider.querySelectorAll('.product-slider__item-wrapper')
	const itemsCount = sliderItems.length
	const itemsWidthArr = [].map.call(sliderItems, item =>
		Math.round(item.getBoundingClientRect().width)
	)

	const startPosition = calcVisibleItems(itemsWidthArr)
	let position = startPosition
	let offset = 0

	sliderBtnNext.addEventListener('click', moveTrackForward)

	function moveTrackForward() {
		sliderBtnPrev.style.opacity = '100%'
		sliderBtnPrev.addEventListener('click', moveTrackBack)

		const itemsLeft = itemsCount - position
		if (itemsLeft > 3) {
			offset += calcOffset(itemsWidthArr, position, (position += 3))
		} else {
			offset += calcOffset(itemsWidthArr, position, (position = itemsCount))
			sliderBtnNext.style.opacity = '0'
			sliderBtnNext.removeEventListener('click', moveTrackForward)
		}
		sliderTrack.style.transform = `translateX(-${offset}px)`
	}

	function moveTrackBack() {
		sliderBtnNext.style.opacity = '100%'
		sliderBtnNext.addEventListener('click', moveTrackForward)

		const itemsLeft = calcPrevItems(itemsWidthArr, offset)
		if (itemsLeft > 3) {
			offset -= calcOffset(itemsWidthArr, (position -= 3), position + 3)
		} else {
			offset -= calcOffset(itemsWidthArr, 0, itemsLeft)
			position = startPosition
			sliderBtnPrev.style.opacity = '0'
			sliderBtnPrev.removeEventListener('click', moveTrackBack)
		}
		sliderTrack.style.transform = `translateX(-${offset}px)`
	}

	sliderTrack.addEventListener('click', e => {
		if (e.target.tagName === 'IMG') {
			const mainPhoto = document.querySelector('.product__image-wrapper')
			mainPhoto.innerHTML = `
			<img src="${e.target.getAttribute('src')}" class="product__image"></img>
			`
		}
	})

	function calcVisibleItems(itemsWidthArr) {
		let totalWidth = 0
		for (let i = 0; i < itemsWidthArr.length; i++) {
			if (totalWidth >= 485) {
				return i - 1
			}
			totalWidth += itemsWidthArr[i]
		}
		return itemsWidthArr.length
	}

	function calcOffset(itemsWidthArray, start, end) {
		const nextItemsWidth = [].slice.call(itemsWidthArray, start, end)
		return nextItemsWidth.reduce((a, b) => a + b)
	}

	function calcPrevItems(itemsWidthArr, offset) {
		let buf = 0
		for (let i = 0; i < itemsWidthArr.length; i++) {
			buf += itemsWidthArr[i]
			if (offset - buf <= 0) {
				return i + 1
			}
		}
	}
}

//Comment votes
const commentVotes = document.querySelectorAll('.comment-vote')
if (commentVotes) {
	commentVotes.forEach(vote => {
		const upvoteBtn = vote.querySelector('.comment-vote__btn--up')
		const downvoteBtn = vote.querySelector('.comment-vote__btn--down')
		const rating = vote.querySelector('.comment-vote__rating')
		upvoteBtn.addEventListener('click', () => {
			rating.textContent++
			checkRating(rating)
		})
		downvoteBtn.addEventListener('click', () => {
			rating.textContent--
			checkRating(rating)
		})

		checkRating(rating)
	})

	function checkRating(rating) {
		const comment = rating.closest('.product-comment')
		if (rating.textContent >= 10) {
			comment.classList.add('product-comment--good')
		} else if (rating.textContent <= -5) {
			comment.classList.add('product-comment--bad')
		} else {
			comment.classList.remove('product-comment--good')
			comment.classList.remove('product-comment--bad')
		}
	}
}

//Price at shops
const pricesAtShops = document.querySelectorAll('.product-price__price')
if (pricesAtShops) {
	pricesAtShops.forEach(price => {
		if (!price.textContent.trim().localeCompare('нет в наличии')) {
			price.style.border = 'none'
		}
	})
}

const pcParts = document.querySelector('.pc-parts')
if (pcParts) {
	const prices = pcParts.querySelectorAll('.pc-part__price')
	const totalPrice = pcParts.querySelector('.pc-parts__total')
	const reducer = (acc, price) => {
		const priceContent = price.textContent
		const priceValue = priceContent.replace(/\s/g, '').replace(/,/g, '.')
		return acc + +priceValue
	}
	const sum = [].reduce.call(prices, reducer, 0)
	totalPrice.textContent = `${Math.round(sum).toLocaleString('ru-RU')} ₽`
}

const assemblageParts = document.querySelectorAll('.assemblage-parts__part')
if (assemblageParts) {
	assemblageParts.forEach(part => {
		const title = part.querySelector('.product__title')
		title.addEventListener('click', () => part.classList.toggle('product--collapsed'))
	})
}

//TODO Move to one block (conflicts)
const disableFixedCircles = circle =>
	circle.classList.remove(
		'pc-part__conflict-circle--fixed',
		'pc-part__conflict-circle--fixed--prev'
	)
const fixCircles = circle => circle.classList.add('pc-part__conflict-circle--fixed')
const disableCirclesAsPrevious = circle =>
	circle.classList.add('pc-part__conflict-circle--fixed--prev')
const enablePrevCircles = circle => circle.classList.remove('pc-part__conflict-circle--fixed--prev')
const unhoverCircles = circle => circle.classList.remove('pc-part__conflict-circle--hover')
const hoverCircles = circle => circle.classList.add('pc-part__conflict-circle--hover')
const toggleCircles = circle => circle.classList.toggle('pc-part__conflict-circle--fixed')

function mapCirclesById(conflictID, callback) {
	const circles = document.querySelectorAll(
		`.pc-part[data-conflictid="${conflictID}"] .pc-part__conflict-circle`
	)
	circles.forEach(callback)
}

const isWarning = item => item.classList.contains('conflicts__item--question')

function switchConflictsBlockItem(conflictsBlock, item) {
	const chosen = conflictsBlock.querySelector('.conflicts__item--chosen') || item
	if (!isWarning(item)) {
		if (chosen === item) {
			chosen.classList.remove('conflicts__item--hover')
			chosen.classList.toggle('conflicts__item--chosen')
		} else {
			chosen.classList.remove('conflicts__item--chosen')
			item.classList.add('conflicts__item--chosen')
		}
	}
}

function hoverConflictsBlockItem(conflictsBlock, item) {
	const toHover = item
	const chosen = conflictsBlock.querySelector('.conflicts__item--chosen')
	if (chosen !== toHover) {
		if (chosen) {
			chosen.classList.add('conflicts__item--prev')
		}
		toHover.classList.add('conflicts__item--hover')
	}
}

function unhoverConflictsBlockItem(conflictsBlock, item) {
	const toUnhover = item
	const previous = conflictsBlock.querySelector('.conflicts__item--prev')
	if (previous !== toUnhover) {
		if (previous) {
			previous.classList.remove('conflicts__item--prev')
		}
		toUnhover.classList.remove('conflicts__item--hover')
	}
}

const conflicts = document.querySelectorAll('.conflicts')
if (conflicts) {
	conflicts.forEach(conflictsBlock => {
		const items = conflictsBlock.querySelectorAll('.conflicts__item')

		items.forEach(item => {
			item.addEventListener('click', () => {
				switchConflictsBlockItem(conflictsBlock, item)
				const conflictID = item.dataset.conflictid
				mapCirclesById(conflictID, unhoverCircles)
				switchConflict(conflictID)
			})
			item.addEventListener('mouseover', () => {
				item.classList.add('conflicts__item--hover')
				const conflictID = item.dataset.conflictid
				mapCirclesById(conflictID, hoverCircles)
				hoverConflict(conflictID)
				hoverConflictsBlockItem(conflictsBlock, item)
			})
			item.addEventListener('mouseout', () => {
				item.classList.remove('conflicts__item--hover')
				const conflictID = item.dataset.conflictid
				mapCirclesById(conflictID, unhoverCircles)
				unhoverConflict(conflictID)
				unhoverConflictsBlockItem(conflictsBlock, item)
			})
		})
	})
}

//TODO
const viewTypes = document.querySelectorAll('.view-types__type')
if (viewTypes) {
	viewTypes.forEach(type => {
		type.addEventListener('click', () => {
			const active = document.querySelector('.view-types__type--active')
			if (type !== active) {
				active.classList.remove('view-types__type--active')
				type.classList.add('view-types__type--active')
			}
		})
	})
}

const pcPartConflicts = document.querySelectorAll('.pc-part[data-conflictID]')
if (pcPartConflicts) {
	let conflicts = document.querySelectorAll('.pc-part[data-conflictID="1"]')
	const getTitle = conflict => conflict.querySelector('.pc-part__title')
	for (let i = 1; conflicts.length > 0; ) {
		if (conflicts.length !== 1) {
			setConflictsLines(i, ...[].map.call(conflicts, getTitle))
		}
		conflicts = document.querySelectorAll(`.pc-part[data-conflictID="${++i}"]`)
	}

	pcPartConflicts.forEach(item => {
		const title = item.querySelector('.pc-part__title')
		const circle = document.createElement('span')
		circle.classList.add('pc-part__conflict-circle')
		circle.addEventListener('click', () => {
			circle.classList.remove('pc-part__conflict-circle--hover')
			const conflictID = circle.closest('[data-conflictid]').dataset.conflictid
			switchConflict(conflictID)

			const conflictsBlocks = document.querySelectorAll('.conflicts')
			conflictsBlocks.forEach(conflictsBlock => {
				const item = conflictsBlock.querySelector(
					`.conflicts__item[data-conflictid="${conflictID}"]`
				)
				switchConflictsBlockItem(conflictsBlock, item)
			})
		})
		circle.addEventListener('mouseover', () => {
			circle.classList.add('pc-part__conflict-circle--hover')
			const conflictID = circle.closest('[data-conflictid]').dataset.conflictid
			hoverConflict(conflictID)

			const conflictsBlocks = document.querySelectorAll('.conflicts')
			conflictsBlocks.forEach(conflictsBlock => {
				const item = conflictsBlock.querySelector(
					`.conflicts__item[data-conflictid="${conflictID}"]`
				)
				hoverConflictsBlockItem(conflictsBlock, item)
			})
		})
		circle.addEventListener('mouseout', () => {
			circle.classList.remove('pc-part__conflict-circle--hover')
			const conflictID = circle.closest('[data-conflictid]').dataset.conflictid
			unhoverConflict(conflictID)

			const conflictsBlocks = document.querySelectorAll('.conflicts')
			conflictsBlocks.forEach(conflictsBlock => {
				const item = conflictsBlock.querySelector(
					`.conflicts__item[data-conflictid="${conflictID}"]`
				)
				unhoverConflictsBlockItem(conflictsBlock, item)
			})
		})
		title.insertAdjacentElement('afterbegin', circle)
	})
}

function getCurrentConflictID() {
	const fixedCircle = document.querySelector('.pc-part__conflict-circle--fixed')
	return fixedCircle ? fixedCircle.closest('[data-conflictid]').dataset.conflictid : null
}

function switchConflict(conflictID) {
	const conflictIDToSwitch = conflictID
	const fixedConflictID = getCurrentConflictID()
	const conflictSVGToSwitch = document.querySelector(`svg[data-conflictid="${conflictID}"]`)
	const fixedSVG = document.querySelector('svg[data-conflictid].fixed') // || conflictSVGToSwitch
	if (conflictIDToSwitch !== fixedConflictID) {
		if (fixedSVG) {
			fixedSVG.classList.remove('fixed', 'fixed--prev', 'hover')
		}
		if (conflictSVGToSwitch) {
			conflictSVGToSwitch.classList.add('fixed')
		}
		mapCirclesById(fixedConflictID, unhoverCircles)
		mapCirclesById(fixedConflictID, disableFixedCircles)
		mapCirclesById(conflictID, fixCircles)
	} else {
		if (conflictSVGToSwitch) {
			conflictSVGToSwitch.classList.remove('hover')
			conflictSVGToSwitch.classList.toggle('fixed')
		}
		mapCirclesById(conflictID, toggleCircles)
	}
}

function hoverConflict(conflictID) {
	const conflictIDToHover = conflictID
	const fixedConflictID = getCurrentConflictID()
	const conflictSVGToHover = document.querySelector(`svg[data-conflictid="${conflictID}"]`)
	if (conflictSVGToHover) {
		conflictSVGToHover.classList.add('hover')
	}

	const fixedSVG = document.querySelector('svg[data-conflictid].fixed')
	if (fixedConflictID && fixedConflictID !== conflictIDToHover) {
		if (fixedSVG) {
			fixedSVG.classList.add('fixed--prev')
		}
		mapCirclesById(fixedConflictID, disableCirclesAsPrevious)
	}
}

function unhoverConflict(conflictID) {
	const conflictIDToHover = conflictID
	const fixedPrevConflictID = getCurrentConflictID()
	const conflictSVGToUnhover = document.querySelector(`svg[data-conflictid="${conflictID}"]`)
	if (conflictSVGToUnhover) {
		conflictSVGToUnhover.classList.remove('hover')
	}

	const fixedPrevSVG = document.querySelector('svg[data-conflictid].fixed--prev')
	if (fixedPrevConflictID !== conflictIDToHover) {
		if (fixedPrevSVG) {
			fixedPrevSVG.classList.remove('fixed--prev')
		}
		mapCirclesById(fixedPrevConflictID, enablePrevCircles)
	}
}

function setConflictsLines(id, ...conflicts) {
	const top1 = conflicts[0].offsetTop
	const topN = conflicts[conflicts.length - 1].offsetTop
	const len = topN - top1
	const lineHeight = 8
	const topAbs = top1 + lineHeight
	const createConflictDash = conflict => `
		<polyline 
			points="
				1,${conflict.offsetTop - top1 + 5}.5
				6,${conflict.offsetTop - top1 + 5}.5
			"
			stroke="#e0a006"
		/>
		<polyline 
			points="
				7.5,${conflict.offsetTop - top1}
				7.5,${conflict.offsetTop - top1 + 11}
			"
			stroke="#e0a006"
		/>
	`
	const linesToPart = conflicts.map(createConflictDash).join('')
	const line = `
		<svg data-conflictid="${id}"
			style="position: absolute;top:${topAbs - 6}px;left:50px;" 
			width="8" height="${len + 12}" viewBox="0 0 8 ${len + 12}"
			xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
		>
			<polyline 
				points="
					1.5,6
					1.5,${len + 6}
				"
				fill="transparent" stroke="#e0a006" stroke-dasharray="4px"
			/>
			${linesToPart}
		</svg>
	`
	document.querySelector('.sidebar__pc-parts').insertAdjacentHTML('beforeend', line)
}

const dataIcons = document.querySelectorAll('[data-icon]')
dataIcons.forEach(item => {
	const iconName = item.dataset.icon
	if (item.classList.contains('pc-parts__choose-item')) {
		item.insertAdjacentHTML('afterbegin', `<span class="svg-icon icon-${iconName}"></span>`)
	} else {
		const title = item.querySelector('.pc-part__title')
		title.insertAdjacentHTML('afterbegin', `<span class="svg-icon icon-${iconName}"></span>`)
	}
})

const pcPartsDescriptions = document.querySelectorAll('.pc-part__description')
if (pcPartsDescriptions) {
	pcPartsDescriptions.forEach(description => {
		const title = description.querySelector('.pc-part__title')
		const titleP = title.querySelector('p')
		const details = description.querySelector('.pc-part__details')
		if (titleP.offsetWidth === 215) {
			title.classList.add('pc-part__title--gradient')
		}
		if (details.offsetWidth === 215) {
			details.classList.add('pc-part__details--gradient')
		}
	})
}
