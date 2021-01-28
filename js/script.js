let main = document.getElementById('main');

let catalog = new Catalog(data);
let siteUrl = 'home';
let cart = new Cart;
console.log(cart);
let notify = [];
let wishlist = [];

let slider = {};
let events = [];

document.getElementById('menu-catalog').addEventListener('click', () => {eShowCatalog()});
document.getElementById('menu-buy').addEventListener('click', () => {eShowHowBuy()});
document.getElementById('menu-about').addEventListener('click', () => {eShowAbout()});
document.getElementById('menu-contacts').addEventListener('click', () => {eShowContacts()});

eShowHomePage();
getFromStorage();
console.log(cart);
/*
* Обработка событий Функции eFunctionName
* Начало
*/

// Показ Главной страницы
function eShowHomePage() {
	this.siteUrl = 'home';
	main.innerHTML = 'Главная страница сайта<br/><br/><br/>Вы можете выбрать и купить любой товар в каталоге.<br/>Магазин работает в тестовом режиме, поэтому воспользуйтесь меню Каталог, чтобы проверить работоспособность магазина.<br/><br/><br/>Информация на страницах Главная, Как купить, О нас, Контакты указана в ознакомительных целях. Не обращайте внимания на данную информацию.<br/><br/>Спасибо :)';
}

// Показ Каталога товара
function eShowCatalog() {
	this.siteUrl = 'catalog';
	events = [];
	let render = getBreadcrumb([{title: 'Каталог товара', event: false}]);
	render += '<div class="row">';
	render += getSidebar();
	render += getContent();
	render += '</div>';
	main.innerHTML = render;
	addEvent();
	addFilterEvents();
}

// Показ страницы Как купить
function eShowHowBuy() {
	this.siteUrl = 'home';
	let render = getBreadcrumb([{title: 'Как купить', event: false}]);
	render += 'Как купить<br/><br/><br/>Вы можете выбрать и купить любой товар в каталоге.<br/>Магазин работает в тестовом режиме, поэтому воспользуйтесь меню Каталог, чтобы проверить работоспособность магазина.<br/><br/><br/>Информация на страницах Главная, Как купить, О нас, Контакты указана в ознакомительных целях. Не обращайте внимания на данную информацию.<br/><br/>Спасибо :)';
	main.innerHTML = render;
}

// Показ страницы О магазине
function eShowAbout() {
	this.siteUrl = 'home';
	let render = getBreadcrumb([{title: 'О магазине', event: false}]);
	render += 'О нас<br/><br/><br/>Вы можете выбрать и купить любой товар в каталоге.<br/>Магазин работает в тестовом режиме, поэтому воспользуйтесь меню Каталог, чтобы проверить работоспособность магазина.<br/><br/><br/>Информация на страницах Главная, Как купить, О нас, Контакты указана в ознакомительных целях. Не обращайте внимания на данную информацию.<br/><br/>Спасибо :)';
	main.innerHTML = render;
}

// Показ страницы Контактная информация
function eShowContacts() {
	this.siteUrl = 'home';
	let render = getBreadcrumb([{title: 'Контактная информация', event: false}]);
	render += 'Контакты<br/><br/><br/>Вы можете выбрать и купить любой товар в каталоге.<br/>Магазин работает в тестовом режиме, поэтому воспользуйтесь меню Каталог, чтобы проверить работоспособность магазина.<br/><br/><br/>Информация на страницах Главная, Как купить, О нас, Контакты указана в ознакомительных целях. Не обращайте внимания на данную информацию.<br/><br/>Спасибо :)';
	main.innerHTML = render;
}

// Событие показа корзины при наведении на значок корзины
function eShowCart() {
	document.getElementById('shopping-cart-list').classList.toggle('shopping-cart-list_visible');
	cart.render();
	//renderCart();
}

