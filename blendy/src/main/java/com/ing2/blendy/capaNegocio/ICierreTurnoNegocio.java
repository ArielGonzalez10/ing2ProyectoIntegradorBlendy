/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.CierreTurno;
import java.util.List;

/**
 *
 * @author Fatima
 */
public interface ICierreTurnoNegocio {
    CierreTurno iniciarCierreCaja(CierreTurno p_cierreTurno);
    void auditarCierre(int p_id_cierre, double p_montoDeclarado);
    CierreTurno buscarTurnoActivo();
    CierreTurno buscarCierre(int p_id_cierre);
    List<CierreTurno> visualizarCierresGlobales();
}
