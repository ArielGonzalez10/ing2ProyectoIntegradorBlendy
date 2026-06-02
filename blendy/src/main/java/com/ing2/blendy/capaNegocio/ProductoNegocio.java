/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaDatos.IProductoDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class ProductoNegocio implements IProductoNegocio {
    @Autowired
    private IProductoDatos productoDatos;

    @Override
    public List<String> listarCategorias() {
        return productoDatos.listarCategorias();
    }

    @Override
    public List<Producto> ordenarAlfabeticamenteAsc() {
        return productoDatos.ordenarAlfabeticamenteAsc();
    }

    @Override
    public List<Producto> ordenarAlfabeticamenteDesc() {
        return productoDatos.ordenarAlfabeticamenteDesc();
    }

    @Override
    public List<Producto> ordenarPorPrecioAsc() {
        return productoDatos.ordenarPorPrecioAsc();
    }

    @Override
    public List<Producto> ordenarPorPrecioDesc() {
        return productoDatos.ordenarPorPrecioDesc();
    }

    @Override
    public void crearProducto(Producto p_producto) {
        // 1. Guardamos el producto en la BD mediante JPA de forma normal
        Producto productoGuardado = productoDatos.save(p_producto);

        // 2. Si el frontend mandó strings de imágenes en la lista @Transient
        if (p_producto.getImagenes() != null && !p_producto.getImagenes().isEmpty()) {

            for (String imagen : p_producto.getImagenes()) {
                // 3. Invocamos el método de la capa de datos para cada imagen
                productoDatos.crearImagen(imagen, "Activo", productoGuardado.getIdProducto());
            }
        }
    }

    @Override
    public Producto buscarProducto(String p_descripcion) {
        return productoDatos.buscarProducto(p_descripcion);
    }

    @Override
    public Producto buscarProductoPorId(int p_id_producto) {
        return productoDatos.findById(p_id_producto).orElse(null);
    }

    @Override
    public void eliminarProducto(int p_id_producto, String p_nuevoEstado) {
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void altaProducto(int p_id_producto, String p_nuevoEstado) {
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void modificarProducto(int p_id_producto, Producto p_producto_modificado) {
        Producto productoBusc = this.buscarProductoPorId(p_id_producto);

        if(productoBusc != null){
            productoBusc.setDescripcion(p_producto_modificado.getDescripcion());
            productoBusc.setPrecioUnitario(p_producto_modificado.getPrecioUnitario());
            productoBusc.setEstado(p_producto_modificado.getEstado());
            productoBusc.setStock(p_producto_modificado.getStock());
            productoBusc.setStockMin(p_producto_modificado.getStockMin()); // Faltaba actualizar esto
            productoBusc.setCategoria(p_producto_modificado.getCategoria()); // Faltaba actualizar esto
            productoDatos.save(productoBusc);
        } else {
            throw new RuntimeException("Error: El producto que intenta modificar no existe.");
        }
    }

    @Override
    public List<Producto> listarProductos() {
        List<Producto> listaProductos =productoDatos.findAll();
        for(Producto p: listaProductos){
            p.setCategoria(productoDatos.buscarCategoria(p.getIdCategoria()));
            p.setImagenes(productoDatos.buscarImagenesProducto(p.getIdProducto()));
        }
        return listaProductos;
    }
}
