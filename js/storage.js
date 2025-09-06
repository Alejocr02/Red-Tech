// Módulo mínimo para manejar productos y carrito con localStorage
// Sin compatibilidad con estado en URL ni codificaciones.

const Storage = (() => {
	// Claves centralizadas para evitar "magic strings"
	const STORAGE_KEYS = {
		products: "tienda.products",
		cart: "tienda.cart",
	};

	// Lee un arreglo desde localStorage, retorna [] si no existe o hay error
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

	// Guarda un arreglo en localStorage; muestra Toast si falla
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

	// API de productos
	// Devuelve el array de productos desde localStorage
	function getProducts() {
		return readArrayFromStorage(STORAGE_KEYS.products);
	}

	// Agrega un producto y persiste el array en localStorage
	function addProduct(product) {
		const items = readArrayFromStorage(STORAGE_KEYS.products);
		items.push(product);
		saveArrayToStorage(STORAGE_KEYS.products, items);
	}

	// Elimina todos los productos guardados
	function clearProducts() {
		saveArrayToStorage(STORAGE_KEYS.products, []);
	}

	// API de carrito
	// Devuelve el array de ítems del carrito desde localStorage
	function getCart() {
		return readArrayFromStorage(STORAGE_KEYS.cart);
	}

	// Agrega un producto al carrito y persiste el array
	function addToCart(product) {
		const items = readArrayFromStorage(STORAGE_KEYS.cart);
		items.push(product);
		saveArrayToStorage(STORAGE_KEYS.cart, items);
	}

	// Quita del carrito el ítem en la posición indicada por índice
	function removeFromCart(index) {
		const items = readArrayFromStorage(STORAGE_KEYS.cart);
		if (index >= 0 && index < items.length) {
			items.splice(index, 1);
			saveArrayToStorage(STORAGE_KEYS.cart, items);
		}
	}

	// Vacía completamente el carrito en storage
	function clearCart() {
		saveArrayToStorage(STORAGE_KEYS.cart, []);
	}

	// Calcula el total del carrito sumando los precios (2 decimales al mostrar)
	function getCartTotal() {
		return getCart().reduce((acc, item) => acc + (Number(item.precio) || 0), 0);
	}

	return {
		// Productos
		getProducts,
		addProduct,
		clearProducts,
		// Carrito
		getCart,
		addToCart,
		removeFromCart,
		clearCart,
		getCartTotal,
	};
})();
