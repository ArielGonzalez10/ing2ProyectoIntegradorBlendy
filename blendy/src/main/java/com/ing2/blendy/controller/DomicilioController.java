/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.controller;

import com.ing2.blendy.model.Domicilio;
import com.ing2.blendy.service.IDomicilioService;
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
@RequestMapping("/domicilios")
@RestController
public class DomicilioController {
    @Autowired
    private IDomicilioService domicilioServ;
    
    @GetMapping("/buscar/{p_id_domicilio}")
    public Domicilio buscarDomicilio(@PathVariable int p_id_domicilio){
        return domicilioServ.buscarDomicilio(p_id_domicilio);
    }
    
    @PostMapping("/crear")
    public void crearDomicilio(@RequestBody Domicilio p_domicilio){
        domicilioServ.crearDomicilio(p_domicilio);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Domicilio> listarDomicilio(){
        return domicilioServ.listarDomicilios();
    }
    
    @DeleteMapping("/eliminar/{p_id_domicilio}")
    public void eliminarDomicilio(int p_id_domicilio){
        domicilioServ.eliminarDomicilio(p_id_domicilio);
    }
}
