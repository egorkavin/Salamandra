//Sidebar
const sidebarOpenButtons = document.querySelectorAll('.sidebar__btn');
if (sidebarOpenButtons) {
	sidebarOpenButtons.forEach(button => {
		button.addEventListener('click', e => {
			const buttonClasses = button.classList;
			const buttonLastClass = buttonClasses.item(buttonClasses.length - 1);
			const parentSelector = '.sidebar--' + buttonLastClass.split('--').pop();
			const parentSidebar = document.querySelector(parentSelector);
			parentSidebar.classList.toggle(parentSelector.substr(1) + '--hidden');
		});
	});

	const filters = document.querySelectorAll('.filter');
	filters.forEach(filter => {
		const filterName = filter.querySelector('.filter__name');
		if (filterName) {
			const itemsList = filter.querySelector('.filter__items-list');
			const itemsCount = filterName.querySelector('.filter__items-count');
			itemsCount.innerHTML = '(' + itemsList.childElementCount + ')';
			toggleItemsListByFilterName(itemsList, filterName);
			setItemsCountInList(itemsCount, itemsList);
		}
	});

	const filtersItemsQuantity = document.querySelectorAll('.filter__item-quantity');
	filtersItemsQuantity.forEach(filterItemQuantity => {
		if (filterItemQuantity.textContent === '(+0)') {
			const parent = filterItemQuantity.closest('.filter__item');
			parent.classList.add('filter__item--disabled');
			parent.addEventListener('click', e => e.preventDefault());
		}
	});

	function toggleItemsListByFilterName(itemsList, filterName) {
		filterName.addEventListener('click', e => {
			e.preventDefault();
			filterName.classList.toggle('filter__name--active');
			const itemsListHeight = itemsList.clientHeight;
			const itemsWrapper = itemsList.parentNode;
			if (itemsWrapper.style.maxHeight) {
				itemsWrapper.removeAttribute('style');
			} else {
				itemsWrapper.style.maxHeight = itemsListHeight + 'px';
			}
		});
	}

	function setItemsCountInList(itemsCount, itemsList) {
		itemsList.addEventListener('change', e => {
			let count = itemsList.querySelectorAll('input[type="checkbox"]:checked').length;
			if (count === 0) {
				itemsCount.innerHTML = `(${itemsList.childElementCount})`;
			} else {
				itemsCount.innerHTML = `(${count}/${itemsList.childElementCount})`;
			}
		});
	}
}

//Pagination
const paginationSection = document.querySelector('.pages-navigation');
//const pageNumberButtons = paginationSection.querySelector('.pages-navigation__page-numbers');
if (paginationSection) {
	const itemsFromAllPages = document.querySelectorAll('.product');
	let itemsPerPage = 4;
	let currentPage = 1;
	displayPage(1, itemsPerPage, itemsFromAllPages);
	createPagination(paginationSection, itemsPerPage, itemsFromAllPages);

	function displayPage(pageNumber, itemsPerPage, allItems) {
		const from = (pageNumber - 1) * itemsPerPage;
		const arrOfNodes = Array.prototype.slice.call(allItems);
		const pageItems = arrOfNodes.splice(from, itemsPerPage);
		pageItems.forEach(item => item.removeAttribute('style'));
		arrOfNodes.forEach(item => (item.style.display = 'none'));
	}

	function createPagination(paginationSection, itemsPerPage, allItems) {
		const numberOfPages = Math.ceil(itemsFromAllPages.length / itemsPerPage);
		const pageNumbersList = paginationSection.querySelector('.pages-navigation__list-of-pages');
		for (let i = 0; i < numberOfPages; i++) {
			const btn = createPageButton(i + 1, itemsPerPage, allItems);
			pageNumbersList.appendChild(btn);
		}
	}

	function createPageButton(pageNumber, itemsPerPage, allItems) {
		const li = document.createElement('li');
		const button = document.createElement('button');
		li.classList.add('pages-navigation__page-wrapper');
		button.classList.add('pages-navigation__page-button');
		button.textContent = pageNumber;

		if (pageNumber === currentPage) {
			li.classList.add('pages-navigation__page-wrapper--active');
		}
		button.addEventListener('click', () => {
			currentPage = pageNumber;
			displayPage(pageNumber, itemsPerPage, allItems);
			const prevPage = document.querySelector(
				'.pages-navigation__page-wrapper.pages-navigation__page-wrapper--active'
			);
			prevPage.classList.remove('pages-navigation__page-wrapper--active');
			li.classList.add('pages-navigation__page-wrapper--active');
		});
		li.appendChild(button);
		return li;
	}
}

