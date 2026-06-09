import api from "./axios.js";

export function crearEnvios(data){
    return api.post("/envios/crear",data);
}

export function listarEnvios(p_correoElectronico) {
    return api.get("/envios/listar", {
        params: { p_correoElectronico } // Clave coincide con @RequestParam en Java
    });
}

export function listarTodosEnvios() {
    return api.get("/envios/listar/todos");
}

export function modificarEnvio(idEnvio, fechaDespacho, fechaRecepcion) {
    return api.put(`/envios/modificar/${idEnvio}`, null, {
        params: {
            p_fecha_despacho: fechaDespacho,   
            p_fecha_recepcion: fechaRecepcion  
        }
    });
}

export const obtenerDetallePedido = (id) => api.get(`/detalles/buscar/${id}`);
