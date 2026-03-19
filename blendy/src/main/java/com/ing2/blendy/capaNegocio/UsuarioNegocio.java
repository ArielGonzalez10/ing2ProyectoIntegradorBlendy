/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaDatos.IUsuarioDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class UsuarioNegocio implements IUsuarioNegocio {
    
    @Autowired
    private IUsuarioDatos usuarioRepo;

    @Override
    public void crearUsuario(Usuario p_usuario) {
        usuarioRepo.save(p_usuario);
    }

    @Override
    public Usuario buscarUsuario(int p_id_usuario) {
        return usuarioRepo.findById(p_id_usuario).orElse(null);
    }

    @Override
    public void eliminarUsuario(int p_id_usuario) {
        usuarioRepo.deleteById(p_id_usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return usuarioRepo.findAll();
    }

    
}