//Tabs
const tabs = document.querySelectorAll('.product-tabs__item');
if (tabs) {
	tabs.forEach(tab => {
		tab.addEventListener('click', e => {
			const prevActiveTab = document.querySelector('.product-tabs__item--active');
			const prevActiveTabBody = document.querySelector('#' + prevActiveTab.dataset.tab);
			const newActiveTabBody = document.querySelector('#' + tab.dataset.tab);
			prevActiveTab.classList.remove('product-tabs__item--active');
			prevActiveTabBody.classList.remove('product-tabs__block--active');
			tab.classList.add('product-tabs__item--active');
			newActiveTabBody.classList.add('product-tabs__block--active');
		});
	});
}

//Stars rating
const stars = document.querySelectorAll('.product-rating__star');
if (stars) {
	stars.forEach(item =>
		item.addEventListener('click', () => {
			const { value } = item.dataset;
			item.parentNode.dataset.totalValue = value;
			const note = document.querySelector('.product-rating__note');
			if (note) note.remove();
		})
	);
}

const yearRates = document.querySelectorAll('.year-rate');
if (yearRates) {
	const value = document.querySelectorAll('.year-rate__value');
	value.forEach(yearRate => {
		const percentValue = parseInt(yearRate.textContent);
		const circumference = 2 * Math.PI * 13;
		const offset = circumference - percentValue / 100 * circumference;
		const circle = `
		<svg class="percent-circle" width="30" height="30">
			<circle class="percent-circle__circle" stroke="#fff"
				fill="transparent" stroke-width="2" cx="15" cy="15"
				r="13" stroke-dasharray="${circumference} ${circumference}" 
				stroke-dashoffset="${offset}"/>
		</svg>
		`;
		yearRate.innerHTML = percentValue === 100 ? '★' : `${percentValue}`;
		yearRate.innerHTML += circle;
	});
}

