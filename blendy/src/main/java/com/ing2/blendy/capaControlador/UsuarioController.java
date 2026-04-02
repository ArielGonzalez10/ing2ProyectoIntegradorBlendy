/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaNegocio.IUsuarioNegocio;
import java.util.List;

import com.ing2.blendy.dto.SesionDTO;
import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author ariel
 */
@RequestMapping("/usuarios")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    @Autowired
    private IUsuarioNegocio usuarioNego;

    @PostMapping("/iniciarSesion")
    public ResponseEntity<?> iniciarSesion(@RequestBody SesionDTO p_sesion){
        String token = usuarioNego.iniciarSesion(p_sesion.getCorreoElectronico(),p_sesion.getContrasenia());
        return ResponseEntity.ok(new TokenResponse(token));
    }

    @GetMapping("/buscar/{p_id_usuario}")
    @ResponseBody
    public UsuarioDTO buscarUsuario(@PathVariable int p_id_usuario){
        return usuarioNego.buscarUsuario(p_id_usuario);
    }
    
    @PostMapping("/crear")
    public ResponseEntity<?> crearUsuario(@RequestBody Usuario p_usuario){
        try{
            usuarioNego.crearUsuario(p_usuario);
            return new ResponseEntity<>("Usuario creado con éxito", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    @DeleteMapping("/eliminar/{p_id_usuario}")
    public void eliminarUsuario(@PathVariable int p_id_usuario){
        usuarioNego.eliminarUsuario(p_id_usuario);
    }
    
    @GetMapping("/listar")
    @ResponseBody
    public List<Usuario> listarUsuarios(){
        return usuarioNego.listarUsuarios();
    }
}
