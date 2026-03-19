/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;


import com.ing2.blendy.capaModelo.Envio;
import com.ing2.blendy.capaNegocio.IEnvioNegocio;
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
@RequestMapping("/envios")
@RestController
public class EnvioController {
    @Autowired
    private IEnvioNegocio envioNego;
    
    @GetMapping("/bucar/{p_id_envio}")
    public Envio buscarEnvio(@PathVariable int p_id_envio){
        return envioNego.buscarEnvio(p_id_envio);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Envio> listarenvios(){
        return envioNego.listarEnvios();
    }
    
    @PostMapping("/crear")
    public void crearEnvio(@RequestBody Envio p_envio){
        envioNego.crearEnvio(p_envio);
    }
    
    @DeleteMapping("/eliminar/{p_id_envio}")
    public void eliminarEnvio(@PathVariable int p_id_envio){
        envioNego.eliminarEnvio(p_id_envio);
    }
}
