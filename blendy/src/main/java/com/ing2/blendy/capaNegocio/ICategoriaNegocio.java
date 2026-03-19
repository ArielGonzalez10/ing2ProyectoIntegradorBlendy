/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Categoria;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface ICategoriaNegocio {
    void crearCategoria(Categoria p_categoria);
    Categoria buscarCategoria(int p_id_categoria);
    void eliminarCategoria(int p_id_categoria);
    void modificarCategoria(int p_id_categoria, String p_descripcion);
    List<Categoria> listarCategorias();
}
