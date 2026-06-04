/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Usuario;
import com.sun.jdi.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 *
 * @author ariel
 */
@Repository
public interface IUsuarioDatos extends JpaRepository<Usuario,Integer>{
    @Query("SELECT COUNT(u) > 0 FROM Usuario u WHERE u.correoElectronico = :p_correoElectronico")
    boolean existeCorreo(@Param("p_correoElectronico") String p_correoElectronico);

    @Query("SELECT u FROM Usuario u WHERE u.correoElectronico = :p_correoElectronico")
    Usuario buscarPorCorreo(@Param("p_correoElectronico") String p_correoElectronico);

    @Modifying
    @Transactional // Importante: Los updates requieren una transacción activa
    @Query("UPDATE Usuario u SET u.estado = 'Inactivo' WHERE u.idUsuario = :p_id_usuario")
    void eliminarUsuario(@Param("p_id_usuario" )int p_id_usuario);

    @Query("SELECT u FROM Usuario u WHERE u.estado = 'Activo'")
    List<Usuario> listarUsuarios();

    @Modifying
    @Transactional
    @Query(value = "EXEC sp_crear_usuario :apellido, :contrasenia, :correoElectronico, :estado, :nombre, :telefono, :rolId", nativeQuery = true)
    void crearUsuarioSP(
            @Param("nombre") String nombre,
            @Param("apellido") String apellido,
            @Param("correoElectronico") String correoElectronico,
            @Param("contrasenia") String contrasenia,
            @Param("telefono") String telefono,
            @Param("estado") String estado,
            @Param("rolId") int rolId
    );

    @Modifying
    @Transactional // Importante: Los updates requieren una transacción activa
    @Query("UPDATE Usuario u SET u.nombre = :p_nombre, u.apellido = :p_apellido, u.telefono = :p_telefono WHERE u.correoElectronico = :p_correo")
    void modificarUsuario(@Param("p_nombre" )String p_nombre, @Param("p_apellido" )String p_apellido,@Param("p_telefono" )String p_telefono,@Param("p_correo" )String p_correo);

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO cierre_turno (estado, fecha, total_venta, monto_calculado, diferencia, monto_declarado, monto_inicial, id_usuario) " +
            "VALUES (:estado, :fecha, :totalVenta, :montoCalculado, :diferencia, :montoDeclarado, :montoInicial, :p_id_usuario)",nativeQuery = true)
    void crearCierreTurno(@Param("estado") String estado,
                               @Param("fecha") LocalDate fecha,
                               @Param("totalVenta") float totalVenta,
                               @Param("montoCalculado") float montoCalculado,
                               @Param("diferencia") float diferencia,
                               @Param("montoDeclarado") float montoDeclarado,
                               @Param("montoInicial") float montoInicial,
                               @Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT COUNT(*) FROM cierre_turno WHERE id_usuario = :p_id_usuario AND estado = 'Activo' ",nativeQuery = true)
    int buscarCierreCaja(@Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT monto_inicial FROM cierre_turno WHERE estado = 'Activo' ",nativeQuery = true)
    float obtenerMontoInicialCaja();


    @Modifying
    @Transactional
    @Query(value = "UPDATE cierre_turno " +
            "SET monto_calculado = :p_totalCalculado, " +
            "    diferencia = :p_diferencia, " +
            "    total_venta = :p_totalReal, " +
            "    monto_declarado = :p_montoDeclarado, " +
            "    estado = :p_estado " +
            "WHERE id_usuario = :p_id_usuario AND estado = 'Activo'",
            nativeQuery = true)
    void cerrarTurno(
            @Param("p_id_usuario") int p_id_usuario,
            @Param("p_totalCalculado") float p_totalCalculado,
            @Param("p_diferencia") float p_diferencia,
            @Param("p_totalReal") float p_totalReal,
            @Param("p_montoDeclarado") float p_montoDeclarado,
            @Param("p_estado") String p_estado
    );

}
