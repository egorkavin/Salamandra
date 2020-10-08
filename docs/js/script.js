"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//Sidebar
var sidebarOpenButtons = document.querySelectorAll('.sidebar__btn');

if (sidebarOpenButtons) {
  var toggleItemsListByFilterName = function toggleItemsListByFilterName(itemsList, filterName) {
    filterName.addEventListener('click', function (e) {
      e.preventDefault();

      if (!e.target.classList.contains('icon-cancel-filter')) {
        filterName.classList.toggle('filter__name--active');
        var itemsListHeight = itemsList.clientHeight;
        var itemsWrapper = itemsList.parentNode;

        if (itemsWrapper.style.maxHeight) {
          itemsWrapper.removeAttribute('style');
        } else {
          itemsWrapper.style.maxHeight = "".concat(itemsListHeight, "px");
        }
      }
    });
  };

  var setItemsCountInList = function setItemsCountInList(itemsCount, itemsList) {
    itemsList.addEventListener('change', function () {
      var parent = itemsCount.parentNode;
      var count = getCheckedItems(itemsList).length;

      if (count === 0) {
        setItemsCountToZero(itemsCount);
      } else {
        itemsCount.innerHTML = "(".concat(count, "/").concat(itemsList.childElementCount, ")");

        if (parent.parentNode.childElementCount === 1) {
          var addCancelListener = function addCancelListener(itemsCount) {
            var cancel = parent.parentNode.querySelector('.svg-icon.icon-cancel-filter');
            cancel.addEventListener('click', function () {
              var checkedItems = getCheckedItems(itemsList);
              checkedItems.forEach(function (item) {
                item.checked = false;
              });
              setItemsCountToZero(itemsCount);
            });
          };

          parent.insertAdjacentHTML('beforebegin', '<span class="svg-icon icon-square-box"><span>');
          parent.insertAdjacentHTML('afterend', '<span class="svg-icon icon-cancel-filter"><span>');
          addCancelListener(itemsCount);
        }
      }

      function setItemsCountToZero(itemsCount) {
        itemsCount.innerHTML = "(".concat(itemsList.childElementCount, ")");
        var icons = parent.parentNode.querySelectorAll('.svg-icon');
        icons.forEach(function (icon) {
          return parent.parentNode.removeChild(icon);
        });
      }
    });
  };

  sidebarOpenButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var buttonClasses = button.classList;
      var buttonLastClass = buttonClasses.item(buttonClasses.length - 1);
      var parentSelector = ".sidebar--".concat(buttonLastClass.split('--').pop());
      var parentSidebar = document.querySelector(parentSelector);
      parentSidebar.classList.toggle("".concat(parentSelector.substr(1), "--hidden"));
    });
  });
  var filters = document.querySelectorAll('.filter');
  filters.forEach(function (filter) {
    var filterName = filter.querySelector('.filter__name span');

    if (filterName) {
      var itemsList = filter.querySelector('.filter__items-list');
      var itemsCount = document.createElement('span');
      itemsCount.innerHTML = " (".concat(itemsList.childElementCount, ")");
      filterName.insertAdjacentElement('beforeend', itemsCount);
      filterName.insertAdjacentHTML('beforeend', '<span class="filter__icon filter__icon--arrow"></span>');
      toggleItemsListByFilterName(itemsList, filterName.parentNode);
      setItemsCountInList(itemsCount, itemsList);
    }
  });
  var filtersItemsQuantity = document.querySelectorAll('.filter__item-quantity');
  filtersItemsQuantity.forEach(function (filterItemQuantity) {
    if (filterItemQuantity.textContent === '(+0)') {
      var parent = filterItemQuantity.closest('.filter__item');
      parent.classList.add('filter__item--disabled');
      parent.addEventListener('click', function (e) {
        return e.preventDefault();
      });
    }
  });

  var getCheckedItems = function getCheckedItems(itemsList) {
    return itemsList.querySelectorAll('input[type="checkbox"]:checked');
  };
} //Pagination


