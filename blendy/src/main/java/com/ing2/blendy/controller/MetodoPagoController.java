/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.controller;

import com.ing2.blendy.model.MetodoPago;
import com.ing2.blendy.service.IMetodoPagoService;
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
@RequestMapping("/metodoPago")
@RestController
public class MetodoPagoController {
    @Autowired
    private IMetodoPagoService metodoPagoServ;
    
    @GetMapping("/buscar/{p_id_metodo_pago}")
    public MetodoPago buscarMetodoPago(@PathVariable int p_id_metodo_pago){
        return metodoPagoServ.buscarMetodoPago(p_id_metodo_pago);
    }
    
    @PostMapping("/crear")
    public void crearMetodoPago(@RequestBody MetodoPago p_medotoPago){
        metodoPagoServ.crearMetodoPago(p_medotoPago);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<MetodoPago> listarMetodosPagos(){
        return metodoPagoServ.listarMetodoPagos();
    }
    
    @DeleteMapping("/eliminar/{p_id_metodo_pago}")
    public void eliminarMetodoPago(@PathVariable int p_id_metodo_pago){
        metodoPagoServ.eliminarMetodoPago(p_id_metodo_pago);
    }
}
