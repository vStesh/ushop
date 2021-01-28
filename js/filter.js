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
		
		for(let i = 0; i < form.length; i++) {
			if(form[i].name.substr(0, 6) === 'brand-') {
				//console.log(i);
				if(form[i].checked) {
					//console.log(form[i].name);
					this.brand.push(form[i].name.substr(6));
				}
			}

			if(form[i].name === 'available') {
				if(form[i].value === 'all' && form[i].checked) {
					this.available = false;
				} 
				if(form[i].value === 'aval' && form[i].checked) {
					this.available = true;
				}
			}
			if(form[i].name === 'max-price') {
				this.price[1] = form[i].value * 1;
			}
			if(form[i].name === 'min-price') {
				this.price[0] = form[i].value * 1;
			}
			//console.log(key);
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