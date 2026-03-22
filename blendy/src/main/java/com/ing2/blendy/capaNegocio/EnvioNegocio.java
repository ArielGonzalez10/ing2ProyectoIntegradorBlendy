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

/**
 *
 * @author ariel
 */
@Service
public class EnvioNegocio implements IEnvioNegocio {
    
    @Autowired
    private IEnvioDatos envioDatos;

    @Override
    public void crearEnvio(Envio p_envio) {
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
    public List<Envio> listarEnvios() {
        return envioDatos.findAll();
    }
    
}
