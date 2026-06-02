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
    public List<String> listarProvincias() {
        return domicilioDatos.listarProvincias();
    }

    @Override
    public List<String> listarLocalidades(String p_provincia) {
        return domicilioDatos.listarLocalidades(p_provincia);
    }

    @Override
    public List<Integer> listarCP(String p_localidad) {
        return domicilioDatos.listarCP(p_localidad);
    }

    @Override
    public void crearDomicilio(Domicilio p_domicilio) {
        Usuario usuarioBusc = usuarioDatos.buscarPorCorreo(p_domicilio.getUsuario().getCorreoElectronico());
        if (usuarioBusc == null) {
            throw new IllegalArgumentException("El usuario con el correo provisto no existe.");
        }

        // 2. Seteamos el estado por defecto si viene vacío
        String estadoInicial = (p_domicilio.getEstado() != null) ? p_domicilio.getEstado() : "Activo";

        // 3. Delegamos el registro completo al Procedimiento Almacenado
        domicilioDatos.crearDomicilioSP(
                p_domicilio.getCalle(),
                p_domicilio.getAltura(),
                estadoInicial,
                p_domicilio.getLocalidad(),
                usuarioBusc.getIdUsuario()
        );
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
