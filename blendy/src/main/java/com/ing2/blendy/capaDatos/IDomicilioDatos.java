/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Domicilio;
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
public interface IDomicilioDatos extends JpaRepository<Domicilio,Integer>{

    @Query("SELECT d FROM Domicilio d INNER JOIN d.usuario u WHERE u.correoElectronico = :p_correoElectronico")
    List<Domicilio> listarDomicilios(@Param("p_correoElectronico") String p_correoElectronico);
}
