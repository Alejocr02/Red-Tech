
(function () {
	function ensureToastElement() {
		let toastEl = document.querySelector(".toast");
		if (!toastEl) {
			toastEl = document.createElement("div");
			toastEl.className = "toast";
			document.body.appendChild(toastEl);
		}
		return toastEl;
	}

	function show(message, duration = 1800) {
		const toastEl = ensureToastElement();
		toastEl.textContent = message;
		toastEl.classList.add("show");
		clearTimeout(toastEl._hideTimer);
		toastEl._hideTimer = setTimeout(
			() => toastEl.classList.remove("show"),
			duration
		);
	}

	function confirm(message, opts) {
		const options = Object.assign(
			{ okText: "Sí", cancelText: "No", timeout: 0 },
			opts
		);
		return new Promise((resolve) => {
			const toastEl = ensureToastElement();
			toastEl.innerHTML = `
				<div class="toast-message">${message}</div>
				<div class="toast-actions">
					<button class="btn primary" data-action="ok">${options.okText}</button>
					<button class="btn" data-action="cancel">${options.cancelText}</button>
				</div>
			`;
			toastEl.classList.add("show");
			clearTimeout(toastEl._hideTimer);

			const onClick = (e) => {
				const btn = e.target.closest("button[data-action]");
				if (!btn) return;
				const action = btn.getAttribute("data-action");
				cleanup();
				resolve(action === "ok");
			};

			function cleanup() {
				toastEl.removeEventListener("click", onClick);
				clearTimeout(toastEl._confirmTimeout);
				toastEl.classList.remove("show");
				clearTimeout(toastEl._clearContentTimer);
				toastEl._clearContentTimer = setTimeout(
					() => (toastEl.innerHTML = ""),
					220
				);
			}

			toastEl.addEventListener("click", onClick);
			if (options.timeout > 0) {
				toastEl._confirmTimeout = setTimeout(() => {
					cleanup();
					resolve(false);
				}, options.timeout);
			}
		});
	}

	window.Toast = { show, confirm };
})();
