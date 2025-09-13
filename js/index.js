(function () {
	const form = document.getElementById("formProducto");
	
	if (form) {
		form.addEventListener("submit", (e) => {
			e.preventDefault();

			const imagen = document.getElementById("imagen").value.trim();
			const nombre = document.getElementById("nombre").value.trim();
			const descripcion = document.getElementById("descripcion").value.trim();
			const precioStr = document.getElementById("precio").value.trim();

			const precio = Number(precioStr);
			if (!nombre || !descripcion || isNaN(precio) || precio < 0) {
				Toast.show("Por favor, completa los campos correctamente.");
				return;
			}

			const producto = {
				id: Date.now(),
				imagen: imagen || "./assets/noimage.png",
				nombre,
				descripcion,
				precio: Number(precio.toFixed(2)),
			};

			Storage.addProduct(producto);

			try {
				sessionStorage.setItem("flashToast", "Producto guardado");
			} catch (err) {
				console.warn("No se pudo guardar flashToast en sessionStorage", err);
			}
			window.location.href = "./productos.html";
		});
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
