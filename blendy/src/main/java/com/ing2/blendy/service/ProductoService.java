/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Producto;
import com.ing2.blendy.repository.IProductoRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class ProductoService implements IProductoService{
    
    @Autowired
    private IProductoRepository productoRepo;

    @Override
    public void crearProducto(Producto p_producto) {
        productoRepo.save(p_producto);
    }

    @Override
    public Producto buscarProducto(int p_id_producto) {
        return productoRepo.findById(p_id_producto).orElse(null);
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
