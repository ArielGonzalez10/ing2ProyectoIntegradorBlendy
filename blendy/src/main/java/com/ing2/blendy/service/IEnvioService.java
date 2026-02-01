/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Envio;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IEnvioService {
    public void crearEnvio(Envio p_envio);
    public Envio buscarEnvio(int p_id_envio);
    public void eliminarEnvio(int p_id_envio);
    public List<Envio> listarEnvios();
}
