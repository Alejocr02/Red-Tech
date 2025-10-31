(function () {
	try {
		const msg = sessionStorage.getItem("flashToast");
		if (msg && window.Toast?.show) {
			Toast.show(msg);
			sessionStorage.removeItem("flashToast");
		}
	} catch {}

	const contenedor = document.getElementById("listaProductos");
	const vacio = document.getElementById("vacio");
	const btnLimpiar = document.getElementById("btnLimpiarProductos");

	function renderProductos() {
		if (!contenedor) return;
		const productos = Storage.getProducts();
		contenedor.innerHTML = "";
		
		if (productos.length === 0) {
			if (vacio) vacio.classList.remove("hidden");
			return;
		}
		
		if (vacio) vacio.classList.add("hidden");
		productos.forEach((p) => {
			const card = document.createElement("article");
			card.className = "card product";
			card.innerHTML = `
				<img src="${p.imagen}" alt="${p.nombre}" class="product-img"/>
				<div class="product-body">
					<h3>${p.nombre}</h3>
					<p class="desc">${p.descripcion}</p>
					<div class="price-row">
						<span class="price">$${p.precio.toFixed(2)}</span>
						<button class="btn primary" data-id="${p.id}">Comprar</button>
					</div>
				</div>
			`;
			contenedor.appendChild(card);
		});
	}

	if (contenedor) {
		contenedor.addEventListener("click", (e) => {
			const btn = e.target.closest("button[data-id]");
			if (!btn) return;
			const id = Number(btn.getAttribute("data-id"));
			const producto = Storage.getProducts().find((x) => x.id === id);
			if (!producto) return;
			Storage.addToCart(producto);
			if (window.Toast?.show) Toast.show("Producto agregado al carrito");
		});
	}

	if (btnLimpiar) {
		btnLimpiar.addEventListener("click", async () => {
			const ok = await (window.Toast?.confirm
				? Toast.confirm("¿Eliminar todos los productos?", { okText: "Sí", cancelText: "No" })
				: Promise.resolve(true));
			if (!ok) return;
			Storage.clearProducts();
			renderProductos();
			if (window.Toast?.show) Toast.show("Productos eliminados");
		});
	}

	document.addEventListener("click", (e) => {
		const btn = e.target.closest(".btn-agregar-carrito");
		if (!btn) return;
		
		const name = btn.getAttribute("data-name");
		const price = btn.getAttribute("data-price");
		if (!name || !price) return;
		
		const producto = {
			id: Date.now() + Math.random(),
			nombre: name,
			precio: Number(price),
			descripcion: btn.closest('.tarjeta-producto')?.querySelector('p:not(.precio)')?.textContent || '',
			imagen: btn.closest('.tarjeta-producto')?.querySelector('img')?.src || ''
		};
		
		Storage.addToCart(producto);
		if (window.Toast?.show) Toast.show("Producto agregado al carrito");
		if (window.updateIndicator) window.updateIndicator();
	});

	renderProductos();
	if (window.updateIndicator) window.updateIndicator();
})();