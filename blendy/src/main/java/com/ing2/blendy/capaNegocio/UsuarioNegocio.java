/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaDatos.IUsuarioDatos;
import java.util.List;

import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;
import org.hibernate.annotations.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class UsuarioNegocio implements IUsuarioNegocio {

    @Autowired
    private IUsuarioDatos usuarioDatos;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public void modificarUsuario(UsuarioDTO p_usuario) {
        Usuario usuarioBusc = usuarioDatos.buscarPorCorreo(p_usuario.getCorreoElectronico());
        if ( usuarioBusc != null){
            usuarioBusc.setTelefono(p_usuario.getTelefono());
            usuarioBusc.setApellido(p_usuario.getApellido());
            usuarioBusc.setNombre(p_usuario.getNombre());
            usuarioDatos.modificarUsuario(usuarioBusc.getCorreoElectronico(),usuarioBusc.getApellido(),usuarioBusc.getNombre(),usuarioBusc.getTelefono());
        }else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public TokenResponse iniciarSesion(String p_correoElectronico, String p_contrasenia) {
        Usuario usuarioBusc = usuarioDatos.buscarPorCorreo(p_correoElectronico);

        if(!passwordEncoder.matches(p_contrasenia, usuarioBusc.getContrasenia())){
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        if(usuarioBusc.getEstado() == 0){
            throw new RuntimeException("Cuenta dada de baja!. Contactese con el administrador");
        }

        String token = jwtService.generarToken(usuarioBusc);
        return new TokenResponse(token, usuarioBusc.getCorreoElectronico(), usuarioBusc.getRol().getIdRol());
    }


    @Override
    public void crearUsuario(Usuario p_usuario) {
        //Verifica que no haya sido creado previamente
        if(usuarioDatos.existeCorreo(p_usuario.getCorreoElectronico())){
            throw new RuntimeException("Usuario registrado previamente");
        }
        //Setea el domicilio al usuario
        if(p_usuario.getDomicilios() != null){
            for(Domicilio domicilios : p_usuario.getDomicilios()){
                domicilios.setUsuario(p_usuario);
            }
        }
        //Codifica la contraseña
        p_usuario.setContrasenia(passwordEncoder.encode(p_usuario.getContrasenia()));
        usuarioDatos.save(p_usuario);
    }

    @Override
    public UsuarioDTO buscarUsuario(String p_correoElectronico) {
        Usuario usuBusc =usuarioDatos.buscarPorCorreo(p_correoElectronico);
        if(usuBusc == null){
            return null;
        }
        UsuarioDTO usuDTO = new UsuarioDTO();
        usuDTO.setApellido(usuBusc.getApellido());
        usuDTO.setNombre(usuBusc.getNombre());
        usuDTO.setCorreoElectronico(usuBusc.getCorreoElectronico());
        usuDTO.setTelefono(usuBusc.getTelefono());

        if(!usuBusc.getDomicilios().isEmpty()){
            usuDTO.setDomicilio(usuBusc.getDomicilios().getFirst().getCalle());
        }
        return usuDTO;
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
