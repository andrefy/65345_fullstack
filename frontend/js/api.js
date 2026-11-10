// Dirección del servidor y funciones para consultar FastAPI.
function obtenerToken() {
  return localStorage.getItem("tienda_token");
}

// Todas las peticiones usan la misma función para evitar repetir fetch y errores.
async function peticion(ruta, metodo = "GET", datos = null, formulario = false) {
  const cabeceras = {};
  let cuerpo;

  if (obtenerToken()) {
    cabeceras.Authorization = "Bearer " + obtenerToken();
  }
  if (datos !== null) {
    if (formulario) {
      cabeceras["Content-Type"] = "application/x-www-form-urlencoded";
      cuerpo = new URLSearchParams(datos);
    } else {
      cabeceras["Content-Type"] = "application/json";
      cuerpo = JSON.stringify(datos);
    }
  }

  let respuesta;
  try {
    respuesta = await fetch(API_BASE_URL + ruta, {
      method: metodo,
      headers: cabeceras,
      body: cuerpo,
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Revisa que FastAPI esté ejecutándose.");
  }

  if (respuesta.status === 204) return null;
  const resultado = await respuesta.json();
  if (!respuesta.ok) {
    let mensaje = "No se pudo completar la petición.";
    if (typeof resultado.detail === "string") {
      mensaje = resultado.detail;
    } else if (Array.isArray(resultado.detail)) {
      mensaje = "Revisa los datos del formulario.";
    }
    throw new Error(mensaje);
  }
  return resultado;
}

function peticionGet(ruta) {
  return peticion(ruta);
}

function peticionPost(ruta, datos) {
  return peticion(ruta, "POST", datos);
}

function peticionPut(ruta, datos) {
  return peticion(ruta, "PUT", datos);
}

function peticionDelete(ruta) {
  return peticion(ruta, "DELETE");
}

function peticionFormulario(ruta, datos) {
  return peticion(ruta, "POST", datos, true);
}
