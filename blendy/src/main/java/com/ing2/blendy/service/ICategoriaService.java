/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Categoria;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface ICategoriaService {
    public void crearCategoria(Categoria p_categoria);
    public Categoria buscarCategoria(int p_id_categoria);
    public void eliminarCategoria(int p_id_categoria);
    public List<Categoria> listarCategorias();
}
