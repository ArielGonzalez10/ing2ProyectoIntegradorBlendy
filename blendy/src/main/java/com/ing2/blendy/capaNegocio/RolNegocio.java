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
 * @author Fatima
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
    public void modificarRol(int p_id_rol, Rol p_rol_modificado) {
        Rol rolBuscado = this.buscarRol(p_id_rol);

        if (rolBuscado != null) {
            rolBuscado.setDescripcion(p_rol_modificado.getDescripcion());
            rolBuscado.setEstado(p_rol_modificado.getEstado());
            rolDatos.save(rolBuscado);
        } else {
            throw new RuntimeException("Error: El rol que intenta modificar no existe.");
        }
    }
}
