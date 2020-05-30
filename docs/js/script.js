function testWebP(callback) {
	var webP = new Image();
	webP.onload = webP.onerror = function() {
		callback(webP.height == 2);
	};
	webP.src =
		'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
}

testWebP(function(support) {
	if (support == true) {
		document.querySelector('body').classList.add('webp');
	}
});

let sidebar = document.querySelector('.sidebar');
let sidebarBtn = sidebar.querySelector('.sidebar__btn');
sidebarBtn.addEventListener('click', (e) => {
	if (e.target.closest('.sidebar__btn')) {
		sidebar.classList.toggle('sidebar_hidden');
	}
});

let filters = document.querySelectorAll('.filter');
filters.forEach((filter) => {
	//console.log(filter.querySelector('.filter__name'));
	let filterName = filter.querySelector('.filter__name');
	if (filterName) {
		let filterItemsList = filter.querySelector('.filter__items-list');

		let filterItemsCount = filter.querySelector('.filter__items-count');
		filterItemsCount.innerHTML = '(' + filterItemsList.childElementCount + ')';
		filterName.addEventListener('click', (e) => {
			e.preventDefault();
			if (e.target.closest('.filter__name')) {
				filterName.classList.toggle('filter__name_active');
				filterItemsList.classList.toggle('filter__items-list_active');
				// console.log(filterItemsList.scrollHeight);
			}
		});

		filterItemsList.addEventListener('change', (e) => {
			let count = filterItemsList.querySelectorAll('input[type="checkbox"]:checked').length;
			if (count === 0) {
				filterItemsCount.innerHTML = '(' + filterItemsList.childElementCount + ')';
			} else {
				filterItemsCount.innerHTML = '(' + count + '/' + filterItemsList.childElementCount + ')';
			}
		});
	}
});
