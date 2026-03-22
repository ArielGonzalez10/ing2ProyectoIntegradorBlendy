/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Rol;
import com.ing2.blendy.capaDatos.IRolDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class RolNegocio implements IRolNegocio {

    @Autowired
    private IRolDatos rolDatos;

    @Override
    public void crearRol(Rol p_rol) {
        rolDatos.save(p_rol);
    }

    @Override
    public Rol buscarRol(int p_id_rol) {
        return rolDatos.findById(p_id_rol).orElse(null);
    }

    @Override
    public void eliminarRol(int p_id_rol) {
        rolDatos.deleteById(p_id_rol);
    }

    @Override
    public List<Rol> listarRoles() {
        return rolDatos.findAll();
    }

    @Override
    public void modificarRol(Rol p_rol) {
        rolDatos.save(p_rol);
    }
}
