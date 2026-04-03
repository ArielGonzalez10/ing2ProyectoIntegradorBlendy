/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaNegocio.IUsuarioNegocio;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ing2.blendy.dto.SesionDTO;
import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<?> iniciarSesion(@RequestBody SesionDTO p_sesion) {
        try {
            TokenResponse token = usuarioNego.iniciarSesion(p_sesion.getCorreoElectronico(), p_sesion.getContrasenia());
            return ResponseEntity.ok(token);
        } catch (RuntimeException e) {
            // IMPORTANTE: Si no devuelves un ResponseEntity, el navegador bloquea el mensaje
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/buscar")
    @ResponseBody
    public UsuarioDTO buscarUsuario(@RequestParam String p_correoElectronico){
        return usuarioNego.buscarUsuario(p_correoElectronico);
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

    @PutMapping("/modificar")
    public ResponseEntity<?> modificarUsuario(@RequestBody UsuarioDTO p_usuario){
        try{
            usuarioNego.modificarUsuario(p_usuario);
            return new ResponseEntity<>("¡Datos actualizados con éxito!",HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>("No se pudo actualizar los datos!",HttpStatus.BAD_REQUEST);
        }
    }
}
