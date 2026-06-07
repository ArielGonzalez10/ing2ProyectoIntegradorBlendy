/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaDatos.IUsuarioDatos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.ing2.blendy.capaModelo.Venta;
import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class UsuarioNegocio implements IUsuarioNegocio {
    @Autowired
    private IUsuarioDatos usuarioDatos;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void modificarUsuario(String p_correoElectronico,String p_nombre, String p_apellido, String p_telefono) {

        if(this.buscarUsuario(p_correoElectronico) != null){
            usuarioDatos.modificarUsuario(p_nombre,p_apellido,p_telefono,p_correoElectronico);
        }else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public TokenResponse iniciarSesion(String p_correoElectronico, String p_contrasenia) {
        Usuario usuarioBusc = this.buscarUsuario(p_correoElectronico);

        if(!passwordEncoder.matches(p_contrasenia, usuarioBusc.getContrasenia())){
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        if(usuarioBusc.getEstado().matches("Inactivo")){
            throw new RuntimeException("Cuenta dada de baja!. Contactese con el administrador");
        }

        String token = jwtService.generarToken(usuarioBusc);
        if(usuarioBusc.getIdRol() == 1){
            usuarioBusc.setRol("Administrador");
        }else if(usuarioBusc.getIdRol() == 2){
            usuarioBusc.setRol("Cliente");
        }else{
            usuarioBusc.setRol("Vendedor");
        }
        return new TokenResponse(token,usuarioBusc.getIdUsuario(), usuarioBusc.getCorreoElectronico(), usuarioBusc.getRol());
    }


    @Override
    public void crearUsuario(String p_correoElectronico, String p_contrasenia, String p_nombre, String p_apellido, String p_telefono, String p_estado, int p_id_rol) {
        //Verifica que no haya sido creado previamente
        if(usuarioDatos.existeCorreo(p_correoElectronico)){
            throw new RuntimeException("Usuario registrado previamente");
        }

        //Codifica la contraseña
        p_contrasenia = (passwordEncoder.encode(p_contrasenia));
        usuarioDatos.crearUsuarioSP(
                p_nombre,
                p_apellido,
                p_correoElectronico,
                p_contrasenia,
                p_telefono,
                p_estado,
                p_id_rol
        );
    }

    @Override
    public Usuario buscarUsuario(String p_correoElectronico) {
        return usuarioDatos.buscarPorCorreo(p_correoElectronico);
    }

    @Override
    public void eliminarUsuario(int p_id_usuario) {
        usuarioDatos.eliminarUsuario(p_id_usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return usuarioDatos.listarUsuarios();
    }
}
