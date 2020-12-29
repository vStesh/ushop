let product_list = document.getElementById('product-list');
let main = document.getElementById('main');
let cart = {
	list: {},
	count: 0,
	total: 0,
};
let slider = {};
let events = [];

let notify = [];
let wishlist = [];

document.getElementById('menu-catalog').addEventListener('click', () => {showCatalog(getCatalog(data))});
document.getElementById('menu-buy').addEventListener('click', () => {showHowBuy()});
document.getElementById('menu-about').addEventListener('click', () => {showAbout()});
document.getElementById('menu-contacts').addEventListener('click', () => {showContacts()});

showHomePage();
getFromStorage();

function showHomePage() {
	main.innerHTML = 'Главная страница сайта';
}

function showCatalog(cat) {
	events = [];
	let render = getBreadcrumb([{title: 'Каталог товара', event: false}]);
	render += '<div class="row">';
	render += getSidebar();
	render += getContent(cat);
	render += '</div>';
	main.innerHTML = render;
	addEvent();
}

function showHowBuy() {
	let render = getBreadcrumb([{title: 'Как купить', event: false}]);
	render += 'Как купить';
	main.innerHTML = render;
}

function showAbout() {
	let render = getBreadcrumb([{title: 'О магазине', event: false}]);
	render += 'О нас';
	main.innerHTML = render;
}

function showContacts() {
	let render = getBreadcrumb([{title: 'Контактная информация', event: false}]);
	render += 'Контакты';
	main.innerHTML = render;
}

function showCart() {
	if(document.getElementById('shopping-cart-list').classList.contains('shopping-cart-list_visible')) {
		document.getElementById('shopping-cart-list').classList.remove('shopping-cart-list_visible');
		document.getElementById('shopping-cart-list').classList.remove('shopping-cart-list_scale');
	} else {
		document.getElementById('shopping-cart-list').classList.add('shopping-cart-list_visible');
	}
	renderCart();
}

function scaleCart() {
	if(document.getElementById('shopping-cart-list').classList.contains('shopping-cart-list_scale')) {
		document.getElementById('shopping-cart-list').classList.remove('shopping-cart-list_scale');
		document.getElementById('shopping-cart-list').addEventListener('click', () => {scaleCart()});
	} else {
		document.getElementById('shopping-cart-list').classList.add('shopping-cart-list_scale');
	}
}

function getBreadcrumb(stack) {
	let render = '<div class="breadcrumb" id="breadcrumb"><ul><li class="breadcrumb__link" onclick="showHomePage()" title="Перейти на главную"><i class="fas fa-home"></i></li>';
	stack.forEach((item, key, array) => {
		render += '<li onclick="' + item.event + '">' + item.title + '</li>';
	});
	


	render += '</ul></div>';
	return render;
}

function getSidebar() {
	let render = '';
	render = '<div class="sidebar"><h3>Фильтра</h3><div class="filters">Тут будут фильтры</div></div>';
	return render;
}

function getContent(cat) {
	let render = '<div class="content">';
	render += getContentHeader();
	render += getRowSettings(cat);
	render += getProductList(cat);
	render += cat.paginate.html;
	render += '</div>';
	return render;
}

function getContentHeader() {
	let render = '<div class="content__header"><h2>Компьютерная техника</h2></div>';

	return render;
}

function getRowSettings(cat) {
	let render = '';
	render += '<div class="content__settings align-center space-between">';
	render += '<div class="content__settings_count">Найдено ' + cat.count + ' товаров</div>';

	render += '<div class="content__settings_output align-center">Вид:<ul><li><i class="fas fa-bars"></i></li><li><i class="fas fa-th"></i></li></ul></div>';
	render += '<div class="content__settings_sorting align-center">Сортировка:';
	render += '<ul><li>Дорогие</li><li>Дешевые</li><li>По алфавиту</li></ul></div>';
	render += '</div>';
	return render;
}

function getProductList(cat) {
	let render = '<div class="product-list">';
	if(cat.paginate) {
		for(let i = (cat.paginate.current - 1) * cat.paginate.quantity; (i < cat.paginate.current * cat.paginate.quantity) && i < cat.count; i++) {
			render += addProductItem(cat.data[i]);
		}
	} else {
		cat.data.forEach((item, key, array) => {
			render += addProductItem(item);
		});
	}
	render += '</div>';
	return render;
}

