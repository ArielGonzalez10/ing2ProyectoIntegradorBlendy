/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.MetodoPago;
import com.ing2.blendy.capaNegocio.IMetodoPagoNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author ariel
 */
@RequestMapping("/metodoPagos")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class MetodoPagoController {
    @Autowired
    private IMetodoPagoNegocio metodoPagoNego;
    
    @GetMapping("/buscar/{p_id_metodo_pago}")
    public MetodoPago buscarMetodoPago(@PathVariable int p_id_metodo_pago){
        return metodoPagoNego.buscarMetodoPago(p_id_metodo_pago);
    }
    
    @PostMapping("/crear")
    public void crearMetodoPago(@RequestBody MetodoPago p_medotoPago){
        metodoPagoNego.crearMetodoPago(p_medotoPago);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<MetodoPago> listarMetodosPagos(){
        return metodoPagoNego.listarMetodoPagos();
    }
    
    @DeleteMapping("/eliminar/{p_id_metodo_pago}")
    public void eliminarMetodoPago(@PathVariable int p_id_metodo_pago){
        metodoPagoNego.eliminarMetodoPago(p_id_metodo_pago);
    }
}