// Нажатие на кнопку Вид черепица
function eViewTile() {
	catalog.view = 'tile';
	catalog.paginate.current = 1;
	catalog.getPaginate();
	eShowCatalog(catalog);
}

// Нажатие на кнопку Вид строка
function eViewLine() {
	catalog.view = 'line';
	catalog.paginate.current = 1;
	catalog.getPaginate();
	eShowCatalog(catalog);
}

// Сладер фото Влево
function eSliderTurnLeft(id) {
	slider[id][0] += slider[id][1] - 1;
	refreshSlider(id);
}

// Слайдер фото Вправо
function eSliderTurnRight(id) {
	slider[id][0]++;
	refreshSlider(id);
}

// Обработка события нажатия на кнопки с номером страницы в строке Пагинации
function eShowPage(num) {
	catalog.paginate.current = num;
	catalog.getPaginateHtml();
	eShowCatalog(catalog);
}

// Нажатие на кнопку Добавить в карточке товара
function eAddToCart(div) {
	let id = div.id;
	if(getProductAvailable(id)) {
		cart.add(id).render();
		showMessage('success', 'cart-arrow-down', 'Товар добавлен в корзину');
	} else {
		showMessage('error', 'ban', 'Товара больше нет в наличии');
	}
}

// Нажатие на кнопку Понравился в карточке товара
function eAddToWishlist(id) {

	showMessage('likes', 'heart', 'Пополнен список желаний');
}

// Нажатие на кнопку Сообщить о наличии в карточке товара
function eAddToNotify(id) {

	showMessage('warning', 'envelope', 'Сообщим, когда товар появится');
}

// Обработка нажатия на кнопку Показать в фильтрах 
function eApplyFilters(del = false) {
	catalog.filters.update(document.getElementById('filter-form').elements);
	if(document.querySelector('.show_menu')) {
		eHideMenu();
	}
	if(del) {
		catalog.filters.reset();
	}
	catalog.applyFilters();
	catalog.render();

}

function eShowMenu() {
	let div = document.createElement('div');
	div.className = 'show_menu';
	div.id = 'show-menu';
	let render = '<div class="nav-button" onclick="eHideMenu()"><i class="fas fa-times"></i></div>';
	render += '<div class="nav__show_menu"><ul><li id="menu-catalog-show">Каталог</li><li id="menu-buy-show">Как купить</li><li id="menu-about-show">О нас</li><li id="menu-contacts-show">Контакты</li></ul></div>';
	render += '<div id="sidebar-show"></div>';
	div.innerHTML = render;

	document.body.prepend(div);
	if(this.siteUrl === 'catalog') {
	document.querySelector('#sidebar-show').innerHTML = document.querySelector('#sidebar').innerHTML;
	document.querySelector('#sidebar').innerHTML = '';	
	addFilterEvents();
	}
	

	document.getElementById('menu-catalog-show').addEventListener('click', () => {eHideMenu(); eShowCatalog()});
	document.getElementById('menu-buy-show').addEventListener('click', () => {eHideMenu(); eShowHowBuy()});
	document.getElementById('menu-about-show').addEventListener('click', () => {eHideMenu(); eShowAbout()});
	document.getElementById('menu-contacts-show').addEventListener('click', () => {eHideMenu(); eShowContacts()});
	// div.classList.remove('message__top_create');
	// setTimeout(() => {div.classList.add('message__top_show')}, 10);
	// setTimeout(() => {div.classList.add('.message__top_z-out')}, 10);
	// setTimeout(() => {div.classList.add('message__top_hide')}, 2000);
	// setTimeout(() => {div.remove()}, 3000);
}
 function eHideMenu() {
	if(this.siteUrl === 'catalog') {
		
		document.querySelector('#sidebar').innerHTML = document.querySelector('#sidebar-show').innerHTML;
		document.querySelector('#sidebar-show').innerHTML = '';
		addFilterEvents();
	}
	 document.getElementById('show-menu').remove();
 }

