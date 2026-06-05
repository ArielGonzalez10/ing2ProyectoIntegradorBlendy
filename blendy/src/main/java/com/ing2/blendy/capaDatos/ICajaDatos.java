package com.ing2.blendy.capaDatos;


import com.ing2.blendy.capaModelo.Caja;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Repository
public interface ICajaDatos extends JpaRepository<Caja,Integer> {
    @Modifying
    @Transactional
    @Query(value = "INSERT INTO caja (estado, fecha, total_venta, monto_calculado, diferencia, monto_declarado, monto_inicial, fk_id_usuario) " +
            "VALUES (:estado, :fecha, :totalVenta, :montoCalculado, :diferencia, :montoDeclarado, :montoInicial, :p_id_usuario)",nativeQuery = true)
    void crearTurno(@Param("estado") String estado,
                          @Param("fecha") LocalDate fecha,
                          @Param("totalVenta") float totalVenta,
                          @Param("montoCalculado") float montoCalculado,
                          @Param("diferencia") float diferencia,
                          @Param("montoDeclarado") float montoDeclarado,
                          @Param("montoInicial") float montoInicial,
                          @Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT c.* FROM caja c " +
            "INNER JOIN usuario u ON c.fk_id_usuario = u.id_usuario " +
            "WHERE c.fk_id_usuario = :p_id_usuario AND c.estado = 'Activo'",
            nativeQuery = true)
    Caja buscarCaja(@Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT monto_inicial FROM caja WHERE estado = 'Activo' AND id_caja = :p_id_caja" ,nativeQuery = true)
    float buscarMontoInicial(@Param("p_id_caja") int p_id_caja);

    @Modifying
    @Transactional
    @Query(value = "UPDATE caja " +
            "SET monto_calculado = :p_totalCalculado, " +
            "    diferencia = :p_diferencia, " +
            "    total_venta = :p_totalReal, " +
            "    monto_declarado = :p_montoDeclarado, " +
            "    estado = :p_estado " +
            "WHERE fk_id_usuario = :p_id_usuario AND estado = 'Activo' AND id_caja = :p_id_caja",
            nativeQuery = true)
    void cerrarTurno(
            @Param("p_id_caja") int p_id_caja,
            @Param("p_totalCalculado") float p_totalCalculado,
            @Param("p_diferencia") float p_diferencia,
            @Param("p_totalReal") float p_totalReal,
            @Param("p_montoDeclarado") float p_montoDeclarado,
            @Param("p_estado") String p_estado,
            @Param("p_id_usuario") int p_id_usuario
    );
}
