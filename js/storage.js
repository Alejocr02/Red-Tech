const Storage = (() => {
	const STORAGE_KEYS = {
		products: "tienda.products",
		cart: "tienda.cart",
	};

	function readArrayFromStorage(storageKey) {
		try {
			const jsonString = localStorage.getItem(storageKey);
			if (!jsonString) return [];
			const items = JSON.parse(jsonString);
			return Array.isArray(items) ? items : [];
		} catch {
			return [];
		}
	}

	function saveArrayToStorage(storageKey, items) {
		try {
			localStorage.setItem(storageKey, JSON.stringify(items));
			return true;
		} catch (err) {
			console.warn("No se pudo guardar en localStorage", err);
			if (window.Toast?.show) Toast.show("No se pudo guardar en localStorage");
			return false;
		}
	}

	function getProducts() {
		return readArrayFromStorage(STORAGE_KEYS.products);
	}

	function addProduct(product) {
		const items = readArrayFromStorage(STORAGE_KEYS.products);
		items.push(product);
		saveArrayToStorage(STORAGE_KEYS.products, items);
	}

	function clearProducts() {
		saveArrayToStorage(STORAGE_KEYS.products, []);
	}

	function getCart() {
		return readArrayFromStorage(STORAGE_KEYS.cart);
	}

	function addToCart(product) {
		const items = readArrayFromStorage(STORAGE_KEYS.cart);
		items.push(product);
		saveArrayToStorage(STORAGE_KEYS.cart, items);
	}

	function removeFromCart(index) {
		const items = readArrayFromStorage(STORAGE_KEYS.cart);
		if (index >= 0 && index < items.length) {
			items.splice(index, 1);
			saveArrayToStorage(STORAGE_KEYS.cart, items);
		}
	}

	function clearCart() {
		saveArrayToStorage(STORAGE_KEYS.cart, []);
	}

	function getCartTotal() {
		return getCart().reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
	}

	return {
		getProducts,
		addProduct,
		clearProducts,
		getCart,
		addToCart,
		removeFromCart,
		clearCart,
		getCartTotal,
	};
})();
