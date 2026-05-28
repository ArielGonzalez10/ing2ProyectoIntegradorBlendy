/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Venta;
import com.ing2.blendy.capaNegocio.IVentaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 *
 * @author ariel
 * @author Fatima
 */
@RequestMapping("/ventas")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VentaController {
    @Autowired
    private IVentaNegocio ventaNegocio;

    @PostMapping("/crear")
    public ResponseEntity<?> crearVenta(@RequestBody Venta venta) {
        try {
            Venta nuevaVenta = ventaNegocio.crearVenta(venta);
            return ResponseEntity.ok(nuevaVenta);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<Venta> listarVentas(@RequestParam String p_correoElectronico,@RequestParam Date p_fecha){
        return ventaNegocio.listarVenta(p_correoElectronico,p_fecha);
    }

}
