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
 */
@Service
public class ProductoNegocio implements IProductoNegocio {
    @Override
    public List<Producto> ordenarAlfabeticamenteAsc() {
        return List.of();
    }

    @Override
    public List<Producto> ordenarAlfabeticamenteDesc() {
        return List.of();
    }

    @Override
    public List<Producto> ordenarPorPrecioAsc() {
        return List.of();
    }

    @Override
    public List<Producto> ordenarPorPrecioDesc() {
        return List.of();
    }

    @Autowired
    private IProductoDatos productoRepo;

    @Override
    public void crearProducto(Producto p_producto) {
        productoRepo.save(p_producto);
    }

    @Override
    public Producto buscarProducto(String p_descripcion) {
        return productoRepo.buscarProducto(p_descripcion);
    }

    @Override
    public void eliminarProducto(int p_id_producto) {
        productoRepo.deleteById(p_id_producto);
    }

    @Override
    public List<Producto> listarProductos() {
        return productoRepo.findAll();
    }

    
}
