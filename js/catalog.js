class Catalog {
	
	data = []; // Массив товара изначально пустой - меняется при фильтрации
	globalData = []; // Массив глобальных данных - не меняется при фильтрации
	count = 0; // Количество товара
	view=  'tile'; // Вид просмотра Черепица
	sorting = false; // Сортировка как есть
	paginate = {}; // Пустой объект Пагинации
	filters = {}; // Пустой объект фильтров и категорий
	brands = []; // Пустой массив брендов
	//settings = settings;

	constructor(data) {
		this.data = JSON.parse(JSON.stringify(data));;
		this.globalData = JSON.parse(JSON.stringify(data));
		this.count = data.length;
		if(this.count > settings.paginate) {
			this.getPaginate();
		} else {
			this.paginate = false;
		}
		this.getSorting();
		this.brands = this.getBrendsArray();
		this.filters = new Filters(this.data);
		this.filters.reset();
		

	}
		
	sortingExpensive() {
		this.sorting = 'expensive';
		this.getSorting().render();
		//this.render();
	}
	sortingCheap() {
		this.sorting = 'cheap';
		this.getSorting().render();
		//this.render();
	}
	sortingAbc() {
		this.sorting = 'abc';
		this.getSorting().render();
		//this.render();
	}
	/* getSorting()
	* @param none
	* return 
	*/
	getSorting() {
		switch(this.sorting) {
			case 'expensive':
				this.data.sort(function(a, b) {
					return b.price - a.price;
				});
				break;
			case 'cheap': 
				this.data.sort(function(a, b) {
					return a.price - b.price;
				});
				break;
			case 'abc':
				this.data.sort(function(a, b) {
					if(a.name > b.name) return 1;
					if(a.name < b.name) return -1;
					return 0;
				});
				break;
		}
		this.paginate.current = 1; //При сортировке выводим первую страницу.
		this.getPaginate();
		return this;
	}
	render() {
		//this.applyFilters();
		//this.paginate.current = 1; 
		this.getPaginate();
		eShowCatalog(this);
	}
	getPaginate() {
		this.count = this.data.length;
		this.paginate.count = Math.ceil(this.count / settings.paginate);
		this.paginate.html = this.getPaginateHtml();
		this.paginate.current = 1;
		this.paginate.quantity = settings.paginate;

		//return this.paginate;
	}
	getPaginateHtml() {
		let render = '<div class="paginate align-center ">';
		if(this.paginate.count !== 1){
			render += '<div><ul>';
			if(this.paginate.current != 1) {
				render += '<li onclick="eShowPage(' + (this.paginate.current - 1) + ')"><<</li>';
			}
			for(let i = 1; i < (this.paginate.count + 1); i++) {
				
				render += '<li class="' + (i == this.paginate.current ? 'paginate_active' : '') +'" onclick="eShowPage(' + i + ')">' + i + '</li>';
			}
			if(this.paginate.current != this.paginate.count) {
				render += '<li onclick="eShowPage(' + (this.paginate.current + 1) + ')">>></li>';
			}
			render += '</ul></div>';
			
		}
		render += '<div class="paginate__settings"><div class="paginate__settings_item">На странице: <div class="paginate__settings_item_count" onclick="ePaginate(3)">3 </div> <div class="paginate__settings_item_count" onclick="ePaginate(6)">6 </div><div class="paginate__settings_item_count" onclick="ePaginate(12)">12</div></div>';
		if(this.paginate.count !== 1){
			render += '<div class="paginate__settings_item" onclick="ePaginate(999)">Показать все товары</div>';
		}
		render += '</div></div>';
		this.paginate.html = render;
		return render;
	}
	getBrendsArray() {
		let arr = [];
		for(let i = 0; i < this.data.length; i++) {
			if(!arr.includes(this.data[i].brand)) {
				arr.push(this.data[i].brand);
			}
		}
		//console.log(arr);
		return arr;
	}

	getFilters(str) {
		switch(str) {
			case 'price-min': 
				return this.filters?.price[0];
				break;
			case 'price-max':
				return this.filters?.price[1];
				break;
			case 'available':
				return this.filters?.available;
				break;
			
		}
		return false;
	}
	
	applyFilters() {
		this.data = JSON.parse(JSON.stringify(this.globalData));
		// Фильтруем цены
		let new_data = [];
		this.data.forEach((item, key, arr) => {
			if((item.price >= this.filters.price[0] && item.price <= this.filters.price[1])) {
				new_data.push(item);
			}
		});
		this.data = new_data;
		// Фильтруем наличие

		if(this.filters.available) {
			this.data.forEach((item, key, arr) => {
				if(item.quantity < 1) {
					this.data.splice(key, 1);
				}
			});
		}
		
		// Фильтруем Бредны
		if(this.filters.brand.length > 0) {
			let new_data = [];
			// for(let i = 0; i < this.data.length; i++) {
			// 	if(!this.filters.brand.includes(this.data[i].brand)) {
			// 		this.data.splice(, 1);
			// 	}
			// }
			this.data.forEach((item, key, arr) => {
				if(this.filters.brand.includes(item.brand, 0)) {
					new_data.push(item);
					//this.data.splice(key, 1);
				}
			});
			this.data = new_data;
			
		}
		if(this.data.length == this.globalData.length) {
			this.filters.default = true;
		} else {
			this.filters.default = false;
		}
		//console.log(this.filters);
		this.getSorting();

	}
}