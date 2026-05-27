/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Provincia;
import com.ing2.blendy.capaDatos.IProvinciaDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class ProvinciaNegocio implements IProvinciaNegocio {

    @Autowired
    private IProvinciaDatos provinciaDatos;

    @Override
    public void crearProvincia(Provincia p_provincia) {
        provinciaDatos.save(p_provincia);
    }

    @Override
    public Provincia buscarProvincia(int p_id_provincia) {
        return provinciaDatos.findById(p_id_provincia).orElse(null);
    }

    @Override
    public void eliminarProvincia(int p_id_provincia) {
        provinciaDatos.deleteById(p_id_provincia);
    }

    @Override
    public List<Provincia> listarProvincias() {
        return provinciaDatos.listarProvinciasSP();
    }

    @Override
    public void modificarProvincia(int p_id_provincia, Provincia p_provincia_modificada) {
        Provincia provBuscada = this.buscarProvincia(p_id_provincia);
        if (provBuscada != null) {
            provBuscada.setNombre(p_provincia_modificada.getNombre());
            provBuscada.setEstado(p_provincia_modificada.getEstado());
            provinciaDatos.save(provBuscada);
        } else {
            throw new RuntimeException("Error: La provincia no existe.");
        }
    }
}
