/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

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
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class ProductoController {
    @Autowired
    private IProductoNegocio productoNego;
    
    @GetMapping("/buscar/{p_descripcion}")
    public Producto buscarProducto(@PathVariable String p_descripcion){return productoNego.buscarProducto(p_descripcion);}
    
    @PostMapping("/crear")
    public void crearProducto(@RequestBody Producto p_producto) {
        if(this.buscarProducto(p_producto.getDescripcion()) != null){
            throw new RuntimeException("Producto creado previamente");
        }
        productoNego.crearProducto(p_producto);
    }

    @DeleteMapping("/eliminar/{p_id_producto}")
    public void eliminarProducto(@PathVariable int p_id_producto){
        productoNego.eliminarProducto(p_id_producto, "Inactivo");
    }

    @PutMapping("/alta/{p_id_producto}")
    public void altaProducto(@PathVariable int p_id_producto){
        productoNego.altaProducto(p_id_producto, "Activo");
    }

    @PutMapping("/modificar/{p_id_producto}")
    public void modificarProducto(
            @PathVariable int p_id_producto,
            @RequestParam String p_descripcion,
            @RequestParam int p_stock,
            @RequestParam float p_precioUnitario, // Ajustá a double o BigDecimal según tu entidad
            @RequestParam String p_estado) {      // Ajustá a boolean o String según corresponda

        productoNego.modificarProducto(p_id_producto, p_descripcion, p_stock, p_precioUnitario, p_estado);
    }
    
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

    @GetMapping("/listar/precio/desc")
    @ResponseBody
    public List<Producto> ordenarPorPrecioDesc(){return productoNego.ordenarPorPrecioDesc();}

    @GetMapping("/categorias")
    @ResponseBody
    public List<String> listarCategorias(){
        return productoNego.listarCategorias();
    }
}
