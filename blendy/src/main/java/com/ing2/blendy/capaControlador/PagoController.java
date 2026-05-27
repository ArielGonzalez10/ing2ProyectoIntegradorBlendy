/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Pago;
import com.ing2.blendy.capaNegocio.IPagoNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author ariel
 * @author Fatima
 */
@RequestMapping("/pagos")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class PagoController {
    @Autowired
    private IPagoNegocio pagoNego;

    @PostMapping("/crear")
    public void crearPago(@RequestBody Pago p_pago){
        pagoNego.crearPago(p_pago);
    }

    @DeleteMapping("/eliminar/{p_id_pago}")
    public void eliminarPago(@PathVariable int p_id_pago){
        pagoNego.eliminarPago(p_id_pago);
    }

    @PutMapping("/modificar/{p_id_pago}")
    public void modificarPago(@PathVariable int p_id_pago, @RequestBody Pago p_pago){
        pagoNego.modificarPago(p_id_pago, p_pago);
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<Pago> listarPagos(){
        return pagoNego.listarPagos();
    }

    @GetMapping("/buscar/{p_id_pago}")
    @ResponseBody
    public Pago buscarPago(@PathVariable int p_id_pago){
        return pagoNego.buscarPago(p_id_pago);
    }
}