var paginationSection = document.querySelector('.pages-navigation'); //const pageNumberButtons = paginationSection.querySelector('.pages-navigation__page-numbers');

if (paginationSection) {
  var displayPage = function displayPage(pageNumber, itemsPerPage, allItems) {
    var from = (pageNumber - 1) * itemsPerPage;
    var arrOfNodes = Array.prototype.slice.call(allItems);
    var pageItems = arrOfNodes.splice(from, itemsPerPage);
    pageItems.forEach(function (item) {
      return item.removeAttribute('style');
    });
    arrOfNodes.forEach(function (item) {
      item.style.display = 'none';
    });
  };

  var createPagination = function createPagination(paginationSection, itemsPerPage, allItems) {
    var numberOfPages = Math.ceil(itemsFromAllPages.length / itemsPerPage);
    var pageNumbersList = paginationSection.querySelector('.pages-navigation__list-of-pages');

    for (var i = 0; i < numberOfPages; i++) {
      var btn = createPageButton(i + 1, itemsPerPage, allItems);
      pageNumbersList.appendChild(btn);
    }
  };

  var createPageButton = function createPageButton(pageNumber, itemsPerPage, allItems) {
    var li = document.createElement('li');
    var button = document.createElement('button');
    li.classList.add('pages-navigation__page-wrapper');
    button.classList.add('pages-navigation__page-button');
    button.textContent = pageNumber;

    if (pageNumber === currentPage) {
      li.classList.add('pages-navigation__page-wrapper--active');
    }

    button.addEventListener('click', function () {
      currentPage = pageNumber;
      displayPage(pageNumber, itemsPerPage, allItems);
      var prevPage = document.querySelector('.pages-navigation__page-wrapper.pages-navigation__page-wrapper--active');
      prevPage.classList.remove('pages-navigation__page-wrapper--active');
      li.classList.add('pages-navigation__page-wrapper--active');
    });
    li.appendChild(button);
    return li;
  };

  var itemsFromAllPages = document.querySelectorAll('.product');
  var itemsPerPage = 4;
  var currentPage = 1;
  displayPage(1, itemsPerPage, itemsFromAllPages);
  createPagination(paginationSection, itemsPerPage, itemsFromAllPages);
} //Tabs


var tabs = document.querySelectorAll('.product-tabs__item');

if (tabs) {
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var prevActiveTab = document.querySelector('.product-tabs__item--active');
      var prevActiveTabBody = document.querySelector("#".concat(prevActiveTab.dataset.tab));
      var newActiveTabBody = document.querySelector("#".concat(tab.dataset.tab));
      prevActiveTab.classList.remove('product-tabs__item--active');
      prevActiveTabBody.classList.remove('product-tabs__block--active');
      tab.classList.add('product-tabs__item--active');
      newActiveTabBody.classList.add('product-tabs__block--active');
    });
  });
} //Stars rating


var stars = document.querySelectorAll('.product-rating__star');

if (stars) {
  stars.forEach(function (item) {
    return item.addEventListener('click', function () {
      var value = item.dataset.value;
      item.parentNode.dataset.totalValue = value;
      var note = document.querySelector('.product-rating__note');
      if (note) note.remove();
    });
  });
}

var yearRates = document.querySelectorAll('.year-rate');

if (yearRates) {
  var value = document.querySelectorAll('.year-rate__value');
  value.forEach(function (yearRate) {
    var percentValue = parseInt(yearRate.textContent);
    var circumference = 2 * Math.PI * 13;
    var offset = circumference - percentValue / 100 * circumference;
    var circle = "\n\t\t<svg class=\"percent-circle\" width=\"30\" height=\"30\">\n\t\t\t<circle class=\"percent-circle__circle\" stroke=\"#fff\"\n\t\t\t\tfill=\"transparent\" stroke-width=\"2\" cx=\"15\" cy=\"15\"\n\t\t\t\tr=\"13\" stroke-dasharray=\"".concat(circumference, " ").concat(circumference, "\" \n\t\t\t\tstroke-dashoffset=\"").concat(offset, "\"/>\n\t\t</svg>\n\t\t");
    yearRate.innerHTML = percentValue === 100 ? '★' : "".concat(percentValue);
    yearRate.innerHTML += circle;
  });
} //Slider


