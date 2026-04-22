import api from "./axios.js";

export function crearPagos(data){
    return api.post("/pagos/crear",data);
}

export function listarMetodosPagos(){
    return api.get("/metodoPagos/listar");
}