/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Pago;
import com.ing2.blendy.capaDatos.IPagoDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class PagoNegocio implements IPagoNegocio {
    
    @Autowired
    private IPagoDatos pagoRepo;

    @Override
    public void crearPago(Pago p_pago) {
        pagoRepo.save(p_pago);
    }

    @Override
    public Pago buscarPago(int p_id_pago) {
        return pagoRepo.findById(p_id_pago).orElse(null);
    }

    @Override
    public void eliminarPago(int p_id_pago) {
        pagoRepo.deleteById(p_id_pago);
    }

    @Override
    public List<Pago> listarPagos() {
        return pagoRepo.findAll();
    }
    
}
