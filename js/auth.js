(function(){
  const KEYS = {
    users: "tienda.users",
    session: "tienda.session"
  };

  function readArray(key) {
    try {
      const json = localStorage.getItem(key);
      return json ? JSON.parse(json) : [];
    } catch {
      return [];
    }
  }

  function writeArray(key, arr) {
    try {
      localStorage.setItem(key, JSON.stringify(arr));
      return true;
    } catch {
      return false;
    }
  }

  function registerUser(user) {
    const users = readArray(KEYS.users);
    const exists = users.some(u => u.usuario === user.usuario);
    
    if (exists) return { ok: false, error: "Usuario ya existe" };
    
    users.push({
      usuario: String(user.usuario).trim(),
      contrasena: String(user.contrasena),
      codigo: String(user.codigo).trim(),
      celular: String(user.celular).trim(),
    });
    
    return writeArray(KEYS.users, users) 
      ? { ok: true } 
      : { ok: false, error: "No se pudo guardar el usuario" };
  }

  function validateLogin(usuario, contrasena) {
    const users = readArray(KEYS.users);
    const user = users.find(u => u.usuario === String(usuario).trim());
    
    if (!user) return { ok: false, error: "Usuario no existe" };
    if (user.contrasena !== String(contrasena)) return { ok: false, error: "Contraseña incorrecta" };
    
    return { ok: true, user };
  }

  function setSessionUser(usuario) {
    try {
      localStorage.setItem(KEYS.session, JSON.stringify({ 
        usuario: String(usuario).trim() 
      }));
      return true;
    } catch {
      return false;
    }
  }

  function getCurrentUser() {
    try {
      const session = localStorage.getItem(KEYS.session);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }

  function logout() {
    try {
      localStorage.removeItem(KEYS.session);
      return true;
    } catch {
      return false;
    }
  }

  function login(usuario, contrasena) {
    const result = validateLogin(usuario, contrasena);
    
    if (result.ok) {
      setSessionUser(usuario);
      if (window.Toast?.show) Toast.show("¡Ingreso exitoso!");
      
      if (window.updateIndicator) {
        window.updateIndicator();
        setTimeout(() => window.updateIndicator(), 100);
        setTimeout(() => window.updateIndicator(), 500);
      }
      
      setTimeout(() => {
        window.location.href = "./productos.html";
      }, 1000);
    } else {
      if (window.Toast?.show) Toast.show(result.error);
    }
    
    return result;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const frm = document.getElementById("frm");
    
    if (frm) {
      frm.addEventListener("submit", (e) => {
        e.preventDefault();
        const usuario = document.getElementById("email").value.trim();
        const contrasena = document.getElementById("password").value;
        
        if (!usuario || !contrasena) {
          if (window.Toast?.show) Toast.show("Por favor completa todos los campos");
          return;
        }
        
        login(usuario, contrasena);
      });
    }
    
    if (window.updateIndicator) window.updateIndicator();
  });

  function getCurrentUserData() {
    const session = getCurrentUser();
    if (!session) return null;
    
    const users = readArray(KEYS.users);
    return users.find(u => u.usuario === session.usuario) || null;
  }

  window.Auth = {
    registerUser,
    validateLogin,
    setSessionUser,
    getCurrentUser,
    getCurrentUserData,
    login,
    logout
  };
})();
