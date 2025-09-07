// IIFE: función autoejecutable que aísla el código y lo corre al cargar el script
(function () {
	// Intenta mostrar un mensaje "flash" guardado en sessionStorage al llegar a esta página
	try {
		// Lee el mensaje temporal que pudo haberse guardado en otra página
		const msg = sessionStorage.getItem("flashToast");
		// Si hay mensaje y existe Toast.show, lo muestra como notificación
		if (msg && window.Toast?.show) {
			Toast.show(msg);
		}
		// Elimina el mensaje para no volver a mostrarlo en recargas futuras
		sessionStorage.removeItem("flashToast");
	} catch {}

	// Obtiene el contenedor donde se renderiza la lista de productos
	const contenedor = document.getElementById("listaProductos");
	// Elemento que muestra el estado de "no hay productos"
	const vacio = document.getElementById("vacio");
	// Botón que elimina todos los productos guardados
	const btnLimpiar = document.getElementById("btnLimpiarProductos");

	// Función que pinta la grilla de productos en el DOM
	function renderProductos() {
		// Obtiene el arreglo de productos desde el almacenamiento (API Storage propia)
		const productos = Storage.getProducts();
		// Limpia el contenedor antes de volver a pintar
		contenedor.innerHTML = "";
		// Si no hay productos, muestra el mensaje de vacío y sale
		if (productos.length === 0) {
			vacio.classList.remove("hidden");
			return;
		}
		// Si hay productos, oculta el mensaje de vacío
		vacio.classList.add("hidden");
		// Recorre cada producto para crear su card y añadirla al contenedor
		productos.forEach((p) => {
			// Crea el elemento article que representará la card del producto
			const card = document.createElement("article");
			// Asigna clases para estilos de tarjeta de producto
			card.className = "card product";
			// Define el contenido HTML de la card mediante un template literal
			// (incluye imagen, nombre, descripción, precio y botón "Comprar" con data-id)
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
			// Inserta la card en el contenedor principal de productos
			contenedor.appendChild(card);
		});
	}

	// Delegación de eventos: escucha clicks dentro del contenedor de productos
	contenedor.addEventListener("click", (e) => {
		// Busca el botón más cercano con atributo data-id (solo reacciona si se pulsó "Comprar")
		const btn = e.target.closest("button[data-id]");
		// Si el click no fue en un botón de compra, no hace nada
		if (!btn) return;
		// Convierte el data-id del botón a número para usarlo como identificador
		const id = Number(btn.getAttribute("data-id"));
		// Busca en la lista de productos el que coincida con el id clicado
		const producto = Storage.getProducts().find((x) => x.id === id);
		// Si por alguna razón no se encuentra el producto, sale
		if (!producto) return;
		// Agrega el producto al carrito mediante la API Storage
		Storage.addToCart(producto);
		// Muestra un toast informando que se agregó al carrito (si la utilidad está disponible)
		if (window.Toast && typeof Toast.show === "function") {
			Toast.show("Producto agregado al carrito");
		}
	});

	// Maneja el click en el botón "Limpiar productos" para borrar todos los guardados
	btnLimpiar.addEventListener("click", async () => {
		// Solicita confirmación no bloqueante con Toast.confirm si está disponible
		const ok = await (window.Toast?.confirm
			? Toast.confirm("¿Eliminar todos los productos?", {
					okText: "Sí",
					cancelText: "No",
			  })
			: Promise.resolve(true));
		// Si el usuario no confirma, cancela la operación
		if (!ok) return;
		// Limpia todos los productos del almacenamiento
		Storage.clearProducts();
		// Vuelve a renderizar la vista, que ahora quedará vacía
		renderProductos();
		// Informa mediante toast que se eliminaron los productos
		if (window.Toast?.show) Toast.show("Productos eliminados");
	});

	// Renderiza los productos al cargar el script/página
	renderProductos();
	
	// Actualizar indicador de usuario al cargar la página
	if (window.updateIndicator) {
		window.updateIndicator();
	}
})();
