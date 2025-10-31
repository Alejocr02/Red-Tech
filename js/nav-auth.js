(function(){
function ensureLogoutButton() {
		const nav = document.querySelector(".topbar nav");
		if (!nav) return null;
		let btn = nav.querySelector("#btnNavLogout");
		if (!btn) {
			btn = document.createElement("button");
			btn.id = "btnNavLogout";
			btn.className = "btn nav-logout hidden";
			btn.type = "button";
			btn.textContent = "Cerrar sesión";
			nav.appendChild(btn);
			if (!btn._bound) {
				btn.addEventListener("click", () => {
					const api = window.Auth;
					if (api?.logout) {
						api.logout();
						if (window.Toast?.show) Toast.show("Sesión cerrada");
						updateIndicator();
						try {
							sessionStorage.setItem("flashToast", "Sesión cerrada");
						} catch {}
						window.location.href = "./productos.html";
					}
				});
				btn._bound = true;
			}
		}
		return btn;
}

function updateIndicator() {
		const el = document.querySelector(".topbar nav #userIndicator");
		const btnLogout = ensureLogoutButton();
		const loginLink = document.querySelector("a[href*='login']") || document.querySelector("a[href*='iniciarsesion']");
		const registroLink = document.querySelector("a[href*='registro']");
		
		if (!el) {
			return;
		}
		
		let user = null;
		if (window.Auth?.getCurrentUser) {
			user = window.Auth.getCurrentUser();
		}
		
		let text = "Invitado";
		let logged = false;
		
		if (user && user.usuario) {
			text = `👤${user.usuario}`;
			logged = true;
		}
		
		el.textContent = text;
		el.classList.toggle("logged", logged);
		
		if (btnLogout) {
			btnLogout.classList.toggle("hidden", !logged);
		}
		
		if (loginLink) {
			loginLink.style.display = logged ? "none" : "";
		}
		if (registroLink) {
			registroLink.style.display = logged ? "none" : "";
		}
		
		if (window.updatePagoUI && typeof window.updatePagoUI === 'function') {
			window.updatePagoUI();
		}
	}

	window.updateIndicator = updateIndicator;
	
	document.addEventListener('DOMContentLoaded', function() {
		setTimeout(function() {
			updateIndicator();
		}, 100);
	});
	
	if (document.readyState === 'loading') {
	} else {
		setTimeout(function() {
			updateIndicator();
		}, 100);
	}
})();