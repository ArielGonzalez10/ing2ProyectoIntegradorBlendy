/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Categoria;
import com.ing2.blendy.capaNegocio.ICategoriaNegocio;
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
@RequestMapping("/categorias")
@RestController
public class CategoriaController {
    @Autowired
    private ICategoriaNegocio categoriaNego;
    
    @GetMapping("/bucar/{p_id_categoria}")
    public Categoria buscarCategoria(@PathVariable int p_id_categoria){
        return categoriaNego.buscarCategoria(p_id_categoria);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Categoria> listarCategorias(){
        return categoriaNego.listarCategorias();
    }
    
    @PostMapping("/crear")
    public void crearCategoria(@RequestBody Categoria p_categoria){
        categoriaNego.crearCategoria(p_categoria);
    }
    
    @DeleteMapping("/eliminar/{p_id_categoria}")
    public void eliminarCategoria(@PathVariable int p_id_categoria){
        categoriaNego.eliminarCategoria(p_id_categoria);
    }
}
