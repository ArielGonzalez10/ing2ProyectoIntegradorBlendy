import api from "./axios.js";

export function crearVentaDetalle(data){
    return api.post("/detalles/crear",data);
}

export function crearVentaCabecera(data){
    return api.post("/ventas/crear",data);
}

export function crearEnvios(data){
    return api.post("/envios/crear",data);
}

export function crearPagos(data){
    return api.post("/pagos/crear",data);
}