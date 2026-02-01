/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Categoria;
import com.ing2.blendy.repository.ICategoriaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class CategoriaService implements ICategoriaService{
    
    @Autowired
    private ICategoriaRepository categoriaRepo;

    @Override
    public void crearCategoria(Categoria p_categoria) {
        categoriaRepo.save(p_categoria);
    }

    @Override
    public Categoria buscarCategoria(int p_id_categoria) {
        return categoriaRepo.findById(p_id_categoria).orElse(null);
    }

    @Override
    public void eliminarCategoria(int p_id_categoria) {
        categoriaRepo.deleteById(p_id_categoria);
    }

    @Override
    public List<Categoria> listarCategorias() {
        return categoriaRepo.findAll();
    }
    
}
