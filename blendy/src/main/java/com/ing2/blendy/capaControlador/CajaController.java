package com.ing2.blendy.capaControlador;

import com.ing2.blendy.capaModelo.Caja;
import com.ing2.blendy.capaNegocio.ICajaNegocio;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/cajas")
@RestController
public class CajaController {
    @Autowired
    private ICajaNegocio cajaNego;

    @PostMapping("/crear/{p_correo}")
    public void crearCaja(@PathVariable String p_correo, @RequestParam("p_montoInicial") float p_montoInicial){
        cajaNego.crearCaja(p_correo,p_montoInicial);
    }

    @GetMapping("/estado/{p_correo}")
    public ResponseEntity<Caja> buscarCaja(@PathVariable String p_correo) {
        Caja cajaActiva = cajaNego.buscarCaja(p_correo);
        if (cajaActiva == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(cajaActiva);
    }

    @PutMapping("/cerrarCaja/{p_correo}")
    public void cerrarCaja(@PathVariable String p_correo,@RequestParam float p_montoDeclarado, int p_id_caja){
        cajaNego.cerrarCaja(p_correo,p_montoDeclarado,p_id_caja);
    }
}
