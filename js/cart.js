class Cart {
	list = {};// Список товара
	count = 0;// Количество товара
	total = 0;// Сумма товара
	hash = 'fsdjfkjflksjdflkj65644kj45jl456j4l564jl';
	

	// Выводит содержимое корзины 
	render() {
		let cartList = document.getElementById('shopping-cart-list');
		let render = '';
		render += '<div class="shopping-cart-list__header space-between">';
		render += '<div class="shopping-cart-list__title">Корзина</div>';
		
		if(document.getElementById('shopping-cart-list').classList.contains('shopping-cart-list_visible')) {
			render += '<div class="shopping-cart-list__close" onclick="eShowCart()">Спрятать >></div></div>';
		} else {
			render += '<div class="shopping-cart-list__close" onclick="eShowCart()"><< Закрепить</div></div>';
		}
		
		
		render += '<div class="shopping-cart-list__body">';
		if(this.count > 0) {
			for(let key in this.list) {
				render += '<div class="shopping-cart-list__item row-min">';
				render += '<div class="shopping-cart-list__item_name">' + this.list[key].name + '</div>';
				render += '<div class="shopping-cart-list__item_quantity">' + this.list[key].quantity + ' шт';
				render += '<div class="shopping-cart-list__item_change"><div id="minus-' + key + '" class="shopping-cart-list__change-quantity" title="Уменьшить количество">-</div><div id="plus-' + key + '" class="shopping-cart-list__change-quantity" title="Увеличить количество">+</div></div></div>';
				render += '<div class="shopping-cart-list__item_price">' + this.list[key].price + ' грн</div>';
				render += '<div class="shopping-cart-list__item_total">' + this.list[key].total + ' грн</div>';
				render += '<div class="shopping-cart-list__item_delete shopping-cart-list__change-quantity" id="remove-' + key + '" title="Удалить позицию из корзины">Х</div>';
				render += '</div>';
				
			}
		} else {
			render += '<div>Товара в корзине нет!<br/>Добавьте товар в корзину.</div>';
		}
		render += '</div><div class="shopping-cart-list__footer space-between">';
		if(this.count) {
			render += '<div class="shopping-cart-list__remove" onclick="cart.remove()" title="Удалить все товары из корзины">Очистить корзину</div>';
		}
		render += 'Итого на сумму ' + this.total + ' грн</div>';

		cartList.innerHTML = render;
		if(this.count) {
			document.getElementById('shopping-cart').classList.add('color-green');
			document.getElementById('shopping-cart-count').innerHTML = this.count;
		}
		let all_items = document.getElementsByClassName('shopping-cart-list__change-quantity');
		for(let i = 0; i < all_items.length; i++) {
			if(all_items[i].id.substr(0, 5) === 'minus') {
				all_items[i].addEventListener('click', () => {this.itemMinus(all_items[i].id.substr(6))});
			}
			if(all_items[i].id.substr(0, 4) === 'plus') {
				all_items[i].addEventListener('click', () => {this.itemPlus(all_items[i].id.substr(5))});
			}
			if(all_items[i].id.substr(0, 6) === 'remove') {
				all_items[i].addEventListener('click', () => {this.itemRemove(all_items[i].id.substr(7))});
			}
		}
	}

	// Добавляет товар в корзину
	add(id) {
		console.log(this);
		this.count++;
		console.log(this);
		if(id in this.list) {
			this.list[id].quantity++;
			this.total += this.list[id].price;
			this.list[id].total += this.list[id].price;
		} else {
			this.list[id] = getProduct(id);
			this.total += this.list[id].price;
		}
		this.toStorage();
		return this;
	}

	// Удаляет все содержимое корзины
	remove(flag = false) {
		if(flag || confirm('Очистить корзину полностью?')) {
			this.list = {};
			this.count = 0;
			this.total = 0

			this.toStorage();
			document.getElementById('shopping-cart').classList.remove('color-green');
			document.getElementById('shopping-cart-count').innerHTML = '';
			this.render();
			document.getElementById('shopping-cart-list').classList.remove('shopping-cart-list_visible');
			showMessage('warning', 'exclamation', 'Корзина очищена');
		}
	}

	// Удаляет позицию из корзины
	itemRemove(id) {
		if(confirm('Удалить позицию из корзины?')) {
			//let id = div.id;
			this.total -= this.list[id].total;
			this.count -= this.list[id].quantity;
			delete this.list[id];
			this.toStorage();
			this.render();
		}
		if(this.total == 0) {
			this.remove(true);
		}
	}

	// Уменьшает на единицу позицию товара в корзине
	itemPlus(id) {
		//console.log(id);
		if(getProductAvailable(id)) {
			this.list[id].quantity++;
			this.list[id].total += this.list[id].price;
			this.count++;
			this.total += this.list[id].price;
		} else {
			showMessage('error', 'ban', 'Товара больше нет в наличии');
		}
		this.toStorage();
		this.render();

	}

	// Увеличивает на единицу позицию товара в корзине
	itemMinus(id) {
		//console.log(id);
		if(this.list[id].quantity == 1) {
			this.itemRemove(id);
			return;
		}
		this.list[id].quantity--;
		this.list[id].total -= this.list[id].price;
		this.total -= this.list[id].price;
		this.count--;
		this.toStorage();
		this.render();
	}

	// Добавляет содержимое корзины в LocalStorage
	toStorage() {
		localStorage.setItem('cart', JSON.stringify(this));
	}

	// Заполнеят корзину содержимым из LocalStorage
	fromStorage() {
		if(localStorage.cart && JSON.parse(localStorage.cart).hash == this.hash) {
			//alert('!!');
			this.list = JSON.parse(localStorage.cart).list;
			this.count = JSON.parse(localStorage.cart).count
			this.total = JSON.parse(localStorage.cart).total
		}
		return this;
	}
}
