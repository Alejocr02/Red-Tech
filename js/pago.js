(function () {
	const loginSection = document.getElementById("loginSection");
	const pagoSection = document.getElementById("pagoSection");
	const formLogin = document.getElementById("formLogin");
	const formPago = document.getElementById("formPago");
	const montoEl = document.getElementById("montoPagar");
	const btnLogout = document.getElementById("btnLogout");

	function updateUI() {
		const user = window.Auth?.getCurrentUser?.();
		const total = Storage.getCartTotal();
		
		if (montoEl) {
			montoEl.textContent = `$${total.toFixed(2)}`;
		}

		if (user && user.usuario) {
			// Usuario logueado: mostrar sección de pago
			if (loginSection) loginSection.classList.add("hidden");
			if (pagoSection) pagoSection.classList.remove("hidden");
		} else {
			// Usuario no logueado: mostrar sección de login
			if (loginSection) loginSection.classList.remove("hidden");
			if (pagoSection) pagoSection.classList.add("hidden");
		}
	}

	// Hacer función global
	window.updatePagoUI = updateUI;

	// Flash toast
	(function flash() {
		try {
			const msg = sessionStorage.getItem("flashToast");
			if (msg && window.Toast?.show) Toast.show(msg);
			sessionStorage.removeItem("flashToast");
		} catch {}
	})();

	// Login en la página de pago
	formLogin?.addEventListener("submit", (e) => {
		e.preventDefault();
		const usuario = document.getElementById("loginUsuario").value.trim();
		const contrasena = document.getElementById("loginContrasena").value;
		
		if (!window.Auth) {
			alert("Sistema de autenticación no disponible");
			return;
		}
		
		const result = window.Auth.validateLogin(usuario, contrasena);
		if (result && result.ok === false) {
			if (window.Toast?.show) {
				Toast.show(result.error || "Usuario o contraseña inválidos");
			} else {
				alert(result.error || "Usuario o contraseña inválidos");
			}
			return;
		}
		
		if (result && result.ok === true) {
			window.Auth.setSessionUser(usuario);
			if (window.Toast?.show) {
				Toast.show("Sesión iniciada");
			}
			updateUI();
			if (window.updateIndicator) {
				window.updateIndicator();
			}
		}
	});

	// Logout
	btnLogout?.addEventListener("click", () => {
		if (window.Auth?.logout) {
			window.Auth.logout();
			if (window.Toast?.show) {
				Toast.show("Sesión cerrada");
			}
			try {
				sessionStorage.setItem("flashToast", "Sesión cerrada");
			} catch {}
			window.location.href = "./productos.html";
		}
	});

	// Procesar pago
	formPago?.addEventListener("submit", (e) => {
		e.preventDefault();
		const user = window.Auth?.getCurrentUser?.();
		if (!user) {
			if (window.Toast?.show) {
				Toast.show("Primero inicia sesión");
			}
			updateUI();
			return;
		}
		
		const codigo = document.getElementById("codigoPago").value.trim();
		const total = Storage.getCartTotal();
		
		if (total <= 0) {
			if (window.Toast?.show) {
				Toast.show("No hay productos en el carrito");
			}
			return;
		}

		if (codigo === user.codigo) {
			Storage.clearCart();
			if (window.Toast?.show) {
				Toast.show("Pago exitoso");
			}
			try {
				sessionStorage.setItem("flashToast", "Pago aprobado");
			} catch {}
			window.location.href = "./productos.html";
		} else {
			if (window.Toast?.show) {
				Toast.show("Pago rechazado: código incorrecto");
			}
		}
	});

	updateUI();
	
	document.addEventListener('DOMContentLoaded', function() {
		// Esperar un poco más para que nav-auth.js termine
		setTimeout(function() {
			updateUI();
			if (window.updateIndicator) {
				window.updateIndicator();
			}
		}, 150);
	});
})();
