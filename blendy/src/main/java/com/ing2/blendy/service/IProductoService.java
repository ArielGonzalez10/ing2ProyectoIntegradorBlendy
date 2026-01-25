/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Producto;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IProductoService {
    public void crearProducto(Producto p_producto);
    public Producto buscarProducto(int p_id_producto);
    public void eliminarProducto(int p_id_producto);
    public List<Producto> listarProductos();
}
