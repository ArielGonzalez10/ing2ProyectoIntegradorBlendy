package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaDatos.ICajaDatos;
import com.ing2.blendy.capaModelo.Caja;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaModelo.Venta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class CajaNegocio implements ICajaNegocio{
    @Autowired
    private ICajaDatos cajaDatos;

    @Autowired
    private IUsuarioNegocio usuarioNego;

    @Autowired
    private IVentaNegocio ventaNego;

    @Override
    public void crearCaja(String p_correo, float p_montoInicial) {

        if(usuarioNego.buscarUsuario(p_correo).getIdRol() == 3){
            String estado = "Activo";
            LocalDate fecha = LocalDate.now();
            float totalVenta = 0;
            float montoCalculado = 0;
            float diferencia = 0;
            float montoDeclarado = 0;
            cajaDatos.crearTurno(estado,fecha,totalVenta,montoCalculado,diferencia,montoDeclarado,p_montoInicial,usuarioNego.buscarUsuario(p_correo).getIdUsuario());
        }else{
            throw new RuntimeException("Ya existe una caja abierta");
        }
    }

    @Override
    public Caja buscarCaja(String p_correo) {
        Usuario usuario = usuarioNego.buscarUsuario(p_correo);
        if(usuario == null){
            return null;
        }
        return cajaDatos.buscarCaja(usuario.getIdUsuario());
    }

    @Override
    public void cerrarCaja(String p_correo, float p_montoDeclarado,int p_id_caja) {
        float totalEfectivo = 0;
        float totalDigital = 0;
        for(Venta venta : ventaNego.listarVenta(p_correo, LocalDate.now())){
            if(venta.getPago().getIdMetodoPago() == 1){
                totalEfectivo += venta.getTotalVenta();
            }else{
                totalDigital += venta.getTotalVenta();
            }
        }

        float totalCalculado = totalEfectivo +this.buscarMontoInicial(p_id_caja);
        float diferenciaCaja = totalCalculado - p_montoDeclarado;
        float totalReal = totalEfectivo + totalDigital;
        // En tu UsuarioNegocio.java reemplazá la línea de cierre por esta:
        cajaDatos.cerrarTurno(
                totalCalculado,
                diferenciaCaja,
                totalReal,
                p_montoDeclarado,
                "Inactivo",
                usuarioNego.buscarUsuario(p_correo).getIdUsuario()
        );
    }

    public float buscarMontoInicial(int p_id_caja){
        return cajaDatos.obtenerMontoInicialCaja(p_id_caja);
    }
}
