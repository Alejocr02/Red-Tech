(function () {
	const ul = document.getElementById("listaCarrito");
	const totalEl = document.getElementById("total");
	const btnVaciar = document.getElementById("btnVaciar");
	const btnIrPagar = document.getElementById("btnIrPagar");

	function renderCarrito() {
		const carrito = Storage.getCart();
		ul.innerHTML = "";
		if (carrito.length === 0) {
			const li = document.createElement("li");
			li.className = "muted";
			li.textContent = "El carrito está vacío.";
			ul.appendChild(li);
		} else {
			carrito.forEach((item, index) => {
				const li = document.createElement("li");
				li.className = "cart-item";
				li.innerHTML = `
			  <img src="${item.imagen}" alt="${item.nombre}" />
			  <div class="info">
				<strong>${item.nombre}</strong>
				<span class="muted">${item.descripcion}</span>
			  </div>
			  <span class="price">$${item.precio.toFixed(2)}</span>
			  <button class="btn" data-index="${index}">Quitar</button>
			`;
				ul.appendChild(li);
			});
		}
		totalEl.textContent = `$${Storage.getCartTotal().toFixed(2)}`;

		if (btnIrPagar) {
			if (Storage.getCart().length === 0) {
				btnIrPagar.classList.add("hidden");
			} else {
				btnIrPagar.classList.remove("hidden");
			}
		}
	}

	ul.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-index]");
		if (!btn) return;
		const idx = Number(btn.getAttribute("data-index"));
		Storage.removeFromCart(idx);
		renderCarrito();
		Toast.show("Producto quitado del carrito");
	});

	btnVaciar.addEventListener("click", async () => {
		const ok = await (window.Toast?.confirm
			? Toast.confirm("¿Vaciar el carrito?", { okText: "Sí", cancelText: "No" })
			: Promise.resolve(true));
		if (!ok) return;
		Storage.clearCart();
		renderCarrito();
		if (window.Toast?.show) Toast.show("Carrito vaciado");
	});

	btnIrPagar?.addEventListener("click", (e) => {
		const total = Storage.getCartTotal();
		if (total <= 0) {
			Toast.show("No hay productos para pagar");
			e.preventDefault();
			return;
		}
		try {
			sessionStorage.setItem(
				"flashToast",
				"Inicia sesión para completar el pago"
			);
		} catch {}
	});

	renderCarrito();
	
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
