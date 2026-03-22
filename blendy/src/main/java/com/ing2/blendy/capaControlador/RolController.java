/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Rol;
import com.ing2.blendy.capaNegocio.IRolNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 *
 * @author ariel
 */
@RequestMapping("/roles")
@RestController
public class RolController {
    @Autowired
    private IRolNegocio rolNego;

    @PostMapping("/crear")
    public void crearRol(@RequestBody Rol p_rol){
        rolNego.crearRol(p_rol);
    }

    @PutMapping
    public void modificarRol(@RequestBody Rol p_rol){
        rolNego.modificarRol(p_rol);
    }

    @GetMapping("/buscar/{p_id_rol}")
    @ResponseBody
    public Rol buscarRol(@PathVariable int p_id_rol){
        return rolNego.buscarRol(p_id_rol);
    }

    @DeleteMapping("/eliminar/{p_id_rol}")
    public void eliminarRol(@PathVariable int p_id_rol){
        rolNego.eliminarRol(p_id_rol);
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<Rol> listarRoles(){
        return rolNego.listarRoles();
    }
}
