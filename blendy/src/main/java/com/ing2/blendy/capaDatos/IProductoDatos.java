/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Producto;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IProductoDatos extends JpaRepository<Producto,Integer>{
    //Busca un producto por el nombre
    @Query("SELECT p FROM Producto p WHERE p.descripcion = :p_descripcion")
    Producto buscarProducto(@Param("p_descripcion") String p_descripcion);

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM Producto p ORDER BY p.descripcion ASC ")
    List<Producto> ordenarAlfabeticamenteAsc();

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM Producto p ORDER BY p.descripcion Desc ")
    List<Producto> ordenarAlfabeticamenteDesc();

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM Producto p ORDER BY p.precioUnitario ASC ")
    List<Producto> ordenarPorPrecioAsc();

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM Producto p ORDER BY p.precioUnitario Desc ")
    List<Producto> ordenarPorPrecioDesc();

    //Ordena alfabeticamente la lista de productos
    @Query("SELECT p FROM Producto p WHERE p.estado = 1 ")
    List<Producto> listarProductos();

    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.estado = 0 WHERE p.idProducto = :p_id_producto")
    void eliminarProducto(@Param("p_id_producto") int p_id_producto);
}
