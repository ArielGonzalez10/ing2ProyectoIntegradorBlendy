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
 */
public interface IProductoNegocio {
    void crearProducto(Producto p_producto);
    Producto buscarProducto(String p_descripcion);
    void eliminarProducto(int p_id_producto);
    void modificarProducto(int p_id_producto, String p_descripcion, int p_stock, int p_stockMin, double p_precioUnitario, Categoria p_categoria, int p_estado);
    List<Producto> listarProductos();
    List<Producto> ordenarAlfabeticamenteAsc();
    List<Producto> ordenarAlfabeticamenteDesc();
    List<Producto> ordenarPorPrecioAsc();
    List<Producto> ordenarPorPrecioDesc();
}
