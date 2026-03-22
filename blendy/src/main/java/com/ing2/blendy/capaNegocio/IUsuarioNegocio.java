/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Usuario;
import java.util.List;

/**
 *
 * @author ariel
 */

public interface IUsuarioNegocio {
    void crearUsuario(Usuario p_usuario);
    Usuario buscarUsuario(int p_id_usuario);
    void eliminarUsuario(int p_id_usuario);
    List<Usuario> listarUsuarios();
    String iniciarSesion(String p_correoElectronico, String p_contrasenia);
    Usuario cerrarSesion();
    void modificarUsuario(int p_id_usuario,String p_nombre, String p_apellido, String p_correoElectronico, String p_contrasenia, String p_telefono, int p_estado);
}
