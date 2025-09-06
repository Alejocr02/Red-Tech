// IIFE: función autoejecutable que aísla el código y lo corre al cargar el script
(function () {
	// Obtiene la lista (ul) donde se renderizarán los ítems del carrito
	const ul = document.getElementById("listaCarrito");
	// Obtiene el elemento que mostrará el total acumulado del carrito
	const totalEl = document.getElementById("total");
	// Obtiene el botón que permite vaciar por completo el carrito
	const btnVaciar = document.getElementById("btnVaciar");
	// Obtiene el botón que permite ir a la página de pago
	const btnIrPagar = document.getElementById("btnIrPagar");

	// Función que pinta el contenido actual del carrito en la lista y actualiza el total
	function renderCarrito() {
		// Recupera el arreglo de productos del carrito desde la API de Storage
		const carrito = Storage.getCart();
		// Limpia el contenido previo de la lista para volver a construirla
		ul.innerHTML = "";
		// Si el carrito está vacío, muestra un único <li> con un mensaje
		if (carrito.length === 0) {
			// Crea el elemento de lista
			const li = document.createElement("li");
			// Aplica estilo de texto atenuado
			li.className = "muted";
			// Define el texto informativo
			li.textContent = "El carrito está vacío.";
			// Inserta el elemento en la lista
			ul.appendChild(li);
		} else {
			// Si hay productos, recorre cada uno para construir su fila
			carrito.forEach((item, index) => {
				// Crea un <li> por producto
				const li = document.createElement("li");
				// Asigna clases para estilos del ítem de carrito
				li.className = "cart-item";
				// Define el contenido visual del ítem: imagen, info, precio y botón "Quitar"
				li.innerHTML = `
			  <img src="${item.imagen}" alt="${item.nombre}" />
			  <div class="info">
				<strong>${item.nombre}</strong>
				<span class="muted">${item.descripcion}</span>
			  </div>
			  <span class="price">$${item.precio.toFixed(2)}</span>
			  <button class="btn" data-index="${index}">Quitar</button>
			`;
				// Añade el ítem construido a la lista del carrito
				ul.appendChild(li);
			});
		}
		// Actualiza el texto del total con el monto formateado a 2 decimales
		totalEl.textContent = `$${Storage.getCartTotal().toFixed(2)}`;

		// Muestra u oculta el botón "Ir a pagar" según si el carrito está vacío
		if (btnIrPagar) {
			if (Storage.getCart().length === 0) {
				btnIrPagar.classList.add("hidden");
			} else {
				btnIrPagar.classList.remove("hidden");
			}
		}
	}

	// Delegación de eventos: escucha clicks en la lista para detectar botones "Quitar"
	ul.addEventListener("click", (e) => {
		// Busca el botón más cercano con el atributo data-index (índice del ítem en el carrito)
		const btn = e.target.closest("button[data-index]");
		// Si el click no corresponde a un botón válido, no hace nada
		if (!btn) return;
		// Convierte el valor de data-index a número para usarlo como posición
		const idx = Number(btn.getAttribute("data-index"));
		// Quita del carrito el producto en la posición indicada
		Storage.removeFromCart(idx);
		// Vuelve a renderizar la lista y el total después de la eliminación
		renderCarrito();
		// Muestra un toast informando que el producto fue quitado (si la utilidad está disponible)
		Toast.show("Producto quitado del carrito");
	});

	// Maneja el click en el botón "Vaciar carrito" para eliminar todos los ítems
	btnVaciar.addEventListener("click", async () => {
		// Confirmación no bloqueante mediante Toast.confirm (si está disponible); si no, asume aceptación
		const ok = await (window.Toast?.confirm
			? Toast.confirm("¿Vaciar el carrito?", { okText: "Sí", cancelText: "No" })
			: Promise.resolve(true));
		// Si el usuario cancela, aborta la operación
		if (!ok) return;
		// Limpia completamente el carrito del almacenamiento
		Storage.clearCart();
		// Re-renderiza la lista para reflejar el estado vacío y actualiza el total
		renderCarrito();
		// Informa mediante toast que el carrito fue vaciado
		if (window.Toast?.show) Toast.show("Carrito vaciado");
	});

	// Maneja el click en el botón "Ir a pagar"
	btnIrPagar?.addEventListener("click", (e) => {
		const total = Storage.getCartTotal();
		// Si el total es 0 o menos, muestra un mensaje y previene la acción
		if (total <= 0) {
			Toast.show("No hay productos para pagar");
			e.preventDefault();
			return;
		}
		// Si no hay sesión, la página de pago mostrará login y recordará el mensaje
		try {
			sessionStorage.setItem(
				"flashToast",
				"Inicia sesión para completar el pago"
			);
		} catch {}
	});

	// Inicializa la vista del carrito al cargar el script
	renderCarrito();
})();