var slider = document.querySelector('.product-slider');

if (slider) {
  var moveTrackForward = function moveTrackForward() {
    sliderBtnPrev.style.opacity = '100%';
    sliderBtnPrev.addEventListener('click', moveTrackBack);
    var itemsLeft = itemsCount - position;

    if (itemsLeft > 3) {
      offset += calcOffset(itemsWidthArr, position, position += 3);
    } else {
      offset += calcOffset(itemsWidthArr, position, position = itemsCount);
      sliderBtnNext.style.opacity = '0';
      sliderBtnNext.removeEventListener('click', moveTrackForward);
    }

    sliderTrack.style.transform = "translateX(-".concat(offset, "px)");
  };

  var moveTrackBack = function moveTrackBack() {
    sliderBtnNext.style.opacity = '100%';
    sliderBtnNext.addEventListener('click', moveTrackForward);
    var itemsLeft = calcPrevItems(itemsWidthArr, offset);

    if (itemsLeft > 3) {
      offset -= calcOffset(itemsWidthArr, position -= 3, position + 3);
    } else {
      offset -= calcOffset(itemsWidthArr, 0, itemsLeft);
      position = startPosition;
      sliderBtnPrev.style.opacity = '0';
      sliderBtnPrev.removeEventListener('click', moveTrackBack);
    }

    sliderTrack.style.transform = "translateX(-".concat(offset, "px)");
  };

  var calcVisibleItems = function calcVisibleItems(itemsWidthArr) {
    var totalWidth = 0;

    for (var i = 0; i < itemsWidthArr.length; i++) {
      if (totalWidth >= 485) {
        return i - 1;
      }

      totalWidth += itemsWidthArr[i];
    }

    return itemsWidthArr.length;
  };

  var calcOffset = function calcOffset(itemsWidthArray, start, end) {
    var nextItemsWidth = [].slice.call(itemsWidthArray, start, end);
    return nextItemsWidth.reduce(function (a, b) {
      return a + b;
    });
  };

  var calcPrevItems = function calcPrevItems(itemsWidthArr, offset) {
    var buf = 0;

    for (var i = 0; i < itemsWidthArr.length; i++) {
      buf += itemsWidthArr[i];

      if (offset - buf <= 0) {
        return i + 1;
      }
    }
  };

  var sliderTrack = slider.querySelector('.product-slider__track');
  var sliderBtnNext = slider.querySelector('.product-slider__button_next');
  var sliderBtnPrev = slider.querySelector('.product-slider__button_prev');
  var sliderItems = slider.querySelectorAll('.product-slider__item-wrapper');
  var itemsCount = sliderItems.length;
  var itemsWidthArr = [].map.call(sliderItems, function (item) {
    return Math.round(item.getBoundingClientRect().width);
  });
  var startPosition = calcVisibleItems(itemsWidthArr);
  var position = startPosition;
  var offset = 0;
  sliderBtnNext.addEventListener('click', moveTrackForward);
  sliderTrack.addEventListener('click', function (e) {
    if (e.target.tagName === 'IMG') {
      var mainPhoto = document.querySelector('.product__image-wrapper');
      mainPhoto.innerHTML = "\n\t\t\t<img src=\"".concat(e.target.getAttribute('src'), "\" class=\"product__image\"></img>\n\t\t\t");
    }
  });
} //Comment votes


var commentVotes = document.querySelectorAll('.comment-vote');

