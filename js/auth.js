(function(){
  function readArray(key) {
  try {
    const json = localStorage.getItem(key);
    if (!json) return [];
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

  const KEYS = {
    users: "tienda.users",
    session: "tienda.session"
}

function getUser(){
  return readArray(KEYS.users);
}

function registerUser(user){
  const users = readArray(KEYS.users);
  const exists = users.some(
			(u) => (u.usuario || u.username) === user.usuario
		);
  if (exists) return { ok: false, error: "Usuario ya existe" };
  users.push({
			usuario: String(user.usuario).trim(),
			contrasena: String(user.contrasena),
			codigo: String(user.codigo).trim(),
			celular: String(user.celular).trim(),
		});
  const saved = writeArray(KEYS.users, users);
  return saved ? { ok: true } : { ok: false, error: "No se pudo guardar el usuario" };
}


function writeArray(key, arr) {
		try {
			localStorage.setItem(key, JSON.stringify(arr));
			return true;
		} catch (err) {
			console.warn("No se pudo guardar en localStorage", err);
			if (window.Toast?.show) Toast.show("No se pudo guardar en localStorage");
			return false;
		}
	}

  function validateLogin(usuario, contrasena){
    const users = readArray(KEYS.users);
    const user = users.find(
      (u) => (u.usuario || u.username) === String(usuario).trim()
    );
    if (!user) return { ok: false, error: "Usuario no existe" };
    if (user.contrasena !== String(contrasena)) return { ok: false, error: "Contraseña incorrecta" };
    return { ok: true, user };
  }

  function setSessionUser(usuario){
    try {
			localStorage.setItem(
				KEYS.session,
				JSON.stringify({ usuario: String(usuario).trim(), username: String(usuario).trim() })
			);
			return true;
		} catch {
			return false;
		}
	}

  function getCurrentUser(){
    const session = localStorage.getItem(KEYS.session);
    return session ? JSON.parse(session) : null;
  }

  function logoutUser(){
    try {
      localStorage.removeItem(KEYS.session);
      return true;
    } catch {
      return false;
    }
  }

  window.Auth = {
  registerUser,
  validateLogin,
  setSessionUser,
  getCurrentUser,
  logout: logoutUser
};

})();
