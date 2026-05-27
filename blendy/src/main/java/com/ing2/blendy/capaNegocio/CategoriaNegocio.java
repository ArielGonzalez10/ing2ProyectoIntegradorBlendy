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
 * @author Fatima
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
    public void modificarCategoria(int p_id_categoria, Categoria p_categoria_modificada) {
        Categoria categoBusc = this.buscarCategoria(p_id_categoria);

        if (categoBusc != null) {
            categoBusc.setDescripcion(p_categoria_modificada.getDescripcion());
            categoBusc.setEstado(p_categoria_modificada.getEstado());
            categoriaDatos.save(categoBusc);
        } else {
            throw new RuntimeException("Error: La categoría que intenta modificar no existe.");
        }
    }

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaDatos.findAll();
    }
}
