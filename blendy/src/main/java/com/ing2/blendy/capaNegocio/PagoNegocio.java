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
    private IPagoDatos pagoDatos;

    @Override
    public void crearPago(Pago p_pago) {
        pagoDatos.save(p_pago);
    }

    @Override
    public Pago buscarPago(int p_id_pago) {
        return pagoDatos.findById(p_id_pago).orElse(null);
    }

    @Override
    public void eliminarPago(int p_id_pago) {
        pagoDatos.deleteById(p_id_pago);
    }

    @Override
    public List<Pago> listarPagos() {
        return pagoDatos.findAll();
    }

    @Override
    public void modificarPago(Pago p_pago) {
        pagoDatos.save(p_pago);
    }
}