if (commentVotes) {
  var checkRating = function checkRating(rating) {
    var comment = rating.closest('.product-comment');

    if (rating.textContent >= 10) {
      comment.classList.add('product-comment--good');
    } else if (rating.textContent <= -5) {
      comment.classList.add('product-comment--bad');
    } else {
      comment.classList.remove('product-comment--good');
      comment.classList.remove('product-comment--bad');
    }
  };

  commentVotes.forEach(function (vote) {
    var upvoteBtn = vote.querySelector('.comment-vote__btn--up');
    var downvoteBtn = vote.querySelector('.comment-vote__btn--down');
    var rating = vote.querySelector('.comment-vote__rating');
    upvoteBtn.addEventListener('click', function () {
      rating.textContent++;
      checkRating(rating);
    });
    downvoteBtn.addEventListener('click', function () {
      rating.textContent--;
      checkRating(rating);
    });
    checkRating(rating);
  });
} //Price at shops


var pricesAtShops = document.querySelectorAll('.product-price__price');

if (pricesAtShops) {
  pricesAtShops.forEach(function (price) {
    if (!price.textContent.trim().localeCompare('нет в наличии')) {
      price.style.border = 'none';
    }
  });
}

var pcParts = document.querySelector('.pc-parts');

if (pcParts) {
  var prices = pcParts.querySelectorAll('.pc-part__price');
  var totalPrice = pcParts.querySelector('.pc-parts__total');

  var reducer = function reducer(acc, price) {
    var priceContent = price.textContent;
    var priceValue = priceContent.replace(/\s/g, '').replace(/,/g, '.');
    return acc + +priceValue;
  };

  var sum = [].reduce.call(prices, reducer, 0);
  totalPrice.textContent = "".concat(Math.round(sum).toLocaleString('ru-RU'), " \u20BD");
}

var assemblageParts = document.querySelectorAll('.assemblage-parts__part');

if (assemblageParts) {
  assemblageParts.forEach(function (part) {
    var title = part.querySelector('.product__title');
    title.addEventListener('click', function () {
      return part.classList.toggle('product--collapsed');
    });
  });
}

var isWarning = function isWarning(item) {
  return item.classList.contains('conflicts__item--question');
};

function switchConflictsBlockItem(conflictsBlock, item) {
  var chosen = conflictsBlock.querySelector('.conflicts__item--chosen') || item;

  if (!isWarning(item)) {
    if (chosen === item) {
      chosen.classList.remove('conflicts__item--hover');
      chosen.classList.toggle('conflicts__item--chosen');
    } else {
      chosen.classList.remove('conflicts__item--chosen');
      item.classList.add('conflicts__item--chosen');
    }
  }
}

var conflicts = document.querySelectorAll('.conflicts');

if (conflicts) {
  conflicts.forEach(function (conflictsBlock) {
    var items = conflictsBlock.querySelectorAll('.conflicts__item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        switchConflictsBlockItem(conflictsBlock, item);
        var conflictID = item.dataset.conflictid;
        switchConflict(conflictID);
      });
      item.addEventListener('mouseover', function () {
        item.classList.add('conflicts__item--hover');
        var conflictID = item.dataset.conflictid;
        hoverConflictSVG(conflictID);
        hoverCircles(conflictID);
      });
      item.addEventListener('mouseout', function () {
        item.classList.remove('conflicts__item--hover');
        disableHoveredConflictSVG();
        disableHoveredCircles();
      });
    });
  });
} //TODO


var viewTypes = document.querySelectorAll('.view-types__type');

if (viewTypes) {
  viewTypes.forEach(function (type) {
    type.addEventListener('click', function () {
      var active = document.querySelector('.view-types__type--active');

      if (type !== active) {
        active.classList.remove('view-types__type--active');
        type.classList.add('view-types__type--active');
      }
    });
  });
}

var pcPartConflicts = document.querySelectorAll('.pc-part[data-conflictID]');

