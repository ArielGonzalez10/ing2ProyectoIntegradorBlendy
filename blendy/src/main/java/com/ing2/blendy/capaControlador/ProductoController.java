/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Categoria;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaNegocio.IProductoNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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
    public Producto buscarProducto(@PathVariable String p_descripcion){return productoNego.buscarProducto(p_descripcion);}
    
    @PostMapping("/crear")
    public void crearProducto(@RequestBody Producto p_producto){
        productoNego.crearProducto(p_producto);
    }
    
    @DeleteMapping("/eliminar/{p_id_producto}")
    public void eliminarProducto(@PathVariable int p_id_producto){
        productoNego.eliminarProducto(p_id_producto);
    }

    @PutMapping("/modificar/{p_id_producto}")
    public void modificarProducto(@PathVariable int p_id_producto, @RequestParam String p_descripcion, @RequestParam int p_stock, @RequestParam int p_stockMin, @RequestParam double p_precioUnitario, @RequestParam Categoria p_categoria, @RequestParam int p_estado){productoNego.modificarProducto(p_id_producto,p_descripcion,p_stock,p_stockMin,p_precioUnitario,p_categoria,p_estado);}

    @GetMapping("/listar")
    @ResponseBody
    public List<Producto> listarProductos(){
        return productoNego.listarProductos();
    }

    @GetMapping("/listar/asc")
    @ResponseBody
    public List<Producto> ordenarAlfabeticamenteAsc(){return productoNego.ordenarAlfabeticamenteAsc();}

    @GetMapping("/listar/desc")
    @ResponseBody
    public List<Producto> ordenarAlfabeticamenteDesc(){return productoNego.ordenarAlfabeticamenteDesc();}

    @GetMapping("/listar/precio/asc")
    @ResponseBody
    public List<Producto> ordenarPorPrecioAsc(){return productoNego.ordenarPorPrecioAsc();}

    @GetMapping("/listar/precio/asc")
    @ResponseBody
    public List<Producto> ordenarPorPrecioDesc(){return productoNego.ordenarPorPrecioDesc();}
}
