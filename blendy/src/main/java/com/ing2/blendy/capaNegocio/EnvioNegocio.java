/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;
import com.ing2.blendy.capaDatos.IEnvioDatos;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.time.LocalDate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class EnvioNegocio implements IEnvioNegocio {

    @Autowired
    private IEnvioDatos envioDatos;

    @Override
    public void crearEnvio(Envio p_envio) {
        p_envio.setEstado("Pendiente");
        envioDatos.save(p_envio);
    }

    @Override
    public Envio buscarEnvio(int p_id_envio) {
        return envioDatos.findById(p_id_envio).orElse(null);
    }

    @Override
    public void eliminarEnvio(int p_id_envio) {
        envioDatos.deleteById(p_id_envio);
    }

    @Override
    public List<Envio> listarEnvios(String p_correoElectronico) {
        return envioDatos.findByCorreoUsuario(p_correoElectronico);
    }

    @Override
    public void modificarEnvio(int p_id_envio, LocalDate p_fecha_despacho, LocalDate p_fecha_recepcion) {
        Envio envio_actual = envioDatos.findById(p_id_envio)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));

        if (p_fecha_despacho == null && p_fecha_recepcion != null) {
            throw new RuntimeException("Error: No se puede entregar un paquete sin haberlo despachado.");
        }
        if (p_fecha_despacho != null && p_fecha_recepcion != null) {
            if (p_fecha_recepcion.isBefore(p_fecha_despacho)) {
                throw new RuntimeException("Error: La fecha de recepción debe ser mayor o igual a la de despacho.");
            }
        }

        envio_actual.setFechaDespacho(p_fecha_despacho);
        envio_actual.setFechaRecepcion(p_fecha_recepcion);
        if (p_fecha_recepcion != null) {
            envio_actual.setEstado("Entregado");
        } else if (p_fecha_despacho != null) {
            envio_actual.setEstado("Despachado");
        }
        envioDatos.save(envio_actual);
    }
    
}