if (pcPartConflicts) {
  var _conflicts = document.querySelectorAll('.pc-part[data-conflictID="1"]');

  var getTitle = function getTitle(conflict) {
    return conflict.querySelector('.pc-part__title');
  };

  for (var i = 1; _conflicts.length > 0;) {
    if (_conflicts.length !== 1) {
      setConflictsLines.apply(void 0, [i].concat(_toConsumableArray([].map.call(_conflicts, getTitle))));
    }

    _conflicts = document.querySelectorAll(".pc-part[data-conflictID=\"".concat(++i, "\"]"));
  }

  pcPartConflicts.forEach(function (item) {
    var title = item.querySelector('.pc-part__title');
    var circle = document.createElement('span');
    circle.classList.add('pc-part__conflict-circle');
    circle.addEventListener('mouseover', function () {
      circle.classList.add('pc-part__conflict-circle--hover');
      var conflictID = circle.closest('[data-conflictid]').dataset.conflictid;
      hoverConflictSVG(conflictID);
    });
    circle.addEventListener('mouseout', function () {
      circle.classList.remove('pc-part__conflict-circle--hover');
      disableHoveredConflictSVG();
    });
    circle.addEventListener('click', function () {
      var conflictID = circle.closest('[data-conflictid]').dataset.conflictid;
      switchConflict(conflictID);
      var conflictsBlocks = document.querySelectorAll('.conflicts');
      conflictsBlocks.forEach(function (conflictsBlock) {
        var item = conflictsBlock.querySelector(".conflicts__item[data-conflictid=\"".concat(conflictID, "\"]"));
        switchConflictsBlockItem(conflictsBlock, item);
      });
    });
    title.insertAdjacentElement('afterbegin', circle);
  });
}

function switchConflict(conflictID) {
  var conflictSVG = document.querySelector("svg[data-conflictid=\"".concat(conflictID, "\"]"));

  if (conflictSVG) {
    var fixed = document.querySelector('svg[data-conflictid].fixed') || conflictSVG;

    if (fixed === conflictSVG) {
      fixed.classList.remove('hover');
      fixed.classList.toggle('fixed');
      disableHoveredCircles();
      toggleCircles(conflictID);
    } else {
      fixed.classList.remove('fixed', 'fixed--previous');
      conflictSVG.classList.add('fixed');
      disableFixedCircles();
      fixCircles(conflictID);
    }
  }
}

function disableHoveredConflictSVG() {
  var conflictSVG = document.querySelector('svg[data-conflictid].hover');

  if (conflictSVG) {
    conflictSVG.classList.remove('hover');
  }

  var fixedSVG = document.querySelector('svg[data-conflictid].fixed') || conflictSVG;

  if (fixedSVG !== conflictSVG) {
    fixedSVG.classList.remove('fixed--previous');
    var fixedCircles = document.querySelectorAll('.pc-part[data-conflictid] .pc-part__conflict-circle--fixed');

    if (fixedCircles) {
      fixedCircles.forEach(function (circle) {
        return circle.classList.remove('pc-part__conflict-circle--fixed--previous');
      });
    }
  }
}

function hoverConflictSVG(conflictID) {
  var conflictSVG = document.querySelector("svg[data-conflictid=\"".concat(conflictID, "\"]"));

  if (conflictSVG) {
    conflictSVG.classList.add('hover');
  }

  var fixedSVG = document.querySelector('svg[data-conflictid].fixed') || conflictSVG;

  if (fixedSVG !== conflictSVG) {
    fixedSVG.classList.add('fixed--previous');
    var fixedCircles = document.querySelectorAll('.pc-part[data-conflictid] .pc-part__conflict-circle--fixed');

    if (fixedCircles) {
      fixedCircles.forEach(function (circle) {
        return circle.classList.add('pc-part__conflict-circle--fixed--previous');
      });
    }
  }
}

function disableHoveredCircles() {
  var hoveredCircles = document.querySelectorAll('.pc-part[data-conflictid] .pc-part__conflict-circle--hover');
  hoveredCircles.forEach(function (circle) {
    circle.classList.remove('pc-part__conflict-circle--hover');
  });
}

function hoverCircles(conflictID) {
  var circles = document.querySelectorAll(".pc-part[data-conflictid=\"".concat(conflictID, "\"] .pc-part__conflict-circle"));
  circles.forEach(function (circle) {
    circle.classList.add('pc-part__conflict-circle--hover');
  });
}

