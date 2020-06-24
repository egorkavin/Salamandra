const sidebarOpenButtons = document.querySelectorAll('.sidebar__btn');
sidebarOpenButtons.forEach(button => {
	button.addEventListener('click', e => {
		const buttonClasses = button.classList;
		const buttonLastClass = buttonClasses.item(buttonClasses.length - 1);
		const parentSelector = '.sidebar_' + buttonLastClass.split('_').pop();
		const parentSidebar = document.querySelector(parentSelector);
		parentSidebar.classList.toggle(parentSelector.substr(1) + '_hidden');
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

function toggleItemsListByFilterName(itemsList, filterName) {
	filterName.addEventListener('click', e => {
		e.preventDefault();
		filterName.classList.toggle('filter__name_active');
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

const filtersItemsQuantity = document.querySelectorAll('.filter__item-quantity');
filtersItemsQuantity.forEach(filterItemQuantity => {
	if (filterItemQuantity.textContent === '(+0)') {
		const parent = filterItemQuantity.closest('.filter__item');
		parent.classList.add('filter__item_disabled');
		parent.addEventListener('click', e => e.preventDefault());
	}
});

const tabs = document.querySelectorAll('.product-tabs__item');
tabs.forEach(tab => {
	tab.addEventListener('click', e => {
		const prevActiveTab = document.querySelector('.product-tabs__item_active');
		const prevActiveTabBody = document.querySelector('#' + prevActiveTab.dataset.tab);
		const newActiveTabBody = document.querySelector('#' + tab.dataset.tab);
		prevActiveTab.classList.remove('product-tabs__item_active');
		prevActiveTabBody.classList.remove('product-tabs__block_active');
		tab.classList.add('product-tabs__item_active');
		newActiveTabBody.classList.add('product-tabs__block_active');
	});
});

const sliderTrack = document.querySelector('.product-slider__track');
const sliderBtnNext = document.querySelector('.product-slider__button_next');
let offset = 100;
sliderBtnNext.addEventListener('click', e => {
	offset *= 2;
	sliderTrack.style.transform = `translateX(-${offset}px)`;
});


const itemsFromAllPages = document.querySelectorAll('.product');
let itemsPerPage = 4;
let currentPage = 1;
const paginationSection = document.querySelector('.pages-navigation');
const pageNumberButtons = paginationSection.querySelector('.pages-navigation__page-numbers');

function displayPage(pageNumber, itemsPerPage, allItems) {
	const from = (pageNumber - 1) * itemsPerPage;
	const arrOfNodes = Array.prototype.slice.call(allItems);
	const pageItems = arrOfNodes.splice(from, itemsPerPage);
	pageItems.forEach(item => item.removeAttribute('style'));
	arrOfNodes.forEach(item => item.style.display = 'none');
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
		li.classList.add('pages-navigation__page-wrapper_active');
	}
	button.addEventListener('click', () => {
		currentPage = pageNumber;
		displayPage(pageNumber, itemsPerPage, allItems);
		const prevPage = document.querySelector('.pages-navigation__page-wrapper.pages-navigation__page-wrapper_active');
		prevPage.classList.remove('pages-navigation__page-wrapper_active');
		li.classList.add('pages-navigation__page-wrapper_active');
	});
	li.appendChild(button);
	return li;
}

displayPage(1, itemsPerPage, itemsFromAllPages);
createPagination(paginationSection, itemsPerPage, itemsFromAllPages);