/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Provincia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IProvinciaDatos extends JpaRepository<Provincia,Integer>{
    @Query(value = "EXEC sp_listar_provincias", nativeQuery = true)
    List<Provincia> listarProvinciasSP();
}
