/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.VentaCabecera;
import com.ing2.blendy.capaNegocio.IVentaCabeceraNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 */
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VentaCabeceraController {
    @Autowired
    private IVentaCabeceraNegocio ventaNegocio;

    @PostMapping("/crear")
    public ResponseEntity<VentaCabecera> crearVentaCabecera(@RequestBody VentaCabecera p_venta_cabecera) {
        VentaCabecera nuevaCabecera = ventaNegocio.crearVentaCabecera(p_venta_cabecera);
        return ResponseEntity.ok(nuevaCabecera);
    }
}
