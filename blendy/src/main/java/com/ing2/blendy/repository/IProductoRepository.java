/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.repository;

import com.ing2.blendy.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IProductoRepository extends JpaRepository<Producto,Integer>{
    //Busca un producto por el nombre
    @Query("SELECT p FROM PRODUCTO p WHERE p.descripcion = :p_descripcion")
    Producto buscarProducto(@Param("p_descripcion") String p_descripcion);

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM PRODUCTO p ORDER BY p.descripcion ASC ")
    List<Producto> filtrarAlfabeticamenteAsc();

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM PRODUCTO p ORDER BY p.descripcion Desc ")
    List<Producto> filtrarAlfabeticamenteDesc();
}
