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
		if (!el) return;
		const api = window.Auth;
		let text = "Invitado";
		let logged = false;
		if (api?.getCurrentUser) {
			const u = api.getCurrentUser();
			if (u?.usuario) {
				text = `👤${u.usuario}`;
				logged = true;
			}
		}
		el.textContent = text;
		el.classList.toggle("logged", logged);
		if (btnLogout) btnLogout.classList.toggle("hidden", !logged);
	}

	window.updateIndicator = updateIndicator;
})();