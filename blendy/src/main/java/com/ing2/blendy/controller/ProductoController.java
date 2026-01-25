/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.controller;

import com.ing2.blendy.model.Producto;
import com.ing2.blendy.service.IProductoService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ariel
 */
@RequestMapping("/productos")
@RestController
public class ProductoController {
    @Autowired
    private IProductoService productoServ;
    
    @GetMapping("/buscar/{p_id_producto}")
    public Producto buscarProducto(@PathVariable int p_id_producto){
       return productoServ.buscarProducto(p_id_producto);
    }
    
    @PostMapping("/crear")
    public void crearProducto(@RequestBody Producto p_producto){
        productoServ.crearProducto(p_producto);
    }
    
    @DeleteMapping("/eliminar/{p_id_producto}")
    public void eliminarProducto(@PathVariable int p_id_producto){
        productoServ.eliminarProducto(p_id_producto);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Producto> listarProductos(){
        return productoServ.listarProductos();
    }
}
