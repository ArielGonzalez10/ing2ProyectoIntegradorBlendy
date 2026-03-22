/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Provincia;
import com.ing2.blendy.capaNegocio.IProvinciaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author ariel
 */
@RequestMapping("/provincias")
@RestController
public class ProvinciaController {

    @Autowired
    private IProvinciaNegocio provinciaNego;

    @PostMapping("/crear")
    public void crearProvincia(@RequestBody Provincia p_provincia){
        provinciaNego.crearProvincia(p_provincia);
    }

    @PutMapping("/modificar")
    public void modificarProvincia(@RequestBody Provincia p_provincia){
        provinciaNego.modificarProvincia(p_provincia);
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<Provincia> listarProvincias(){
        return provinciaNego.listarProvincias();
    }

    @GetMapping("/buscar/{p_id_provincia}")
    @ResponseBody
    public Provincia buscarProvincia(@PathVariable int p_id_provincia){
        return provinciaNego.buscarProvincia(p_id_provincia);
    }

    @DeleteMapping("/eliminar/{p_id_provincia}")
    public void eliminarProvincia(@PathVariable int p_id_provincia){
        provinciaNego.eliminarProvincia(p_id_provincia);
    }
}
