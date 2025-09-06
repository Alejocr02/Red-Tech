// IIFE: función autoejecutable que aísla el código y lo corre al cargar el script
(function () {
	// Obtiene la referencia al formulario con id "formProducto"
	const form = document.getElementById("formProducto");
	// Si no existe el formulario en la página, termina para evitar errores
	if (!form) return;

	// Escucha el evento "submit" del formulario para manejar el envío personalizado
	form.addEventListener("submit", (e) => {
		// Evita que el formulario envíe y recargue la página por defecto
		e.preventDefault();

		// Lee y recorta espacios de los campos del formulario
		const imagen = document.getElementById("imagen").value.trim();
		const nombre = document.getElementById("nombre").value.trim();
		const descripcion = document.getElementById("descripcion").value.trim();
		const precioStr = document.getElementById("precio").value.trim();

		// Convierte el precio ingresado (string) a número
		const precio = Number(precioStr);
		// Valida que nombre/descripcion no estén vacíos y que el precio sea válido y no negativo
		if (!nombre || !descripcion || isNaN(precio) || precio < 0) {
			// Muestra un mensaje de error si la validación falla
			Toast.show("Por favor, completa los campos correctamente.");
			return;
		}

		// Construye el objeto producto con los datos normalizados
		const producto = {
			// Genera un id único basado en la marca de tiempo actual
			id: Date.now(),
			// Si no se proporcionó imagen, usa una imagen por defecto
			imagen: imagen || "./assets/noimage.png",
			// Asigna el nombre y la descripción usando shorthand properties
			nombre,
			descripcion,
			// Normaliza el precio a 2 decimales y lo asegura como número
			precio: Number(precio.toFixed(2)),
		};

		// Agrega el producto al almacenamiento usando la API Storage
		Storage.addProduct(producto);

		// Guarda un mensaje temporal para mostrarlo como toast al llegar a productos.html
		try {
			// Intenta guardar el mensaje en sessionStorage (puede fallar por políticas del navegador)
			sessionStorage.setItem("flashToast", "Producto guardado");
		} catch (err) {
			// Si falla, no interrumpe el flujo (solo avisa por consola)
			console.warn("No se pudo guardar flashToast en sessionStorage", err);
		}
		// Redirige a la página de productos sin parámetros en la URL
		window.location.href = "./productos.html";
	});
})();
