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

import java.time.LocalDate;

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
        IEnvioEstado estadoInicial = obtenerEstado(null);
        p_envio.setEstado(estadoInicial.obtenerNombreEstado());

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
    public List<Envio> listarEnvios() {
        return envioDatos.findAll();
    }

    @Override
    public void modificarEnvio(int p_id_envio, LocalDate p_fecha_despacho, LocalDate p_fecha_recepcion) {

        Envio envio_actual = envioDatos.findById(p_id_envio)
                .orElseThrow(() -> new RuntimeException("Envío no encontrado"));
        IEnvioEstado estadoActual = obtenerEstado(envio_actual.getEstado());


        if (p_fecha_despacho != null) {
            estadoActual.enviar(envio_actual, p_fecha_despacho);
        } else if (p_fecha_recepcion != null) {
            estadoActual.entregar(envio_actual, p_fecha_recepcion);
        }
        envioDatos.save(envio_actual);
    }

    private IEnvioEstado obtenerEstado(String p_estado){
        if(p_estado == null){
            return new EstadoPendiente();
        }
        switch (p_estado.trim()){
            case "En camino": return new EstadoEnCamino();
            case  "Entregado": return new EstadoEntregado();
            default: return new EstadoPendiente();
        }
    }
}
