'use strict'

//Sidebar
const sidebars = document.querySelectorAll('.sidebar')
if (sidebars.length) {
	sidebars.forEach(sidebar => {
		const btn = sidebar.querySelector('.sidebar__btn')
		btn.addEventListener('click', () => {
			sidebar.classList.toggle('sidebar--hidden')
		})
	})

	const filters = document.querySelectorAll('.filter')
	filters.forEach(filter => {
		const filterName = filter.querySelector('.filter__name span')
		if (filterName) {
			const itemsList = filter.querySelector('.filter__items-list')
			filterName.insertAdjacentHTML(
				'beforeend',
				`
				<span class="filter__items-count">(${itemsList.childElementCount})</span>
				<span class="filter__icon filter__icon--arrow"></span>
				`
			)

			const filterItemsQuantity = filter.querySelectorAll('.filter__item-quantity')
			filterItemsQuantity.forEach(filterItemQuantity => {
		if (filterItemQuantity.textContent === '(+0)') {
			const parent = filterItemQuantity.closest('.filter__item')
			parent.classList.add('filter__item--disabled')
			parent.addEventListener('click', e => e.preventDefault())
		}
	})

			const itemsCount = filter.querySelector('.filter__items-count')
			setItemsCountInList(itemsCount, itemsList)
			toggleItemsListByFilterName(itemsList, filterName.parentNode)
				}
		})

	function setItemsCountInList(itemsCount, itemsList) {
	const getCheckedItems = itemsList =>
		itemsList.querySelectorAll('input[type="checkbox"]:checked')

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

					const cancel = parent.parentNode.querySelector('.svg-icon.icon-cancel-filter')
						cancel.addEventListener('click', () => {
							const checkedItems = getCheckedItems(itemsList)
							checkedItems.forEach(item => {
								item.checked = false
							})
							setItemsCountToZero(itemsCount)
						})
					}
				}

			function setItemsCountToZero(itemsCount) {
				itemsCount.innerHTML = `(${itemsList.childElementCount})`
				const icons = parent.parentNode.querySelectorAll('.svg-icon')
				icons.forEach(icon => icon.remove())
			}
		})
	}

	function toggleItemsListByFilterName(itemsList, filterName) {
		filterName.addEventListener('click', e => {
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
}

//Tabs
const tabs = document.querySelectorAll('.product-tabs__item')
if (tabs.length) {
	tabs.forEach(tab => {
		tab.addEventListener('click', () => {
			const activeTab = document.querySelector('.product-tabs__item--active')
			const activeTabBody = document.querySelector(`#${activeTab.dataset.tab}`)
			activeTab.classList.remove('product-tabs__item--active')
			activeTabBody.classList.remove('product-tabs__block--active')

			const newActiveTabBody = document.querySelector(`#${tab.dataset.tab}`)
			tab.classList.add('product-tabs__item--active')
			newActiveTabBody.classList.add('product-tabs__block--active')
		})
	})
}

//Stars rating
const stars = document.querySelectorAll('.product-rating__star')
if (stars.length) {
	stars.forEach(star =>
		star.addEventListener('click', () => {
			const { value } = star.dataset
			star.parentNode.dataset.totalValue = value
			const note = document.querySelector('.product-rating__note')
			if (note) {
				note.remove()
			}
		})
	)
}

const yearRates = document.querySelectorAll('.year-rate')
if (yearRates.length) {
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
if (commentVotes.length) {
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
if (pricesAtShops.length) {
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
	const defaultType = document.querySelector('.view-types__type--active')
	setProductsViewType(defaultType)

	viewTypes.forEach(type => {
		type.addEventListener('click', () => {
			const active = document.querySelector('.view-types__type--active')
			if (type !== active) {
				if (active) {
					active.classList.remove('view-types__type--active')
				}
				type.classList.add('view-types__type--active')
				setProductsViewType(type)
			}
		})
	})

	function setProductsViewType(type) {
		const products = document.querySelectorAll('.product')
		const container = document.querySelector('.container')
				if (type.classList.contains('lines')) {
			products.forEach(product => {
				product.classList.add('product--long')
				product.classList.remove('product--flex')
				container.classList.remove('container--full-width')
			})
		} else if (type.classList.contains('flex-lines')) {
			products.forEach(product => {
				product.classList.add('product--flex')
				product.classList.remove('product--long')
				container.classList.remove('container--full-width')
			})
		} else if (type.classList.contains('blocks')) {
			products.forEach(product => {
				product.classList.add('product--flex')
				product.classList.remove('product--long')
				container.classList.add('container--full-width')
			})
		}
	}
}
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
if (dataIcons.length) {
dataIcons.forEach(item => {
		const { icon } = item.dataset
	if (item.classList.contains('pc-parts__choose-item')) {
			item.insertAdjacentHTML('afterbegin', `<span class="svg-icon icon-${icon}"></span>`)
	} else {
		const title = item.querySelector('.pc-part__title')
			title.insertAdjacentHTML('afterbegin', `<span class="svg-icon icon-${icon}"></span>`)
	}
})
}

const pcPartsDescriptions = document.querySelectorAll('.pc-part__description')
if (pcPartsDescriptions) {
	pcPartsDescriptions.forEach(description => {
		const title = description.querySelector('.pc-part__title')
		const titleP = title.querySelector('p')
		const details = description.querySelector('.pc-part__details')
		if (titleP.getBoundingClientRect().width >= 215) {
			title.classList.add('pc-part__title--gradient')
		}
		if (details.getBoundingClientRect().width >= 215) {
			details.classList.add('pc-part__details--gradient')
		}
	})
}

const productRating = document.querySelectorAll('.product-score-rating')
if (productRating.length) {
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
			${Array(value).fill(DASH_LEN).join(` ${GAP_LEN} `)} 
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
		if (title.getBoundingClientRect().height > 40) {
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
if (searchBars.length) {
	searchBars.forEach(sb => {
		sb.addEventListener('click', () => {
			sb.classList.add('search-bar--active')
			document.querySelector('body').addEventListener('click', e => {
				if (!sb.contains(e.target)) {
					sb.classList.remove('search-bar--active')
				}
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
