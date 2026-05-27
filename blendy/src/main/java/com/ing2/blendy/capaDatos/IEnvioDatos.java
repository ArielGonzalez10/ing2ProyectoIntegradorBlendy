/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaModelo.Envio;
import org.springframework.data.jpa.repository.JpaRepository;
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
public interface IEnvioDatos extends JpaRepository<Envio,Integer>{

    @Query("SELECT e FROM Envio e WHERE e.venta.usuario.correoElectronico = :correo")
    List<Envio> findByCorreoUsuario(@Param("correo") String correo);

}
