import api from "./axios.js";

export function crearEnvios(data){
    return api.post("/envios/crear",data);
}

export function listarEnvios(p_correoElectronico) {
    return api.get("/envios/listar", {
        params: { p_correoElectronico } // Clave coincide con @RequestParam en Java
    });
}

export const obtenerDetallePedido = (id) => api.get(`/detalles/buscar/${id}`);
