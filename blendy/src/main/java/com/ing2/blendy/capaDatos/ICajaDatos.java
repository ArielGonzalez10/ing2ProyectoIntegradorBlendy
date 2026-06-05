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
    @Query(value = "INSERT INTO cierre_turno (estado, fecha, total_venta, monto_calculado, diferencia, monto_declarado, monto_inicial, id_usuario) " +
            "VALUES (:estado, :fecha, :totalVenta, :montoCalculado, :diferencia, :montoDeclarado, :montoInicial, :p_id_usuario)",nativeQuery = true)
    void crearTurno(@Param("estado") String estado,
                          @Param("fecha") LocalDate fecha,
                          @Param("totalVenta") float totalVenta,
                          @Param("montoCalculado") float montoCalculado,
                          @Param("diferencia") float diferencia,
                          @Param("montoDeclarado") float montoDeclarado,
                          @Param("montoInicial") float montoInicial,
                          @Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT * FROM caja WHERE id_usuario = :p_id_usuario AND estado = 'Activo' ",nativeQuery = true)
    Caja buscarCaja(@Param("p_id_usuario") int p_id_usuario);

    @Query(value = "SELECT monto_inicial FROM cierre_turno WHERE estado = 'Activo' AND id_caja = :p_id_caja" ,nativeQuery = true)
    float obtenerMontoInicialCaja(@Param("p_id_caja") int p_id_caja);

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
            @Param("p_totalCalculado") float p_totalCalculado, // 1° en el SET
            @Param("p_diferencia") float p_diferencia,         // 2° en el SET
            @Param("p_totalReal") float p_totalReal,           // 3° en el SET
            @Param("p_montoDeclarado") float p_montoDeclarado, // 4° en el SET
            @Param("p_estado") String p_estado,               // 5° en el SET
            @Param("p_id_usuario") int p_id_usuario            // 6° en el WHERE
    );
}
