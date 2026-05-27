/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Envio;
import com.ing2.blendy.capaModelo.VentaCabecera;
import com.ing2.blendy.capaNegocio.IVentaCabeceraNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author ariel
 * @author Fatima
 */
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VentaCabeceraController {
    @Autowired
    private IVentaCabeceraNegocio ventaNegocio;

    @PostMapping("/crear")
    public ResponseEntity<?> crearVenta(@RequestBody VentaCabecera venta) {
        try {
            VentaCabecera nuevaVenta = ventaNegocio.crearVenta(venta);
            return ResponseEntity.ok(nuevaVenta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<VentaCabecera> listarVentaCabeceras(@RequestParam String p_correoElectronico){
        return ventaNegocio.listarVenta(p_correoElectronico);
    }

}
