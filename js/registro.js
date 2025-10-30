(function () {
    const formRegistro = document.getElementById("formRegistro");

    formRegistro?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        console.log("Formulario enviado");
        
        const usuario = document.getElementById("usuario").value.trim();
        const contrasena = document.getElementById("contrasena").value;
        const codigo = document.getElementById("codigo").value.trim();
        const celular = document.getElementById("celular").value.trim();

        console.log("Datos del formulario:", { usuario, contrasena, codigo, celular });

        if (!usuario || !contrasena || !codigo || !celular) {
            console.log("Campos incompletos");
            if (window.Toast && window.Toast.show) {
                window.Toast.show("Completa todos los campos");
            } else {
                alert("Completa todos los campos");
            }
            return;
        }

        console.log("Verificando Auth..."); 
        
        if (!window.Auth) {
            console.error("Auth no está disponible");
            alert("Error: Sistema de autenticación no disponible");
            return;
        }

        try {
            const result = window.Auth.registerUser({
                usuario,
                contrasena,
                codigo,
                celular
            });

            console.log("Resultado del registro:", result); 

            if (result && result.ok === false) {
                const errorMsg = result.error || "El usuario ya existe";
                console.log("Error en registro:", errorMsg);
                
                // Intentar múltiples formas de mostrar el mensaje
                if (window.Toast && window.Toast.show) {
                    window.Toast.show(errorMsg);
                    console.log("Mensaje mostrado con Toast");
                } else {
                    alert(errorMsg);
                    console.log("Mensaje mostrado con alert");
                }
                return;
            }
            
            if (result && result.ok === true) {
                console.log("Registro exitoso, estableciendo sesión..."); 
                window.Auth.setSessionUser(usuario);   
                
                if (typeof window.updateIndicator === 'function') {
                    window.updateIndicator();
                }   
                
                const successMsg = `¡Bienvenido ${usuario}! Registro exitoso`;
                console.log("Mostrando mensaje de éxito:", successMsg);
                
                if (window.Toast && window.Toast.show) {
                    window.Toast.show(successMsg);
                } else {
                    alert(successMsg);
                }
                
                formRegistro.reset();
                
                setTimeout(() => {
                    console.log("Redirigiendo a productos...");
                    window.location.href = "./productos.html";
                }, 2000);
            } else {
                console.log("Registro completado sin confirmación específica");
                if (window.Toast && window.Toast.show) {
                    window.Toast.show("Usuario registrado con éxito");
                } else {
                    alert("Usuario registrado con éxito");
                }
                formRegistro.reset();
            }
        } catch (error) {
            console.error("Error durante el registro:", error);
            if (window.Toast && window.Toast.show) {
                window.Toast.show("Error durante el registro. Intenta de nuevo.");
            } else {
                alert("Error durante el registro. Intenta de nuevo.");
            }
        }
    });

    document.addEventListener('DOMContentLoaded', function() {
        console.log("DOM cargado, inicializando registro...");
        
        if (window.updateIndicator) {
            window.updateIndicator();
        }
        
        try {
            const flashToast = sessionStorage.getItem("flashToast");
            if (flashToast) {
                sessionStorage.removeItem("flashToast");
                if (window.Toast && window.Toast.show) {
                    window.Toast.show(flashToast);
                }
            }
        } catch (err) {
            console.warn("Error al mostrar toast flash:", err);
        }
    });
})();