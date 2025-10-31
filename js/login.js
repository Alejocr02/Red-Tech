(function() {
    const frm = document.getElementById("frm");
    
    if (frm) {
        frm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const usuario = document.getElementById("email").value.trim();
            const contrasena = document.getElementById("password").value;
            
            if (!usuario || !contrasena) {
                if (window.Toast?.show) {
                    Toast.show("Por favor completa todos los campos");
                } else {
                    alert("Por favor completa todos los campos");
                }
                return;
            }
            
            // Verificar si Auth está disponible
            if (!window.Auth) {
                if (window.Toast?.show) {
                    Toast.show("Sistema de autenticación no disponible");
                } else {
                    alert("Sistema de autenticación no disponible");
                }
                return;
            }
            
            // Validar login
            const result = Auth.validateLogin(usuario, contrasena);
            
            if (result && result.ok === true) {
                // Login exitoso
                Auth.setSessionUser(usuario);
                
                if (window.Toast?.show) {
                    Toast.show("¡Ingreso exitoso!");
                } else {
                    alert("¡Ingreso exitoso!");
                }
                
                // Actualizar indicador si existe
                if (window.updateIndicator) {
                    window.updateIndicator();
                }
                
                // Redirigir a productos
                setTimeout(() => {
                    window.location.href = "./productos.html";
                }, 1000);
                
            } else {
                // Login fallido
                const errorMsg = result?.error || "Usuario o contraseña incorrectos";
                if (window.Toast?.show) {
                    Toast.show(errorMsg);
                } else {
                    alert(errorMsg);
                }
            }
        });
    }
    
    // Actualizar indicador al cargar
    document.addEventListener('DOMContentLoaded', function() {
        if (window.updateIndicator) {
            window.updateIndicator();
        }
    });
})();