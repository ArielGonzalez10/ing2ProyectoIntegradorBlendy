import api from "./axios.js";

export function listarProductos(){
    return api.get("/productos/listar");
}

export function eliminarProducto(id) {
    return api.delete(`/productos/eliminar/${id}`);
}

export function altaProducto(id) {
    return api.put(`/productos/alta/${id}`);
}

export function crearProducto(data){
    return api.post("/productos/crear",data);
}

export function cargarCategorias(){
    return api.get("/productos/categorias");
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