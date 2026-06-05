/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IEnvioNegocio {
    void crearEnvio(Envio p_envio);
    Envio buscarEnvio(int p_id_envio);
    void eliminarEnvio(int p_id_envio);
    List<Envio> listarEnvios(String p_correoElectronico);
    void modificarEnvio(int p_id_envio, LocalDate p_fecha_despacho, LocalDate p_fecha_recepcion);

}
