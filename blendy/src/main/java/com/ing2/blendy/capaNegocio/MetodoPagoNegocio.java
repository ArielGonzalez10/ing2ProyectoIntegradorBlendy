/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.MetodoPago;
import com.ing2.blendy.capaDatos.IMetodoPagoDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class MetodoPagoNegocio implements IMetodoPagoNegocio {
    
    @Autowired
    private IMetodoPagoDatos metodoPagoRepo;

    @Override
    public void crearMetodoPago(MetodoPago p_metodoPago) {
        metodoPagoRepo.save(p_metodoPago)
;    }

    @Override
    public MetodoPago buscarMetodoPago(int p_id_metodoPago) {
        return metodoPagoRepo.findById(p_id_metodoPago).orElse(null);
    }

    @Override
    public void eliminarMetodoPago(int p_id_metodoPago) {
        metodoPagoRepo.deleteById(p_id_metodoPago);
    }

    @Override
    public List<MetodoPago> listarMetodoPagos() {
        return metodoPagoRepo.findAll();
    }
    
}
