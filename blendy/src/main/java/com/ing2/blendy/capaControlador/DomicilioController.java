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
 * @author Fatima
 */
@RequestMapping("/domicilios")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class DomicilioController {
    @Autowired
    private IDomicilioNegocio domicilioNego;
    
    @GetMapping("/buscar/{p_id_domicilio}")
    public Domicilio buscarDomicilio(@PathVariable int p_id_domicilio){
        return domicilioNego.buscarDomicilio(p_id_domicilio);
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
    public void eliminarDomicilio(@PathVariable int p_id_domicilio){
        domicilioNego.eliminarDomicilio(p_id_domicilio);
    }

    @GetMapping("/provincias/listar")
    public List<String> listarProvincias(){
        return domicilioNego.listarProvincias();
    }

    @GetMapping("/localidades/listar/{p_provincia}")
    public List<String> listarLocalidades(@PathVariable String p_provincia){
        return domicilioNego.listarLocalidades(p_provincia);
    }

    @GetMapping("/cp/listar/{p_localidad}")
    public List<Integer> listarCP(@PathVariable String p_localidad){
        return domicilioNego.listarCP(p_localidad);
    }
}