function ePaginate(count) {
	settings.paginate = count;
	catalog.paginate.current = 1;
	catalog.getPaginate();
	eShowCatalog();
}

/*
* Конец
* Обработка событий Функции eFunctionName
*/


// Рендеринг Строки навигации
function getBreadcrumb(stack) {
	let render = '<div class="breadcrumb" id="breadcrumb"><ul><li class="breadcrumb__link" onclick="eShowHomePage()" title="Перейти на главную"><i class="fas fa-home"></i></li>';
	stack.forEach((item, key, array) => {
		render += '<li onclick="' + item.event + '">' + item.title + '</li>';
	});
	render += '</ul></div>';
	return render;
}

// Рендеринг Сайдбара - фильтров
function getSidebar() {
	let render = '';
	render = '<div class="sidebar" id="sidebar"><h3>Фильтра</h3><div class="filters" id="filters"><form id="filter-form">';
	render += '<div class="filter__button_show display-none" type="submit" onclick="eApplyFilters()" id="filter__button_show">Показать</div>';
	render += '<div class="filter__item" id="filter-price"><div class="filter__item_header">Цена:</div>';
	render += '<div class="row-min space-between"><div class="filter__item_input">От</div><div class="filter__item_input">До</div></div>'
	render += '<div class="row-min"><input type="text" class="filter__item_input" name="min-price" value="' + catalog.getFilters('price-min') + '"><input type="text" class="filter__item_input" name="max-price" value="' + catalog.getFilters('price-max') + '"></div></div>'
	
	render += '<div class="filter__item" id="filter-available"><div class="filter__item_header">Наличие:</div>';
	render += '<div class="row-min space-between filter__line"><label for="av-all">Все товары</label><input type="radio" name="available" ' + (catalog.getFilters('available') ? '' : ' checked ') + 'value="all"></div><div class="row-min space-between filter__line"><label for="av-all"  >Только в наличии</label><input type="radio" name="available" ' + (catalog.getFilters('available') ? ' checked ' : '') + ' value="aval"></div></div>'
	
	render += '<div class="filter__item" id="filter-brand"><div class="filter__item_header">Бренды:</div>';
	catalog.brands.forEach((item, key, array) => {
		render += '<div class="row-min space-between filter__line"><label for="av-all">' + item + '</label><input type="checkbox" id="' + item + '" name="brand-' + item + '" ' + (catalog.filters.brand.includes(item) ? ' checked ' : '') + '></div>'
	});
	render += '</div></form>';
	if(!catalog.filters.default) {
		render += '<button class="filter__button_clear" onclick="eApplyFilters(1)">Сбросить фильтра</button>';
	}
	render += '</div></div>';
	return render;
}

function getContent() {
	let render = '<div class="content">';
	render += renderContentHeader();
	render += renderRowSettings();
	render += renderProductList();
	catalog.paginate.current = 1;
	//if(catalog.paginate.count > 1) {
		render += catalog.paginate.html;
	//}
	
	render += '</div>';
	return render;
}//

// Рендеринг заголовка каталога
function renderContentHeader() {
	let render = '<div class="content__header"><h2>Каталог товара</h2></div>';

	return render;
}

// Рендеринг строки с настройками вида Каталога
function renderRowSettings() {
	let render = '';
	render += '<div class="content__settings">';
	render += '<div class="content__settings_count content__settings_item">Найдено ' + catalog.count + ' товаров</div>';

	render += '<div class="content__settings_output content__settings_item align-center">Вид:<ul><li class="' + (catalog.view != 'line' ? 'active' : '') + '" onclick="eViewLine()"><i class="fas fa-bars"></i></li><li class="' + (catalog.view != 'tile' ? 'active' : '') + '" onclick="eViewTile()"><i class="fas fa-th"></i></li></ul></div>';
	render += '<div class="content__settings_sorting content__settings_item align-center">Сортировка:';
	render += '<ul><li class="' + (catalog.sorting != 'expensive' ? 'active' : '') + '" onclick="catalog.sortingExpensive()">Дорогие</li><li class="' + (catalog.sorting != 'cheap' ? 'active' : '') + '" onclick="catalog.sortingCheap()">Дешевые</li><li class="' + (catalog.sorting != 'abc' ? 'active' : '') + '" onclick="catalog.sortingAbc()">По алфавиту</li></ul></div>';
	render += '</div>';
	return render;
}

