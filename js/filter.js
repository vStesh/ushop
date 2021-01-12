class Filters {

	price = [];
	brand = [];
	available = false;
	default = true;
	data = [];

	constructor(data) {
		this.data = data;
		this.reset();
	}


	update(form) {
		//console.log(form);
		this.reset();
		for(let key in form) {
			if(key.substr(0, 6) === 'brand-') {
				if(form[key].checked) {
					this.brand.push(key.substr(6));
				}
				//alert('Найден бренд');
			}
			if(key === 'available') {
				if(form[key].value === 'all') {
					this.available = false;
				} else {
					this.available = true;
				}
			}
			if(key === 'max-price') {
				this.price[1] = form[key].value * 1;
			}
			if(key === 'min-price') {
				this.price[0] = form[key].value * 1;
			}
		}
		catalog.getSorting();
	}	

	reset() {
		this.price = [this.getMinPrice(), this.getMaxPrice()];
		this.brand = [];
		this.available = false;
		this.default = true;
	}
	getMaxPrice() {
		let result = 0;
		this.data.forEach((item, key, arr) => {
			if(item.price > result) {
				result = item.price;
			}
		});
		return result;
	}
	getMinPrice() {
		let result = 0;
		this.data.forEach((item, key, arr) => {
			if(result === 0) {
				result = item.price;
			}
			if(item.price < result) {
				result = item.price;
			}
		});
		return result;
	}
}