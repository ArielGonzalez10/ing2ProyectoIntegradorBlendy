/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Consulta;
import com.ing2.blendy.capaNegocio.IConsultaNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 * @author Fatima
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

    @PutMapping("/responder/{p_id_consulta}")
    public void responderConsulta(@PathVariable int p_id_consulta, @RequestBody String p_respuesta) {
        consultaNego.responderConsulta(p_id_consulta, p_respuesta);
    }
}
