/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Consulta;
import com.ing2.blendy.capaNegocio.IConsultaNegocio;
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
    private IConsultaNegocio consultaNego;
    
    @PostMapping("/crear")
    public void crearConsulta(@RequestBody Consulta p_consulta){
        consultaNego.crearConsulta(p_consulta);
    }
    
    @GetMapping("/buscar/{p_id_consulta}")
    public Consulta buscarConsulta(@PathVariable int p_id_consulta){return consultaNego.buscarConsulta(p_id_consulta);}
    
    @DeleteMapping("/eliminar/{p_id_consulta}")
    public void eliminarConsulta(@PathVariable int p_id_consulta){
        consultaNego.eliminarConsulta(p_id_consulta);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Consulta> listarConsultas(){
        return consultaNego.listarConsultas();
    }
}
