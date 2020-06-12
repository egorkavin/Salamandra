let sidebar = document.querySelector('.sidebar');
let sidebarBtn = sidebar.querySelector('.sidebar__btn');
sidebarBtn.addEventListener('click', (e) => {
	if (e.target.closest('.sidebar__btn')) {
		sidebar.classList.toggle('sidebar_hidden');
	}
});

let filters = document.querySelectorAll('.filter');
filters.forEach((filter) => {
	let filterName = filter.querySelector('.filter__name');
	if (filterName) {
		let filterItemsList = filter.querySelector('.filter__items-list');
		let filterItemsCount = filter.querySelector('.filter__items-count');
		filterItemsCount.innerHTML = '(' + filterItemsList.childElementCount + ')';
		filterName.addEventListener('click', e => {
			e.preventDefault();
			if (e.target.closest('.filter__name')) {
				filterName.classList.toggle('filter__name_active');
				filterItemsList.classList.toggle('filter__items-list_active');
			}
		});
		filterItemsList.addEventListener('change', e => {
			let count = filterItemsList.querySelectorAll('input[type="checkbox"]:checked').length;
			if (count === 0) {
				filterItemsCount.innerHTML = `(${filterItemsList.childElementCount})`;
			} else {
				filterItemsCount.innerHTML = `(${count}/${filterItemsList.childElementCount})`;
			}
		});
	}
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