'use strict'

//Sidebar
const sidebarOpenButtons = document.querySelectorAll('.sidebar__btn')
if (sidebarOpenButtons) {
	sidebarOpenButtons.forEach(button => {
		button.addEventListener('click', () => {
			const parentSidebar = button.closest('.sidebar')
			parentSidebar.classList.toggle('sidebar--hidden')
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
			<circle
				stroke="#fff" fill="transparent"
				stroke-width="2" cx="15" cy="15" r="13"
				stroke-dasharray="${circumference} ${circumference}" 
				stroke-dashoffset="${offset}"/>
		</svg>
		`
		yearRate.innerHTML = percentValue === 100 ? '★' : `${percentValue}`
		yearRate.innerHTML += circle
	})
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
const disableFixedCircles = circle => circle.classList.remove('conflict-circle--fixed')
const fixCircles = circle => circle.classList.add('conflict-circle--fixed')
const disableCirclesAsPrevious = circle => {
	if (!circle.classList.contains('conflict-circle--hover')) {
		circle.classList.add('conflict-circle--fixed--prev')
	}
}
const disablePrevCircles = circle => circle.classList.remove('conflict-circle--fixed--prev')
const unhoverCircles = circle => circle.classList.remove('conflict-circle--hover')
const hoverCircles = circle => circle.classList.add('conflict-circle--hover')
const toggleCircles = circle => circle.classList.toggle('conflict-circle--fixed')

function mapCirclesById(conflictId, callback) {
	const circles = document.querySelectorAll(
		`.pc-part[data-conflict-id~="${conflictId}"] .conflict-circle`
	)
	circles.forEach(callback)
}

function switchConflictsBlockItem(conflictsBlock, item) {
	const chosen = conflictsBlock.querySelector('.conflicts__item--chosen') || item
	const isWarning = item => item.classList.contains('conflicts__item--question')
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

function getConflictsBlockItemById(conflictId) {
	const conflictsBlock = document.querySelector('.conflicts')
	return conflictsBlock.querySelector(`.conflicts__item[data-conflict-id="${conflictId}"]`)
}

const conflictsBlock = document.querySelector('.conflicts')
if (conflictsBlock) {
	const items = conflictsBlock.querySelectorAll(
		'.conflicts__item:not(.conflicts__item--question)'
	)
	items.forEach(item => {
		item.addEventListener('click', () => {
			switchConflictsBlockItem(conflictsBlock, item)
			const { conflictId } = item.dataset
			mapCirclesById(conflictId, unhoverCircles)
			switchConflict(conflictId)
		})
		item.addEventListener('mouseover', () => {
			item.classList.add('conflicts__item--hover')
			const { conflictId } = item.dataset
			mapCirclesById(conflictId, hoverCircles)
			hoverConflict(conflictId)
			hoverConflictsBlockItem(conflictsBlock, item)
		})
		item.addEventListener('mouseout', () => {
			item.classList.remove('conflicts__item--hover')
			const { conflictId } = item.dataset
			mapCirclesById(conflictId, unhoverCircles)
			unhoverConflict(conflictId)
			unhoverConflictsBlockItem(conflictsBlock, item)
		})
	})
}

const viewTypes = document.querySelectorAll('.view-types__type')
if (viewTypes) {
	viewTypes.forEach(type => {
		type.addEventListener('click', () => {
			const active = document.querySelector('.view-types__type--active')
			if (type !== active) {
				if (active) {
					active.classList.remove('view-types__type--active')
				}
				type.classList.add('view-types__type--active')

				if (type.classList.contains('lines')) {
					const products = document.querySelectorAll('.product')
					products.forEach(product => product.classList.add('product--long'))
				}
			}
		})
	})
}

const pcPartConflicts = document.querySelectorAll('.pc-part[data-conflict-id]')
if (pcPartConflicts) {
	let conflicts = document.querySelectorAll('.pc-part[data-conflict-id~="1"]')
	const getTitle = conflict => conflict.querySelector('.pc-part__title')
	for (let i = 1; conflicts.length > 0; ) {
		if (conflicts.length !== 1) {
			setConflictsLines(i, ...[].map.call(conflicts, getTitle))
		}
		conflicts = document.querySelectorAll(`.pc-part[data-conflict-id~="${++i}"]`)
	}

	pcPartConflicts.forEach(item => {
		const title = item.querySelector('.pc-part__title')
		const circle = document.createElement('span')
		circle.classList.add('pc-part__conflict-circle', 'conflict-circle')
		circle.addEventListener('mouseover', () => {
			circle.closest('.pc-part').querySelector('.pc-part__price').style.color = '#bfbfbf'
			circle.classList.add('conflict-circle--hover')
			const conflictId = circle.closest('[data-conflict-id]').dataset.conflictId.split(' ')
			conflictId.forEach(id =>
				hoverConflictsBlockItem(conflictsBlock, getConflictsBlockItemById(id))
			)
		})
		circle.addEventListener('mouseout', () => {
			circle.closest('.pc-part').querySelector('.pc-part__price').removeAttribute('style')
			circle.classList.remove('conflict-circle--hover')
			const conflictId = circle.closest('[data-conflict-id]').dataset.conflictId.split(' ')
			conflictId.forEach(id =>
				unhoverConflictsBlockItem(conflictsBlock, getConflictsBlockItemById(id))
			)
		})
		title.insertAdjacentElement('afterbegin', circle)
	})
}

function getCurrentConflictId() {
	const fixedCircle = document.querySelector('.conflict-circle--fixed')
	if (fixedCircle) {
		let id = fixedCircle.closest('[data-conflict-id]').dataset.conflictId
		if (id.split(' ').length !== 1) {
			id = document.querySelector('svg[data-conflict-id].fixed').dataset.conflictId
		}
		return id
	}
	return null
}

function switchConflict(conflictId) {
	const conflictIdToSwitch = conflictId
	const fixedConflictId = getCurrentConflictId()
	const conflictSVGToSwitch = document.querySelector(`svg[data-conflict-id="${conflictId}"]`)
	const fixedSVG = document.querySelector('svg[data-conflict-id].fixed')
	if (conflictIdToSwitch !== fixedConflictId) {
		if (fixedSVG) {
			fixedSVG.classList.remove('fixed', 'fixed--prev', 'hover')
		}
		if (conflictSVGToSwitch) {
			conflictSVGToSwitch.classList.add('fixed')
		}
		mapCirclesById(fixedConflictId, unhoverCircles)
		mapCirclesById(fixedConflictId, disableFixedCircles)
		mapCirclesById(fixedConflictId, disablePrevCircles)
		mapCirclesById(conflictId, fixCircles)
	} else {
		if (conflictSVGToSwitch) {
			conflictSVGToSwitch.classList.remove('hover')
			conflictSVGToSwitch.classList.toggle('fixed')
		}
		mapCirclesById(conflictId, toggleCircles)
	}
}

function hoverConflict(conflictId) {
	const conflictIdToHover = conflictId
	const fixedConflictId = getCurrentConflictId()
	const conflictSVGToHover = document.querySelector(`svg[data-conflict-id="${conflictId}"]`)
	if (conflictSVGToHover) {
		conflictSVGToHover.classList.add('hover')
	}

	const fixedSVG = document.querySelector('svg[data-conflict-id].fixed')
	if (fixedConflictId && fixedConflictId !== conflictIdToHover) {
		if (fixedSVG) {
			fixedSVG.classList.add('fixed--prev')
		}
		mapCirclesById(fixedConflictId, disableCirclesAsPrevious)
	}
}

function unhoverConflict(conflictId) {
	const conflictIdToHover = conflictId
	const fixedPrevConflictId = getCurrentConflictId()
	const conflictSVGToUnhover = document.querySelector(`svg[data-conflict-id="${conflictId}"]`)
	if (conflictSVGToUnhover) {
		conflictSVGToUnhover.classList.remove('hover')
	}

	const fixedPrevSVG = document.querySelector('svg[data-conflict-id].fixed--prev')
	if (fixedPrevConflictId !== conflictIdToHover) {
		if (fixedPrevSVG) {
			fixedPrevSVG.classList.remove('fixed--prev')
		}
		mapCirclesById(fixedPrevConflictId, disablePrevCircles)
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
		<svg data-conflict-id="${id}"
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
		if (titleP.offsetWidth >= 215) {
			title.classList.add('pc-part__title--gradient')
		}
		if (details.offsetWidth >= 215) {
			details.classList.add('pc-part__details--gradient')
		}
	})
}

const productRating = document.querySelectorAll('.product-score-rating')
if (productRating) {
	productRating.forEach(rating => {
		const value = parseInt(rating.textContent)
		const DASH_LEN = 11
		const GAP_LEN = 5
		const CIRCUMFERENCE = 2 * Math.PI * 13
		const svg = `
		<svg class="rate-ring" width="30" height="30">
		<circle 
			stroke="#fff" fill="transparent" stroke-width="2" cx="15" cy="15" r="13"
			stroke-dasharray="
			${Array(value).fill(11).join(` ${GAP_LEN} `)} 
			${CIRCUMFERENCE - 16 * value + GAP_LEN}
			"
		></circle>
    	</svg>
		`
		rating.insertAdjacentHTML('beforeend', svg)
	})
}

const sectionSlider = document.querySelector('.section__slider')
if (sectionSlider) {
	const products = sectionSlider.querySelectorAll('.product--short')
	products.forEach(product => {
		const title = product.querySelector('.product__title')
		if (title.offsetHeight > 40) {
			title.classList.add('product__title--overflow')
			const productName = title.querySelector('.product__name')
			truncate(40, title, productName)
		}

		function truncate(maxHeight, parent, elToOverflow) {
			while (parent.offsetHeight > maxHeight) {
				elToOverflow.textContent = elToOverflow.textContent.substr(
					0,
					elToOverflow.textContent.length - 1
				)
			}
		}
	})
}

const searchBars = document.querySelectorAll('.search-bar')
if (searchBars) {
	searchBars.forEach(sb => {
		sb.addEventListener('click', () => {
			sb.classList.add('search-bar--active')
			document.querySelector('body').addEventListener('click', e => {
				if (!sb.contains(e.target)) sb.classList.remove('search-bar--active')
			})
		})
	})
}

const menuBtn = document.querySelector('.header .icon-menu')
if (menuBtn) {
	const headerSign = document.querySelector('.header__sign')
	menuBtn.addEventListener('click', () => {
		menuBtn.classList.toggle('icon-menu--opened')
		headerSign.classList.toggle('header__sign--opened')
	})
}
