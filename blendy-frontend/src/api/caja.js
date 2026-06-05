import api from "./axios.js";
export function verificarCajaActiva(correo) {
    return api.get(`/cajas/estado/${correo}`);
}

export function abrirCaja(correo, p_montoInicial) {
    return api.post(`/cajas/crear/${correo}?p_montoInicial=${p_montoInicial}`);
}

export function cerrarCaja(p_correo, p_montoDeclarado) {
    return api.put(`/cajas/cerrarTurno/${p_correo}`, null, {
        params: { p_montoDeclarado }
    });
}