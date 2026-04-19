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

// En api/products.js
export function modificarProducto(id, datos) {
  return api.put(`/productos/modificar/${id}`, null, {
    params: {
      p_descripcion: datos.p_descripcion,    // <--- Agregamos el p_ aquí
      p_stock: datos.p_stock,                // <--- Agregamos el p_ aquí
      p_precioUnitario: datos.p_precioUnitario, // <--- Agregamos el p_ aquí
      p_estado: datos.p_estado               // <--- Agregamos el p_ aquí
    }
  });
}