// Рендеринг списка товара в зависимости от вида просмотра
function renderProductList() {
	let render = '<div class="product-list">';
	if(catalog.paginate) {
		for(let i = (catalog.paginate.current - 1) * catalog.paginate.quantity; (i < catalog.paginate.current * catalog.paginate.quantity) && i < catalog.count; i++) {
			render += getProductItemRender(catalog.data[i]);
		}
	} else {
		catalog.data.forEach((item, key, array) => {
			render += getProductItemRender(item);
		});
	}
	render += '</div>';
	return render;
}

function getProductItemRender(item) {
	if(catalog.view == 'line') {
		return getProductItemRender_line(item);
	}
	return getProductItemRender_tile(item);
}
function getProductItemRender_tile(item) {
	let render = '';
	render += '<div class="product-list__block"><div class="product-list__item"><div class="card">';
	if(settings.images.slider && (item.images.length > 1)) {
		render += '<div class="card__img">';
		render += getSliderImages(item);
		events.push({id: 'left-' + item.id, number: -1});
		events.push({id: 'right-' + item.id, number: +1});
		render += '</div>';
	} else {
		render += '<div class="card__img"><img src="assets/images/'+ item.images[0] +'" alt=""></div>';
	}
	render += '<div class="card__brand">' + item.brand + '</div>';
	render += '<div class="card__price">' + getAvailable(item) + new Intl.NumberFormat('ru-RU').format(item.price) + '</div>';
	render += '<div class="card__title">' + item.name + '</div>';
	render += '<div class="card__footer"><div class="card__footer-button card__footer-like" onclick="eAddToWishlist(' + item.id + ')"><i class="fas fa-heart"></i><span>Нравится</span></div>';
	if(item.quantity > 0) {
		render += '<div class="card__footer-button card__footer-buy" onclick="eAddToCart(' + item.id + ')"><i class="fas fa-cart-plus"></i><span>В корзину</span></div></div></div>';
	} else {
		render += '<div class="card__footer-button card__footer-notify" onclick="eAddToNotify(' + item.id + ')"><i class="fas fa-envelope"></i><span>Уведомить</span></div></div></div>';
	}
	
	render += '<div class="card__description">' + item.announcement + '</div>';
	render += '</div></div>';
	return render;
}
function getProductItemRender_line(item) {
	let render = '';
	render += '<div class="product-list__block_line"><div class="product-list__item_line"><div class="card_line" id="' + item.id + '">';
	render += '<div class="card__img_line"><img src="assets/images/'+ item.images[0] +'" alt=""></div>';
	render += '<div class="card__body_line">';
	render += '<div class="card__title_line">' + item.name + '</div>';
	render += '<div class="card__brand_line">' + getAvailable(item) + item.brand + '</div></div>';

	
	render += '<div class="card__footer_line">';
	render += '<div class="card__price_line">'  + new Intl.NumberFormat('ru-RU').format(item.price) + '</div>';
	render += '<div class="card__footer-button card__footer-button_line card__footer-like" onclick="eAddToWishlist(' + item.id + ')"><i class="fas fa-heart"></i><span>Нравится</span></div>';
	if(item.quantity > 0) {
		render += '<div class="card__footer-button card__footer-button_line card__footer-buy" onclick="eAddToCart(' + item.id + ')"><i class="fas fa-cart-plus"></i><span>В корзину</span></div></div></div>';
	} else {
		render += '<div class="card__footer-button card__footer-button_line card__footer-notify" onclick="eAddToNotify(' + item.id + ')"><i class="fas fa-envelope"></i><span>Уведомить</span></div></div></div>';
	}
	
	//render += '<div class="card__description">' + item.announcement + '</div>';
	render += '</div></div>';
	return render;
}

