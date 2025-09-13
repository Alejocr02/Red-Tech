(function ()
{
const formRegistro = document.getElementById("formRegistro");


formRegistro?.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const codigo = document.getElementById("codigo").value.trim();
    const celular = document.getElementById("celular").value.trim();

    if(!usuario || !contrasena || !codigo || !celular){
        Toast.show("Completa todos los campos");
        return;
    }

    const api = window.Auth || window.Storage;
    const result = api.registerUser({
        usuario,
        contrasena,
        codigo,
        celular
    });

    if (result && result.ok === false) {
        Toast.show(result.error || "El usuario ya existe");
        return;
    }
    
    if (result && result.ok === true) {
        api.setSessionUser(usuario);   
        if (typeof updateIndicator === 'function') {
            updateIndicator();
        }   
        Toast.show(`¡Bienvenido ${usuario}! Registro exitoso`);
        formRegistro.reset();
        setTimeout(() => {
            window.location.href = "./productos.html";
        }, 2000);
    } else {
        Toast.show("Usuario registrado con éxito");
        formRegistro.reset();
    }

 })


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