/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Categoria;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaDatos.IProductoDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class ProductoNegocio implements IProductoNegocio {

    @Autowired
    private IProductoDatos productoDatos;

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
        productoDatos.save(p_producto);
    }

    @Override
    public Producto buscarProducto(String p_descripcion) {
        return productoDatos.buscarProducto(p_descripcion);
    }

    @Override
    public void eliminarProducto(int p_id_producto, int p_nuevoEstado) {
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void altaProducto(int p_id_producto, int p_nuevoEstado) {
        productoDatos.cambiarEstadoProducto(p_id_producto,p_nuevoEstado);
    }

    @Override
    public void modificarProducto(int p_id_producto, String p_descripcion, int p_stock, int p_stockMin, double p_precioUnitario, Categoria p_categoria, int p_estado) {

    }

    @Override
    public List<Producto> listarProductos() {
        return productoDatos.findAll();
    }

    
}
