(function ()
{
const formRegistro = document.getElementById("formRegistro");


formRegistro?.addEventListener("submit", (e) => {
    e.preventDefault();
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value;
    const codigo = document.getElementById("codigo").value.trim();
    const celular = document.getElementById("celular").value.trim();

    //validacion
    if(!usuario || !contrasena || !codigo || !celular){
        Toast.show("Completa todos los campos");
        return;
    }

    //verificar existencia del usuario
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
    
    Toast.show("Usuario registrado con éxito");
    form.reset();

 })

})();