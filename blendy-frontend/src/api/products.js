import api from "./axios.js";

export function listarProductos(){
    return api.get("/productos/listar");
}

export function eliminarProducto(id, nuevoEstado) {
    return api.delete(`/productos/eliminar/${id}/${nuevoEstado}`);
}

export function altaProducto(id, nuevoEstado) {
    return api.put(`/productos/alta/${id}/${nuevoEstado}`);
}

export function crearProducto(data){
    return api.post("/productos/crear",data);
}

export function cargarCategorias(){
    return api.get("/categorias/listar");
}