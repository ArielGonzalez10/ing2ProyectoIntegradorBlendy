import api from "./axios.js";

export function login(data){
    return api.post("/usuarios/iniciarSesion",data);
}

export function registro(data){
    return api.post("/usuarios/crear",data);
}

export function buscarUsuario(data){
    return api.get("/usuarios/buscar",{
        params:{p_correoElectronico:data}
    })
}

export function modificarUsuario(data){
    return api.put("/usuarios/modificar", data);
}

// En tu archivo products.js:
export function verificarTurnoActivo(correo) {
    return api.get(`/usuarios/cierreTurno/estado/${correo}`);
}

export function abrirTurnoCaja(correo, p_montoInicial) {
    return api.post(`/usuarios/cierreTurno/${correo}?p_montoInicial=${p_montoInicial}`);
}

export function cerrarTurno(p_correo, p_montoDeclarado) {
    return api.put(`/usuarios/cerrarTurno/${p_correo}`, null, {
        params: { p_montoDeclarado }
    });
}