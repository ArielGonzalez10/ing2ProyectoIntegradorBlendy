/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.controller;

import com.ing2.blendy.model.Consulta;
import com.ing2.blendy.service.IConsultaService;
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
@RequestMapping("/consultas")
@RestController
public class ConsultaController {
    
    @Autowired
    private IConsultaService consultaServ;
    
    @PostMapping("/crear")
    public void crearConsulta(@RequestBody Consulta p_consulta){
        consultaServ.crearConsulta(p_consulta);
    }
    
    @GetMapping("/buscar/{p_id_consulta}")
    public Consulta buscarConsulta(@PathVariable int p_id_consulta){
        return consultaServ.buscarConsulta(p_id_consulta);
    }
    
    @DeleteMapping("/eliminar/{p_id_consulta}")
    public void eliminarConsulta(@PathVariable int p_id_consulta){
        consultaServ.eliminarConsulta(p_id_consulta);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Consulta> listarConsultas(){
        return consultaServ.listarConsultas();
    }
}
