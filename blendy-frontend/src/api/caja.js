import api from "./axios.js";

export function verificarCajaActiva(correo) {
    // Retorna la respuesta de Spring. Si viene un 200 OK con el objeto, la caja está abierta.
    return api.get(`/cajas/estado/${correo}`);
}

export function abrirCaja(correo, p_montoInicial) {
    return api.post(`/cajas/crear/${correo}?p_montoInicial=${p_montoInicial}`);
}

// En tu src/api/caja.js (ejemplo de estructura correcta)
export const cerrarCaja = (email, p_montoDeclarado, idCaja) => {
  return api.put(`/cajas/cerrarCaja/${email}`, null, {
    params: {
      p_montoDeclarado: p_montoDeclarado,
      p_id_caja: idCaja // <-- Verificá que este nombre coincida con el @RequestParam de Java
    }
  });
};