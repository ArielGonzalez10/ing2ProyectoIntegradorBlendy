/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaDatos.IUsuarioDatos;
import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaDatos.IDomicilioDatos;
import java.util.List;

import com.ing2.blendy.capaModelo.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class DomicilioNegocio implements IDomicilioNegocio {
    
    @Autowired
    private IDomicilioDatos domicilioDatos;
    @Autowired
    private IUsuarioDatos usuarioDatos;

    @Override
    public void crearDomicilio(Domicilio p_id_domicilio) {
        Usuario usuarioBusc = usuarioDatos.buscarPorCorreo(p_id_domicilio.getUsuario().getCorreoElectronico());
        if (usuarioBusc != null){
            p_id_domicilio.setUsuario(usuarioBusc);
        }
        domicilioDatos.save(p_id_domicilio);
    }

    @Override
    public Domicilio buscarDomicilio(int p_id_domicilio) {
        return domicilioDatos.findById(p_id_domicilio).orElse(null);
    }

    @Override
    public void eliminarDomicilio(int p_id_domicilio) {
        domicilioDatos.deleteById(p_id_domicilio);
    }

    @Override
    public List<Domicilio> listarDomicilios(String p_correoElectronico) {
        return domicilioDatos.listarDomicilios(p_correoElectronico);
    }
    
}
