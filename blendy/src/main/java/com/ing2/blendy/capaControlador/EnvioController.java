/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;


import com.ing2.blendy.capaModelo.Envio;
import com.ing2.blendy.capaNegocio.IEnvioNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 */
@RequestMapping("/envios")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class EnvioController {
    @Autowired
    private IEnvioNegocio envioNego;

    @PostMapping("/crear")
    public void crearEnvio(@RequestBody Envio p_envio){
        envioNego.crearEnvio(p_envio);
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<Envio> listarenvios(){
        return envioNego.listarEnvios();
    }

    @GetMapping("/bucar/{p_id_envio}")
    public Envio buscarEnvio(@PathVariable int p_id_envio){
        return envioNego.buscarEnvio(p_id_envio);
    }
    
    @DeleteMapping("/eliminar/{p_id_envio}")
    public void eliminarEnvio(@PathVariable int p_id_envio){
        envioNego.eliminarEnvio(p_id_envio);
    }
}
