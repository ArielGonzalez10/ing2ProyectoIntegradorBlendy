/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Rol;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IRolNegocio {
    void crearRol(Rol p_rol);
    Rol buscarRol(int p_id_rol);
    void modificarRol(Rol p_rol);
    void eliminarRol(int p_id_rol);
    List<Rol> listarRoles();
}
