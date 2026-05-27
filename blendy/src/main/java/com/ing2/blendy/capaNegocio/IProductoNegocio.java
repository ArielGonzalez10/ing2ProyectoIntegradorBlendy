/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Categoria;
import com.ing2.blendy.capaModelo.Producto;
import java.util.List;

/**
 *
 * @author ariel
 * @author Fatima
 */
public interface IProductoNegocio {
    void crearProducto(Producto p_producto);
    Producto buscarProducto(String p_descripcion);
    Producto buscarProductoPorId(int p_id_producto);
    void eliminarProducto(int p_id_producto,int p_nuevoEstado);
    void altaProducto(int p_id_producto,int p_nuevoEstado);
    void modificarProducto(int p_id_producto, Producto p_producto_modificado);
    List<Producto> listarProductos();
    List<Producto> ordenarAlfabeticamenteAsc();
    List<Producto> ordenarAlfabeticamenteDesc();
    List<Producto> ordenarPorPrecioAsc();
    List<Producto> ordenarPorPrecioDesc();
}
