(function () {
	try {
		const msg = sessionStorage.getItem("flashToast");
		if (msg && window.Toast?.show) {
			Toast.show(msg);
		}
		sessionStorage.removeItem("flashToast");
	} catch {}

	const contenedor = document.getElementById("listaProductos");
	const vacio = document.getElementById("vacio");
	const btnLimpiar = document.getElementById("btnLimpiarProductos");

	function renderProductos() {
		const productos = Storage.getProducts();
		contenedor.innerHTML = "";
		if (productos.length === 0) {
			vacio.classList.remove("hidden");
			return;
		}
		vacio.classList.add("hidden");
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

	contenedor.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-id]");
		if (!btn) return;
		const id = Number(btn.getAttribute("data-id"));
		const producto = Storage.getProducts().find((x) => x.id === id);
		if (!producto) return;
		Storage.addToCart(producto);
		if (window.Toast && typeof Toast.show === "function") {
			Toast.show("Producto agregado al carrito");
		}
	});

	btnLimpiar.addEventListener("click", async () => {
		const ok = await (window.Toast?.confirm
			? Toast.confirm("¿Eliminar todos los productos?", {
					okText: "Sí",
					cancelText: "No",
			  })
			: Promise.resolve(true));
		if (!ok) return;
		Storage.clearProducts();
		renderProductos();
		if (window.Toast?.show) Toast.show("Productos eliminados");
	});

	renderProductos();
	
	if (window.updateIndicator) {
		window.updateIndicator();
	}
	
	document.addEventListener('DOMContentLoaded', function() {
		if (window.updateIndicator) {
			window.updateIndicator();
		}
		try {
			const flashToast = sessionStorage.getItem("flashToast");
			if (flashToast) {
				sessionStorage.removeItem("flashToast");
				if (window.Toast?.show) {
					Toast.show(flashToast);
				}
			}
		} catch (err) {
			console.warn("Error al mostrar toast flash:", err);
		}
	});
})();