function getSliderImages(item) {
	let render = '<div class="slider-img" id="' + item.id + '">';
	render += '<div class="turn turn-left" id="left-' + item.id + '"><span><</span></div>';
	let count = 0;
	item.images.forEach((item, key, array) => {
		render += '<div class="slider-img__item ' + (!key ? 'active' : '') + '" style="background-image: url(assets/images/' + item + ')"></div>';
		count++;
	});
	slider[item.id] = [0, count];
	render += '<div class="turn turn-right" id="right-' + item.id + '"><span>></span></div>';
	render += '</div>';
	return render;
}



function addEvent() {
	events.forEach((item, key, array) => {
		if(item.number > 0) {
			document.getElementById(item.id).addEventListener('click', () => {eSliderTurnRight(item.id.substr(6, item.id.length))});
		} else {
			document.getElementById(item.id).addEventListener('click', () => {eSliderTurnLeft(item.id.substr(5, item.id.length))});
		}
		
	});
}
function addFilterEvents() {
	// let filters = document.getElementById('filters');
	document.getElementById('filters').querySelectorAll('input').forEach((item, key, arr) => {
		item.addEventListener('change', () => {
			document.getElementById('filter__button_show').classList.remove('display-none');
			document.getElementById('filter__button_show').classList.add('display-block');
		});
	});
}
function refreshSlider(id) {
	let slide = document.getElementById(id).getElementsByClassName('slider-img__item');
	console.log(slide);
	for(let i = 0; i < slider[id][1]; i++) {
		if((slider[id][0] % slider[id][1]) === i) {
			slide[i].className = 'slider-img__item active';
		} else {
			slide[i].className = 'slider-img__item';
		}
	}
}

function getAvailable(item) {
	let render = '';
	if(item.quantity > 0) {
		return '<div class="card__available card__available_true">в наличии</div>';
	}
	return '<div class="card__available card__available_false">нет в наличии</div>';
}




// Заполняет из Local Storage содержимое корзины, списка желаний и уведомлений
function getFromStorage() {
	cart.fromStorage().render();
}


// Принимает id товара и возвращает объект типа {Название, цена, количество, сумма}
function getProduct(id) {
	let key = getProductIndex(id);
	if(key > -1) {
		let obj = {
			name: data[key].name,
			price: data[key].price,
			quantity: 1,
			total: data[key].price,
		}
		return obj;
	} 
	return false;
}

// Возращает индекс товара в массиве данных
function getProductIndex(id) {
	//console.log(id);
	for(let i = 0; i < data.length; i++) {
		if(data[i].id == id) {
			return i;
		}
	}
	return -1;
}


function showMessage(cl, type, text) {
	let div = document.createElement('div');
	div.className = 'message__top message__top_create message__' + cl;
	div.innerHTML = '<i class="fas fa-' + type + ' float-left"></i>' + text;
	document.body.prepend(div);
	div.classList.remove('message__top_create');
	setTimeout(() => {div.classList.add('message__top_show')}, 10);
	setTimeout(() => {div.classList.add('.message__top_z-out')}, 10);
	setTimeout(() => {div.classList.add('message__top_hide')}, 2000);
	setTimeout(() => {div.remove()}, 3000);
	
}

// Проверяет доступность товара для размещения в корзину при ограниченном количестве наличия товара
function getProductAvailable(id) {
	let key = getProductIndex(id);
	if(key > -1) {
		if((id in cart.list) && (data[key].quantity - cart.list[id].quantity) < 1) {
			return 0;
		}
		return 1;
	}
	return 0;
}