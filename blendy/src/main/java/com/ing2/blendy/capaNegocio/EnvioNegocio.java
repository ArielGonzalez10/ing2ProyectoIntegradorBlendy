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
        IEnvioState estadoActual = obtenerEstado(envio_actual.getEstado());

        // Si llegó fecha de despacho y antes no tenía, se activa el comportamiento del estado actual
        if (p_fecha_despacho != null && envio_actual.getFechaDespacho() == null) {
            estadoActual.enviar(envio_actual);
        }

        // Si llegó fecha de recepción y antes no tenía, se activa el comportamiento del estado actual
        if (p_fecha_recepcion != null && envio_actual.getFechaRecepcion() == null) {
            estadoActual.entregar(envio_actual);
        }
        envioDatos.save(envio_actual);
    }

    private IEnvioState obtenerEstado(String p_estado){
        if(p_estado == null){
            return new EstadoPendiente();
        }
        switch (p_estado){
            case "En camino": return new EstadoEnCamino();
            case  "Entregado": return new EstadoEntregado();
            default: return new EstadoPendiente();
        }
    }
}