//Slider
const slider = document.querySelector('.product-slider');
if (slider) {
	const sliderTrack = slider.querySelector('.product-slider__track');
	const sliderBtnNext = slider.querySelector('.product-slider__button_next');
	const sliderBtnPrev = slider.querySelector('.product-slider__button_prev');
	const sliderItems = slider.querySelectorAll('.product-slider__item-wrapper');
	const itemsCount = sliderItems.length;
	const itemsWidthArr = [].map.call(sliderItems, item => Math.round(item.getBoundingClientRect().width));

	const startPosition = calcVisibleItems(itemsWidthArr);
	let position = startPosition;
	let offset = 0;

	sliderBtnNext.addEventListener('click', moveTrackForward);

	function moveTrackForward() {
		sliderBtnPrev.style.opacity = '100%';
		sliderBtnPrev.addEventListener('click', moveTrackBack);

		let itemsLeft = itemsCount - position;
		if (itemsLeft > 3) {
			offset += calcOffset(itemsWidthArr, position, (position += 3));
		} else {
			offset += calcOffset(itemsWidthArr, position, (position = itemsCount));
			sliderBtnNext.style.opacity = '0';
			sliderBtnNext.removeEventListener('click', moveTrackForward);
		}
		sliderTrack.style.transform = `translateX(-${offset}px)`;
	}

	function moveTrackBack() {
		sliderBtnNext.style.opacity = '100%';
		sliderBtnNext.addEventListener('click', moveTrackForward);

		let itemsLeft = calcPrevItems(itemsWidthArr, offset);
		if (itemsLeft > 3) {
			offset -= calcOffset(itemsWidthArr, (position -= 3), position + 3);
		} else {
			offset -= calcOffset(itemsWidthArr, 0, itemsLeft);
			position = startPosition;
			sliderBtnPrev.style.opacity = '0';
			sliderBtnPrev.removeEventListener('click', moveTrackBack);
		}
		sliderTrack.style.transform = `translateX(-${offset}px)`;
	}

	sliderTrack.addEventListener('click', e => {
		if (e.target.tagName == 'IMG') {
			let mainPhoto = document.querySelector('.product__image-wrapper');
			mainPhoto.innerHTML = `
			<img src="${e.target.getAttribute('src')}" class="product__image"></img>
			`;
		}
	});

	function calcVisibleItems(itemsWidthArr) {
		let totalWidth = 0;
		for (let i = 0; i < itemsWidthArr.length; i++) {
			if (totalWidth >= 485) {
				return i - 1;
			}
			totalWidth += itemsWidthArr[i];
		}
		return itemsWidthArr.length;
	}

	function calcOffset(itemsWidthArray, start, end) {
		const nextItemsWidth = [].slice.call(itemsWidthArray, start, end);
		return nextItemsWidth.reduce((a, b) => a + b);
	}

	function calcPrevItems(itemsWidthArr, offset) {
		let buf = 0;
		for (let i = 0; i < itemsWidthArr.length; i++) {
			buf += itemsWidthArr[i];
			if (offset - buf <= 0) {
				return i + 1;
			}
		}
	}
}

//Comment votes
const commentVotes = document.querySelectorAll('.comment-vote');
if (commentVotes) {
	commentVotes.forEach(vote => {
		const upvoteBtn = vote.querySelector('.comment-vote__btn--up');
		const downvoteBtn = vote.querySelector('.comment-vote__btn--down');
		const rating = vote.querySelector('.comment-vote__rating');
		upvoteBtn.addEventListener('click', () => {
			rating.textContent++;
			checkRating(rating);
		});
		downvoteBtn.addEventListener('click', () => {
			rating.textContent--;
			checkRating(rating);
		});

		checkRating(rating);
	});

	function checkRating(rating) {
		const comment = rating.closest('.product-comment');
		if (rating.textContent >= 10) {
			comment.classList.add('product-comment--good');
		} else if (rating.textContent <= -5) {
			comment.classList.add('product-comment--bad');
		} else {
			comment.classList.remove('product-comment--good');
			comment.classList.remove('product-comment--bad');
		}
	}
}

//Price at shops
const pricesAtShops = document.querySelectorAll('.product-price__price');
if (pricesAtShops) {
	pricesAtShops.forEach(price => {
		if (!price.textContent.trim().localeCompare('нет в наличии')) {
			price.style.border = 'none';
		}
	});
}

const pcParts = document.querySelector('.pc-parts');
if (pcParts) {
	const prices = pcParts.querySelectorAll('.pc-part__price');
	const totalPrice = pcParts.querySelector('.pc-parts__total');
	const reducer = (acc, price) => {
		const priceContent = price.textContent;
		const priceValue = priceContent.replace(/\s/g, '').replace(/,/g, '.');
		return acc + +priceValue;
	};
	const sum = [].reduce.call(prices, reducer, 0);
	totalPrice.textContent = Math.round(sum).toLocaleString('ru-RU') + ' ₽';
}

// //TODO
// const pcParts = document.querySelectorAll('.pc-part__title');
// if (pcParts) {
// 	const pos1 = pcParts[0].getBoundingClientRect();
// 	const pos2 = pcParts[1].getBoundingClientRect();
// 	let line = document.createElement('svg');
// 	line.innerHTML = `<line id="line1" x1=${pos1.left} y1=${pos1.top} x2=${pos2.left} y2=${pos2.top} stroke=red/>`;
// }
