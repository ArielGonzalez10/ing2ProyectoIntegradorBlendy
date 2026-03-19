/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaNegocio.IProductoNegocio;
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
    private IProductoNegocio productoNego;
    
    @GetMapping("/buscar/{p_descripcion}")
    public Producto buscarProducto(@PathVariable String p_descripcion){
       return productoNego.buscarProducto(p_descripcion);
    }
    
    @PostMapping("/crear")
    public void crearProducto(@RequestBody Producto p_producto){
        productoNego.crearProducto(p_producto);
    }
    
    @DeleteMapping("/eliminar/{p_id_producto}")
    public void eliminarProducto(@PathVariable int p_id_producto){
        productoNego.eliminarProducto(p_id_producto);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Producto> listarProductos(){
        return productoNego.listarProductos();
    }
}
