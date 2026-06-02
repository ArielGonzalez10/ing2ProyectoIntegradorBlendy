/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Domicilio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IDomicilioDatos extends JpaRepository<Domicilio,Integer>{

    @Query("SELECT d FROM Domicilio d INNER JOIN d.usuario u WHERE u.correoElectronico = :p_correoElectronico")
    List<Domicilio> listarDomicilios(@Param("p_correoElectronico") String p_correoElectronico);

    @Query(value = "SELECT nombre FROM Provincia",nativeQuery = true)
    List<String>listarProvincias();

    @Query(value = "SELECT l.nombre FROM Localidad l INNER JOIN Provincia p ON l.fk_id_provincia = p.id_provincia WHERE p.nombre = :p_provincia",nativeQuery = true)
    List<String>listarLocalidades(@Param("p_provincia") String p_provincia);

    @Query(value = "SELECT codigo_postal FROM Localidad WHERE nombre = :p_localidad",nativeQuery = true)
    List<Integer>listarCP(@Param("p_localidad") String p_localidad);

    @Modifying
    @Transactional
    @Query(value = "EXEC sp_crearDomicilio :calle, :altura, :estado, :nombreLocalidad, :idUsuario", nativeQuery = true)
    void crearDomicilioSP(@Param("calle") String calle,
                              @Param("altura") int altura,
                              @Param("estado") String estado,
                              @Param("nombreLocalidad") String nombreLocalidad,
                              @Param("idUsuario") int idUsuario);
}
