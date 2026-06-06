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
        if(p_nuevoEstado.equals("Activo") && this.buscarProductoPorId(p_id_producto) != null){
            throw new RuntimeException("Producto existente y activo");
        }else if(p_nuevoEstado.equals("Inactivo") && this.buscarProductoPorId(p_id_producto) != null){
            throw new RuntimeException("Producto ya dado de baja previamente");
        }else if(p_nuevoEstado.isEmpty()){
            throw new RuntimeException("Ingrese datos en los campos");
        }
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void altaProducto(int p_id_producto, String p_nuevoEstado) {
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void modificarProducto(int p_id_producto, String p_descripcion, int p_stock,float p_precioUnitario, String p_estado) {
        if(this.buscarProducto(p_descripcion) == null){
            throw new RuntimeException("Producto no encontrado");
        }else if(p_stock < 0){
            throw new RuntimeException("No se puede ingresar un numero negativo");
        }else if(p_precioUnitario < 0){
            throw new RuntimeException("El valor del producto no puede ser menor a 0");
        }else if(p_descripcion.matches("\\d+") || p_descripcion.isEmpty()){
            throw new RuntimeException("Ingrese un nombre valido");
        }else if(!p_estado.equals("Activo") && !p_estado.equals("Inactivo")){
            throw new RuntimeException("Ingrese un estado valido");
        }
        productoDatos.modificarProducto(p_id_producto,p_descripcion,p_stock,p_precioUnitario,p_estado);
    }

    @Override
    public Producto modificarStock(Producto p_producto) {
        Producto productoReal = productoDatos.findById(p_producto.getIdProducto())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado ID: " + p_producto.getIdProducto()));

        int cantidadPedida = p_producto.getStock();
        if (productoReal.getStock() < cantidadPedida) {
            throw new RuntimeException("Stock insuficiente para: " + productoReal.getDescripcion());
        }

        productoReal.setStock(productoReal.getStock() - cantidadPedida);
        return productoDatos.save(productoReal);
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
