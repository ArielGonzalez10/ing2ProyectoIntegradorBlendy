/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.VentaDetalle;
import com.ing2.blendy.capaNegocio.IVentaDetalleNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 */
@RequestMapping("/detalles")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class VentaDetalleController {
    @Autowired
    private IVentaDetalleNegocio ventaNegocio;

    @PostMapping("/crear")
    public void crearVentaDetalle(@RequestBody VentaDetalle p_venta_detalle){
        ventaNegocio.crearVentaDetalle(p_venta_detalle);
    }

    @GetMapping("/buscar/{p_id_detalle}")
    public VentaDetalle buscarVentaDetalle(@PathVariable int p_id_detalle){
        return ventaNegocio.buscarVentaDetalle(p_id_detalle);
    }
}
