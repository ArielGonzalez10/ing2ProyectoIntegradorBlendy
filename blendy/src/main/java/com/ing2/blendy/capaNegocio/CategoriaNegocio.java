/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Categoria;
import com.ing2.blendy.capaDatos.ICategoriaDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class CategoriaNegocio implements ICategoriaNegocio {
    
    @Autowired
    private ICategoriaDatos categoriaDatos;

    @Override
    public void crearCategoria(Categoria p_categoria) {
        categoriaDatos.save(p_categoria);
    }

    @Override
    public Categoria buscarCategoria(int p_id_categoria) {return categoriaDatos.findById(p_id_categoria).orElse(null);}

    @Override
    public void eliminarCategoria(int p_id_categoria) {
        categoriaDatos.deleteById(p_id_categoria);
    }

    @Override
    public void modificarCategoria(int p_id_categoria, String p_descripcion, int p_estado) {
        Categoria categoBusc = this.buscarCategoria(p_id_categoria);
        categoBusc.setDescripcion(p_descripcion);
        categoBusc.setEstado(p_estado);
        categoriaDatos.save(categoBusc);
    }

    @Override
    public List<Categoria> listarCategorias() {return categoriaDatos.findAll();}
    
}
