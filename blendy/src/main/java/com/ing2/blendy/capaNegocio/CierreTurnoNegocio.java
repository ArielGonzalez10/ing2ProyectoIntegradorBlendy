/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.CierreTurno;
import com.ing2.blendy.capaDatos.ICierreTurnoDatos;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author Fatima
 */
@Service
public class CierreTurnoNegocio implements ICierreTurnoNegocio {

    @Autowired
    private ICierreTurnoDatos cierreDatos;

    @Override
    public void iniciarCierreCaja(CierreTurno p_cierreTurno) {
        p_cierreTurno.setFechaHoraApertura(LocalDateTime.now());
        p_cierreTurno.setEstado(0);

        p_cierreTurno.setMontoCalculado(p_cierreTurno.getMontoInicial());
        cierreDatos.save(p_cierreTurno);
    }

    @Override
    public void auditarCierre(int p_id_cierre, double p_montoDeclarado) {
        CierreTurno cierreBuscado = this.buscarCierre(p_id_cierre);

        if (cierreBuscado != null) {
            cierreBuscado.setFechaHoraCierre(LocalDateTime.now());
            cierreBuscado.setMontoDeclarado(p_montoDeclarado);

            double difCalculada = p_montoDeclarado - cierreBuscado.getMontoCalculado();
            cierreBuscado.setDiferencia(difCalculada);

            cierreBuscado.setEstado(2);
            cierreDatos.save(cierreBuscado);
        } else {
            throw new RuntimeException("Error: El registro de cierre de caja no existe.");
        }
    }

    @Override
    public CierreTurno buscarCierre(int p_id_cierre) {
        return cierreDatos.findById(p_id_cierre).orElse(null);
    }

    @Override
    public List<CierreTurno> visualizarCierresGlobales() {
        return cierreDatos.findAll();
    }
}