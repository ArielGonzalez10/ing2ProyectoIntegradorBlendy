/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 *
 * @author ariel
 */
@Repository
public interface IUsuarioDatos extends JpaRepository<Usuario,Integer>{
    @Query("SELECT u FROM Usuario u WHERE u.correoElectronico = :p_correoElectronico")
    Usuario buscarPorEmail(@Param("p_correoElectronico") String p_correoElectronico);
}
