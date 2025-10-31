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
			if (loginSection) loginSection.classList.add("hidden");
			if (pagoSection) pagoSection.classList.remove("hidden");
		} else {
			if (loginSection) loginSection.classList.remove("hidden");
			if (pagoSection) pagoSection.classList.add("hidden");
		}
	}

	window.updatePagoUI = updateUI;

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

		const userData = Auth.getCurrentUserData();
		
		if (!userData) {
			if (window.Toast?.show) {
				Toast.show("Error: No se pudieron obtener los datos del usuario");
			}
			return;
		}

		if (codigo === userData.codigo) {
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
		setTimeout(function() {
			updateUI();
			if (window.updateIndicator) {
				window.updateIndicator();
			}
		}, 150);
	});
})();
