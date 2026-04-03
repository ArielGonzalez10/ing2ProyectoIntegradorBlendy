/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;

import java.util.List;

/**
 *
 * @author ariel
 */

public interface IUsuarioNegocio {
    void crearUsuario(Usuario p_usuario);
    UsuarioDTO buscarUsuario(String p_correoElectronico);
    void eliminarUsuario(int p_id_usuario);
    List<Usuario> listarUsuarios();
    TokenResponse iniciarSesion(String p_correoElectronico, String p_contrasenia);
    void modificarUsuario(UsuarioDTO p_usuario);
}
