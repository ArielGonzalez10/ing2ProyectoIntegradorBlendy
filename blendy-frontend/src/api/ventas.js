import api from "./axios.js";

export function crearVentaDetalle(data){
    return api.post("/detalles/crear",data);
}

export function crearVentaCabecera(data){
    return api.post("/ventas/crear",data);
}

export function listarVentaCabecera(p_correoElectronico){
    return api.get("/ventas/listar", {
        params: { p_correoElectronico } // Clave coincide con @RequestParam en Java
    });
}