/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Rol;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IRolService {
    public void crearUsuario(Rol p_rol);
    public Rol buscarRol(int p_id_ro);
    public void eliminarRol(int p_id_rol);
    public List<Rol> listarRoles();
}