function disableFixedCircles() {
  var fixedCircles = document.querySelectorAll('.pc-part[data-conflictid] .pc-part__conflict-circle--fixed');
  fixedCircles.forEach(function (circle) {
    return circle.classList.remove('pc-part__conflict-circle--fixed', 'pc-part__conflict-circle--fixed--previous');
  });
}

function fixCircles(conflictID) {
  var circles = document.querySelectorAll(".pc-part[data-conflictid=\"".concat(conflictID, "\"] .pc-part__conflict-circle"));
  circles.forEach(function (circle) {
    return circle.classList.add('pc-part__conflict-circle--fixed');
  });
}

function toggleCircles(conflictID) {
  var circles = document.querySelectorAll(".pc-part[data-conflictid=\"".concat(conflictID, "\"] .pc-part__conflict-circle"));
  circles.forEach(function (circle) {
    return circle.classList.toggle('pc-part__conflict-circle--fixed');
  });
}

function setConflictsLines(id) {
  for (var _len = arguments.length, conflicts = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    conflicts[_key - 1] = arguments[_key];
  }

  var top1 = conflicts[0].offsetTop;
  var topN = conflicts[conflicts.length - 1].offsetTop;
  var len = topN - top1;
  var lineHeight = 8;
  var topAbs = top1 + lineHeight;

  var createConflictDash = function createConflictDash(conflict) {
    return "\n\t\t<polyline \n\t\t\tpoints=\"\n\t\t\t\t1,".concat(conflict.offsetTop - top1 + 5, ".5\n\t\t\t\t6,").concat(conflict.offsetTop - top1 + 5, ".5\n\t\t\t\"\n\t\t\tstroke=\"#e0a006\"\n\t\t/>\n\t\t<polyline \n\t\t\tpoints=\"\n\t\t\t\t7.5,").concat(conflict.offsetTop - top1, "\n\t\t\t\t7.5,").concat(conflict.offsetTop - top1 + 11, "\n\t\t\t\"\n\t\t\tstroke=\"#e0a006\"\n\t\t/>\n\t");
  };

  var linesToPart = conflicts.map(createConflictDash).join('');
  var line = "\n\t\t<svg data-conflictid=\"".concat(id, "\"\n\t\t\tstyle=\"position: absolute;top:").concat(topAbs - 6, "px;left:50px;\" \n\t\t\twidth=\"8\" height=\"").concat(len + 12, "\" viewBox=\"0 0 8 ").concat(len + 12, "\"\n\t\t\txmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n\t\t>\n\t\t\t<polyline \n\t\t\t\tpoints=\"\n\t\t\t\t\t1.5,6\n\t\t\t\t\t1.5,").concat(len + 6, "\n\t\t\t\t\"\n\t\t\t\tfill=\"transparent\" stroke=\"#e0a006\" stroke-dasharray=\"4px\"\n\t\t\t/>\n\t\t\t").concat(linesToPart, "\n\t\t</svg>\n\t");
  document.querySelector('.sidebar__pc-parts').insertAdjacentHTML('beforeend', line);
}

var dataIcons = document.querySelectorAll('[data-icon]');
dataIcons.forEach(function (item) {
  var iconName = item.dataset.icon;

  if (item.classList.contains('pc-parts__choose-item')) {
    item.insertAdjacentHTML('afterbegin', "<span class=\"svg-icon icon-".concat(iconName, "\"></span>"));
  } else {
    var title = item.querySelector('.pc-part__title');
    title.insertAdjacentHTML('afterbegin', "<span class=\"svg-icon icon-".concat(iconName, "\"></span>"));
  }
});
var pcPartsDescriptions = document.querySelectorAll('.pc-part__description');

if (pcPartsDescriptions) {
  pcPartsDescriptions.forEach(function (description) {
    var title = description.querySelector('.pc-part__title');
    var titleP = title.querySelector('p');
    var details = description.querySelector('.pc-part__details');

    if (titleP.offsetWidth === 215) {
      title.classList.add('pc-part__title--gradient');
    }

    if (details.offsetWidth === 215) {
      details.classList.add('pc-part__details--gradient');
    }
  });
}