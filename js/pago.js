(function () {
	// UI elements
	const loginSection = document.getElementById("loginSection");
	const pagoSection = document.getElementById("pagoSection");
	const formLogin = document.getElementById("formLogin");
	const formPago = document.getElementById("formPago");
	const montoEl = document.getElementById("montoPagar");
	const btnLogout = document.getElementById("btnLogout");

	function updateUI() {
		const user = (window.Auth || window.Storage).getCurrentUser?.();
		const total = Storage.getCartTotal();
		montoEl.textContent = `$${total.toFixed(2)}`;

		if (user) {
			loginSection.classList.add("hidden");
			pagoSection.classList.remove("hidden");
		} else {
			loginSection.classList.remove("hidden");
			pagoSection.classList.add("hidden");
		}
	}

	// If coming from carrito and no items, hint
	(function flash() {
		try {
			const msg = sessionStorage.getItem("flashToast");
			if (msg && window.Toast?.show) Toast.show(msg);
			sessionStorage.removeItem("flashToast");
		} catch {}
	})();

	formLogin?.addEventListener("submit", (e) => {
		e.preventDefault();
		const usuario = document.getElementById("loginUsuario").value.trim();
		const contrasena = document.getElementById("loginContrasena").value;
		const api = window.Auth || window.Storage;
		const user = api.validateLogin(usuario, contrasena);
		if (!user) {
			Toast.show("Usuario o contraseña inválidos");
			return;
		}
		api.setSessionUser(usuario);
		Toast.show("Sesión iniciada");
		updateUI();
	});

	btnLogout?.addEventListener("click", () => {
		const api = window.Auth || window.Storage;
		api.logout();
		Toast.show("Sesión cerrada");
		try {
			sessionStorage.setItem("flashToast", "Sesión cerrada");
		} catch {}
		window.location.href = "./productos.html";
	});

	formPago?.addEventListener("submit", (e) => {
		e.preventDefault();
		const api = window.Auth || window.Storage;
		const user = api.getCurrentUser?.();
		if (!user) {
			Toast.show("Primero inicia sesión");
			updateUI();
			return;
		}
		const codigo = document.getElementById("codigoPago").value.trim();
		const total = Storage.getCartTotal();
		if (total <= 0) {
			Toast.show("No hay productos en el carrito");
			return;
		}

		if (codigo === user.codigo) {
			// Simula pago exitoso
			Storage.clearCart();
			Toast.show("Pago exitoso");
			try {
				sessionStorage.setItem("flashToast", "Pago aprobado");
			} catch {}
			window.location.href = "./productos.html";
		} else {
			Toast.show("Pago rechazado: código incorrecto");
		}
	});

	// If arriving from carrito, encourage login if no session
	(function enforceLoginIfNeeded() {
		const total = Storage.getCartTotal();
		const api = window.Auth || window.Storage;
		const user = api.getCurrentUser?.();
		if (total > 0 && !user) {
			try {
				sessionStorage.setItem("flashToast", "Inicia sesión para pagar");
			} catch {}
		}
	})();

	updateUI();
})();
