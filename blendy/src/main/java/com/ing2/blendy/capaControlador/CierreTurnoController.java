/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.CierreTurno;
import com.ing2.blendy.capaNegocio.ICierreTurnoNegocio;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author Fatima
 */
@RequestMapping("/cierres")
@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class CierreTurnoController {

    @Autowired
    private ICierreTurnoNegocio cierreNego;

    @PostMapping("/abrir")
    public void iniciarCierreCaja(@RequestBody CierreTurno p_cierreTurno) {
        cierreNego.iniciarCierreCaja(p_cierreTurno);
    }

    @PutMapping("/auditar/{p_id_cierre}")
    public void auditarCierre(@PathVariable int p_id_cierre, @RequestParam double p_montoDeclarado) {
        cierreNego.auditarCierre(p_id_cierre, p_montoDeclarado);
    }

    @GetMapping("/listar")
    @ResponseBody
    public List<CierreTurno> visualizarCierresGlobales() {
        return cierreNego.visualizarCierresGlobales();
    }

    @GetMapping("/buscar/{p_id_cierre}")
    public CierreTurno buscarCierre(@PathVariable int p_id_cierre) {
        return cierreNego.buscarCierre(p_id_cierre);
    }
}