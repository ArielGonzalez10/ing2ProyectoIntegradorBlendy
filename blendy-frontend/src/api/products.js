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

export function crearProducto(data) {
    const formData = new FormData();
    
    // Adjuntamos las variables sueltas
    formData.append("p_descripcion", data.descripcion);
    formData.append("p_precioUnitario", data.precioUnitario);
    formData.append("p_stock", data.stock);
    formData.append("p_stockMin", data.stockMin);
    formData.append("p_estado", data.estado);
    formData.append("p_id_categoria", data.idCategoria);
    
    // Adjuntamos cada string Base64 al mismo nombre de parámetro 'p_imagenes'
    data.imagenes.forEach((base64Str) => {
        formData.append("p_imagenes", base64Str);
    });

    // Enviamos el formData en el BODY del POST con el header correcto
    return api.post("/productos/crear", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export function cargarCategorias(){
    return api.get("/productos/categorias");
}


export function modificarProducto(id, datos) {
  return api.put(`/productos/modificar/${id}`, null, {
    params: {
      p_descripcion: datos.p_descripcion,    
      p_stock: datos.p_stock,                
      p_precioUnitario: datos.p_precioUnitario,
      p_estado: datos.p_estado               
    }
  });
}