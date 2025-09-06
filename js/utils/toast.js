// Utilidad global de Toast sencilla
// Uso: Toast.show("Mensaje", 1800)
// IIFE que encapsula la utilidad y la expone en window como Toast
(function () {
	// Asegura que exista el elemento .toast en el DOM; si no, lo crea y lo devuelve
	function ensureToastElement() {
		// Busca un elemento existente con la clase .toast
		let toastEl = document.querySelector(".toast");
		// Si no existe, lo crea dinámicamente
		if (!toastEl) {
			// Crea un div para usarlo como contenedor del toast
			toastEl = document.createElement("div");
			// Le asigna la clase para estilos
			toastEl.className = "toast";
			// Lo agrega al body para que sea visible en la página
			document.body.appendChild(toastEl);
		}
		// Devuelve la referencia al elemento .toast (nuevo o existente)
		return toastEl;
	}

	// Muestra un mensaje temporal como toast durante 'duration' milisegundos
	function show(message, duration = 1800) {
		// Obtiene o crea el elemento .toast
		const toastEl = ensureToastElement();
		// Define el texto del mensaje a mostrar
		toastEl.textContent = message;
		// Agrega la clase 'show' para disparar la visibilidad/animación
		toastEl.classList.add("show");
		// Limpia un posible temporizador previo para evitar conflictos
		clearTimeout(toastEl._hideTimer);
		// Programa la ocultación del toast quitando la clase 'show' tras 'duration'
		toastEl._hideTimer = setTimeout(
			() => toastEl.classList.remove("show"),
			duration
		);
	}

	// Muestra un toast con botones Sí/No y devuelve una Promesa<boolean>
	function confirm(message, opts) {
		// Mezcla opciones por defecto con las provistas por el llamador
		const options = Object.assign(
			{ okText: "Sí", cancelText: "No", timeout: 0 },
			opts
		);
		// Devuelve una promesa que se resuelve con true/false según el botón
		return new Promise((resolve) => {
			// Obtiene o crea el elemento .toast
			const toastEl = ensureToastElement();
			// Inyecta la estructura HTML del mensaje con las acciones
			toastEl.innerHTML = `
				<div class="toast-message">${message}</div>
				<div class="toast-actions">
					<button class="btn primary" data-action="ok">${options.okText}</button>
					<button class="btn" data-action="cancel">${options.cancelText}</button>
				</div>
			`;
			// Muestra el toast agregando la clase 'show'
			toastEl.classList.add("show");
			// Cancela cualquier temporizador previo de ocultación
			clearTimeout(toastEl._hideTimer);

			// Manejador de click para capturar la acción del usuario en los botones
			const onClick = (e) => {
				// Busca si el click proviene de un botón con data-action
				const btn = e.target.closest("button[data-action]");
				// Si no fue un botón relevante, no hace nada
				if (!btn) return;
				// Obtiene el valor de la acción ("ok" o "cancel")
				const action = btn.getAttribute("data-action");
				// Limpia listeners y timers y oculta el toast
				cleanup();
				// Resuelve la promesa con true si fue "ok", false en caso contrario
				resolve(action === "ok");
			};

			// Limpia manejadores, timers y contenido del toast tras la animación
			function cleanup() {
				// Quita el listener de click para evitar fugas de memoria
				toastEl.removeEventListener("click", onClick);
				// Detiene el temporizador de timeout de confirmación si existía
				clearTimeout(toastEl._confirmTimeout);
				// Oculta el toast removiendo la clase 'show'
				toastEl.classList.remove("show");
				// limpiar contenido después de la animación
				clearTimeout(toastEl._clearContentTimer);
				// Vacía el contenido del toast tras un ligero retraso (sin cortar la animación)
				toastEl._clearContentTimer = setTimeout(
					() => (toastEl.innerHTML = ""),
					220
				);
			}

			// Escucha los clicks en el toast para detectar las acciones de los botones
			toastEl.addEventListener("click", onClick);
			// Si se definió un timeout > 0, cancela automáticamente con false cuando venza
			if (options.timeout > 0) {
				toastEl._confirmTimeout = setTimeout(() => {
					// Limpia y oculta el toast al expirar el tiempo
					cleanup();
					// Resuelve la promesa como cancelado
					resolve(false);
				}, options.timeout);
			}
		});
	}

	// Expone la API pública en el objeto global window como Toast
	window.Toast = { show, confirm };
})();