function addProductItem(item) {
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
	render += '<div class="card__footer"><div class="card__footer-button card__footer-like" onclick="addToWishlist(' + item.id + ')"><i class="fas fa-heart"></i><span>Нравится</span></div>';
	if(item.quantity > 0) {
		render += '<div class="card__footer-button card__footer-buy" onclick="addToCart(' + item.id + ')"><i class="fas fa-cart-plus"></i><span>В корзину</span></div></div></div>';
	} else {
		render += '<div class="card__footer-button card__footer-notify" onclick="addToNotify(' + item.id + ')"><i class="fas fa-envelope"></i><span>Уведомить</span></div></div></div>';
	}
	
	render += '<div class="card__description">' + item.announcement + '</div>';
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

function sliderTurnLeft(id) {
	slider[id][0] += slider[id][1] - 1;
	refreshSlider(id);
}
function sliderTurnRight(id) {
	slider[id][0]++;
	refreshSlider(id);

}

function addEvent() {
	events.forEach((item, key, array) => {
		if(item.number > 0) {
			document.getElementById(item.id).addEventListener('click', () => {sliderTurnRight(item.id.substr(6, item.id.length))});
		} else {
			document.getElementById(item.id).addEventListener('click', () => {sliderTurnLeft(item.id.substr(5, item.id.length))});
		}
		
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

function getCatalog(arr) {
	catalog.data = arr;

	catalog.count = catalog.data.length;
	if(catalog.count > settings.paginate) {
		catalog.paginate = getPaginate();
	} else {
		catalog.paginate = false;
	}
	return catalog;
}

function getPaginate() {
	let obj = {};
	//console.log(Math.ceil(catalog.count/ settings.paginate));
	obj.count = Math.ceil(catalog.count / settings.paginate);
	obj.html = getPaginateHtml(obj.count);
	obj.current = 1;
	obj.quantity = settings.paginate;

	return obj;
}

function getPaginateHtml(count, current = 1) {
	let render = '<div class="paginate align-center "><ul>';
	if(current != 1) {
		render += '<li onclick="showPage(' + (current - 1) + ')"><<</li>';
	}
	for(let i = 1; i < (count + 1); i++) {
		
		render += '<li class="' + (i == current ? 'paginate_active' : '') +'" onclick="showPage(' + i + ')">' + i + '</li>';
	}
	if(current != count) {
		render += '<li onclick="showPage(' + (current + 1) + ')">>></li>';
	}
	render += '</ul></div>';
	return render;
}

function showPage(num) {
	catalog.paginate.current = num;
	catalog.paginate.html = getPaginateHtml(catalog.paginate.count, num);
	showCatalog(catalog);
}

function addToCart(div) {
	let id = div.id;
	cart.count++;
	if(id in cart.list) {
		cart.list[id].quantity++;
		cart.total += cart.list[id].price;
		cart.list[id].total += cart.list[id].price;
	} else {
		cart.list[id] = getProduct(id);
		cart.total += cart.list[id].price;
	}
	localStorage.setItem('cart', JSON.stringify(cart));
	renderCart();
	showMessage('success', 'cart-arrow-down', 'Товар добавлен в корзину');
	
}

function addToWishlist(id) {
	alert('Товар добавлен в список желаний');
}

function addToNotify(id) {
	alert('Сообщим как появится в наличии');
}

// Заполняет из Local Storage содержимое корзины, списка желаний и уведомлений
function getFromStorage() {
	cart = localStorage.cart ? JSON.parse(localStorage.cart) : cart;

	renderCart();

}

// Перезаполняет невидимую корзину или видимую при добавлении/удалении товара
function renderCart() {
	let cartList = document.getElementById('shopping-cart-list');
	let render = '';
	render += '<div class="shopping-cart-list__header space-between">';
	render += '<div class="shopping-cart-list__title">Корзина</div>';
	render += '<div class="shopping-cart-list__min" title="Минимизировать" onclick="scaleCart()">>*<</div>';
	if(document.getElementById('shopping-cart-list').classList.contains('shopping-cart-list_visible')) {
		render += '<div class="shopping-cart-list__close" onclick="showCart()">Спрятать >></div></div>';
	} else {
		render += '<div class="shopping-cart-list__close" onclick="showCart()"><< Закрепить</div></div>';
	}
	
	
	render += '<div class="shopping-cart-list__body">';
	if(cart.count > 0) {
		for(key in cart.list) {
			render += '<div class="shopping-cart-list__item row">';
			render += '<div class="shopping-cart-list__item_name">' + cart.list[key].name + '</div>';
			render += '<div class="shopping-cart-list__item_quantity">' + cart.list[key].quantity + ' шт</div>';
			render += '<div class="shopping-cart-list__item_price">' + cart.list[key].price + ' грн</div>';
			render += '<div class="shopping-cart-list__item_total">' + cart.list[key].total + ' грн</div>';
			render += '</div>';
		}
	} else {
		render += '<div>Товара в корзине нет!<br/>Добавьте товар в корзину.</div>';
	}
	render += '</div><div class="shopping-cart-list__footer space-between">';
	if(cart.count) {
		render += '<div class="shopping-cart-list__remove" onclick="removeCart()" title="Удалить все товары из корзины">Очистить корзину</div>';
	}
	render += 'Итого на сумму ' + cart.total + ' грн</div>';

	cartList.innerHTML = render;
	if(cart.count) {
		document.getElementById('shopping-cart').classList.add('color-green');
		document.getElementById('shopping-cart-count').innerHTML = cart.count;
	}
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
	console.log(id);
	for(let i = 0; i < data.length; i++) {
		if(data[i].id == id) {
			return i;
		}
	}
	return -1;
}

function removeCart() {
	cart = cart = {
		list: {},
		count: 0,
		total: 0,
	};
	localStorage.setItem('cart', JSON.stringify(cart));
	document.getElementById('shopping-cart').classList.remove('color-green');
	document.getElementById('shopping-cart-count').innerHTML = '';
	renderCart();
	document.getElementById('shopping-cart-list').classList.remove('shopping-cart-list_visible');
	alert('Корзина очищена');
}

function showMessage(cl, type, text) {
	let div = document.createElement('div');
	div.className = 'create-message show-message__' + cl;
	div.innerHTML = '<i class="fas fa-' + type + ' float-left"></i>' + text;
	document.body.prepend(div);
	div.classList.add('show-message');
}