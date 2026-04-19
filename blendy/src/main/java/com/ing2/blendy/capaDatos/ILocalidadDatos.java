/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Localidad;
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
public interface ILocalidadDatos extends JpaRepository<Localidad,Integer>{
    @Query("SELECT l FROM Localidad l WHERE l.provincia.idProvincia = :p_id_provincia")
    List<Localidad> listarLocalidades(@Param("p_id_provincia") int p_id_provincia);
}
