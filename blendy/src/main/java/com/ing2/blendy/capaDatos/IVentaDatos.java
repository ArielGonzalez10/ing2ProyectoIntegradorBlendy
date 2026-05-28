/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IVentaDatos extends JpaRepository<Venta,Integer>{
    @Query("SELECT e FROM Venta e INNER JOIN e.usuario u WHERE u.correoElectronico = :p_correoElectronico AND e.fecha = :p_fecha")
    List<Venta> listarVentas(@Param("p_correoElectronico") String p_correoElectronico, @Param("p_fecha") Date p_fecha);
}
