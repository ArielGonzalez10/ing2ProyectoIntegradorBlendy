/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaNegocio.IDomicilioNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 */
@RequestMapping("/domicilios")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DomicilioController {
    @Autowired
    private IDomicilioNegocio domicilioNego;
    
    @GetMapping("/buscar/{p_id_domicilio}")
    public Domicilio buscarDomicilio(@PathVariable int p_id_usuario){
        return domicilioNego.buscarDomicilioPorUsuario(p_id_usuario);
    }
    
    @PostMapping("/crear")
    public void crearDomicilio(@RequestBody Domicilio p_domicilio){
        domicilioNego.crearDomicilio(p_domicilio);
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listarDomicilio(@RequestParam String p_correoElectronico) {

        List<Domicilio> lista = domicilioNego.listarDomicilios(p_correoElectronico);

        if (lista.isEmpty()) {
            return ResponseEntity.status(404).body("No se encontraron domicilios registrados");
        }

        return ResponseEntity.ok(lista);
    }
    
    @DeleteMapping("/eliminar/{p_id_domicilio}")
    public void eliminarDomicilio(int p_id_domicilio){
        domicilioNego.eliminarDomicilio(p_id_domicilio);
    }
}
