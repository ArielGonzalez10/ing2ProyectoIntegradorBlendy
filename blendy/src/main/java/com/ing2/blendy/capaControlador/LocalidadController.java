/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Localidad;
import com.ing2.blendy.capaNegocio.ILocalidadNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author ariel
 */
@RequestMapping("/localidades")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class LocalidadController {
    @Autowired
    private ILocalidadNegocio localidadNego;

    @GetMapping("/buscar/{p_id_localidad}")
    @ResponseBody
    public Localidad buscarLocalidad(@PathVariable int p_id_localidad){
        return localidadNego.buscarLocalidad(p_id_localidad);
    }

    @GetMapping("/listar/{p_id_provincia}")
    @ResponseBody
    public List<Localidad> listarLocalidad(@PathVariable int p_id_provincia){
        return localidadNego.listarLocalidades(p_id_provincia);
    }
}
