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
 * @author Fatima
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

    @Modifying
    @Transactional
    @Query("UPDATE Producto p SET p.estado = :p_nuevoEstado WHERE p.idProducto = :p_id_producto")
    void cambiarEstadoProducto(@Param("p_id_producto") int p_id_producto, @Param("p_nuevoEstado") String p_nuevoEstado);

    @Query(value = "SELECT descripcion FROM Categoria WHERE estado ='Activo'",nativeQuery = true)
    List<String> listarCategorias();

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO Imagen (descripcion, estado, fk_id_producto) VALUES (:descripcion, :estado, :fk_id_producto)", nativeQuery = true)
    void crearImagen(
            @Param("descripcion") String descripcion,
            @Param("estado") String estado,
            @Param("fk_id_producto") int fkIdProducto
    );

    @Query(value = "SELECT descripcion FROM Categoria WHERE id_categoria = :idCategoria", nativeQuery = true)
    String buscarCategoria(@Param("idCategoria") int idCategoria);

    @Query(value = "SELECT descripcion FROM Imagen WHERE fk_id_producto = :idProducto AND estado = 'Activo'", nativeQuery = true)
    List<String> buscarImagenesProducto(@Param("idProducto") int idProducto);

    @Modifying
    @Transactional // Requerido para operaciones de escritura (Update/Delete)
    @Query("UPDATE Producto p SET p.descripcion = :p_descripcion, p.stock = :p_stock, p.precioUnitario = :p_precioUnitario, p.estado = :p_estado WHERE p.idProducto = :p_id_producto")
    void modificarProducto(
            @Param("p_id_producto") int p_id_producto,
            @Param("p_descripcion") String p_descripcion,
            @Param("p_stock") int p_stock,
            @Param("p_precioUnitario") float p_precioUnitario,
            @Param("p_estado") String p_estado
    );

    @Transactional
    @Query(value = "INSERT INTO Producto (descripcion, precio_unitario, stock, stock_min, estado, fk_id_categoria) " +
            "OUTPUT INSERTED.id_producto, INSERTED.descripcion, INSERTED.precio_unitario, INSERTED.stock, INSERTED.stock_min, INSERTED.estado, INSERTED.fk_id_categoria " +
            "VALUES (:p_descripcion, :p_precioUnitario, :p_stock, :p_stockMin, :p_estado, :p_id_categoria)",
            nativeQuery = true)
    Producto crearProducto(
            @Param("p_descripcion") String p_descripcion,
            @Param("p_precioUnitario") float p_precioUnitario,
            @Param("p_stock") int p_stock,
            @Param("p_stockMin") int p_stockMin,
            @Param("p_estado") String p_estado,
            @Param("p_id_categoria") int p_id_categoria
    );
}
