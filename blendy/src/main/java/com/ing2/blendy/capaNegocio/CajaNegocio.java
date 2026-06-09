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
        this.validarDatosCierre(p_correo, p_montoDeclarado);

        float totalEfectivo = 0;
        float totalDigital = 0;
        for(Venta venta : ventaNego.listarVenta(p_correo, LocalDate.now())){
            if(venta.getPago().getIdMetodoPago() == 1){
                totalEfectivo += venta.getTotalVenta();
            }else{
                totalDigital += venta.getTotalVenta();
            }
        }
        float totalVenta = totalEfectivo + totalDigital;
        float totalCalculado = totalVenta +this.buscarMontoInicial(p_id_caja);
        float diferenciaCaja = p_montoDeclarado - totalCalculado;

        cajaDatos.cerrarTurno(
                p_id_caja,
                totalCalculado,
                diferenciaCaja,
                totalVenta,
                p_montoDeclarado,
                "Inactivo",
                usuarioNego.buscarUsuario(p_correo).getIdUsuario()
        );
    }

    @Override
    public float buscarMontoInicial(int p_id_caja){
        return cajaDatos.buscarMontoInicial(p_id_caja);
    }

    @Override
    public void validarDatosCierre(String p_correo, float p_montoInicial) {
        // 1. Validar Monto
        if (p_montoInicial <= 0) {
            throw new RuntimeException("El monto que ingresó no puede ser menor o igual a 0");
        }

        // 2. Validar Nulo o Vacío
        if (p_correo == null || p_correo.trim().isEmpty()) {
            throw new RuntimeException("El formato del correo ingresado es inválido o no contiene letras");
        }

        // 3. Validar Estructura y Letras en el Email
        String regexEstructura = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
        String parteUsuario = p_correo.split("@")[0];
        boolean usuarioEsSoloNumeros = parteUsuario.matches("^[0-9]+$");

        if (!p_correo.matches(regexEstructura) || usuarioEsSoloNumeros) {
            throw new RuntimeException("El formato del correo ingresado es inválido o no contiene letras");
        }
    }
}
