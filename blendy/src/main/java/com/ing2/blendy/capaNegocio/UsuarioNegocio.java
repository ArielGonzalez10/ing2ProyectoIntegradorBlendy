/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaDatos.IUsuarioDatos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.ing2.blendy.capaModelo.Venta;
import com.ing2.blendy.dto.TokenResponse;
import com.ing2.blendy.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class UsuarioNegocio implements IUsuarioNegocio {
    @Autowired
    private IUsuarioDatos usuarioDatos;
    @Autowired
    private IVentaNegocio ventaNego;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void cerrarTurno(String p_correo, float p_montoDeclarado) {
        float totalEfectivo = 0;
        float totalDigital = 0;
        for(Venta venta : ventaNego.listarVenta(p_correo, LocalDate.now())){
            if(venta.getPago().getIdMetodoPago() == 1){
                totalEfectivo += venta.getTotalVenta();
            }else{
                totalDigital += venta.getTotalVenta();
            }
        }
        System.out.println(totalDigital);
        System.out.println(totalEfectivo);
        float totalCalculado = totalEfectivo +usuarioDatos.obtenerMontoInicialCaja();
        float diferenciaCaja = totalCalculado - p_montoDeclarado;
        float totalReal = totalEfectivo + totalDigital;
        // En tu UsuarioNegocio.java reemplazá la línea de cierre por esta:
        usuarioDatos.cerrarTurno(
                totalCalculado,
                diferenciaCaja,
                totalReal,
                p_montoDeclarado,
                "Inactivo",
                this.buscarUsuario(p_correo).getIdUsuario()
        );
    }

    @Override
    public void modificarUsuario(UsuarioDTO p_usuario) {
        Usuario usuarioBusc = this.buscarUsuario(p_usuario.getCorreoElectronico());
        if (usuarioBusc != null){
            usuarioBusc.setTelefono(p_usuario.getTelefono());
            usuarioBusc.setApellido(p_usuario.getApellido());
            usuarioBusc.setNombre(p_usuario.getNombre());
            usuarioDatos.save(usuarioBusc);
        } else {
            throw new RuntimeException("Usuario no encontrado");
        }
    }

    @Override
    public void auditarCierre() {

    }

    @Override
    public void crearCierreTurno(String p_correo, float p_montoInicial) {

        if(this.buscarUsuario(p_correo).getIdRol() == 3){
            String estado = "Activo";
            LocalDate fecha = LocalDate.now();
            float totalVenta = 0;
            float montoCalculado = 0;
            float diferencia = 0;
            float montoDeclarado = 0;
            usuarioDatos.crearCierreTurno(estado,fecha,totalVenta,montoCalculado,diferencia,montoDeclarado,p_montoInicial,this.buscarUsuario(p_correo).getIdUsuario());
        }else{
            throw new RuntimeException("Ya existe una caja abierta");
        }
    }

    @Override
    public int buscarCierreCaja(String p_correo) {
        if (this.buscarUsuario(p_correo) == null) {
            return 0;
        }
        return usuarioDatos.buscarCierreCaja(this.buscarUsuario(p_correo).getIdUsuario());
    }

    @Override
    public TokenResponse iniciarSesion(String p_correoElectronico, String p_contrasenia) {
        Usuario usuarioBusc = this.buscarUsuario(p_correoElectronico);

        if(!passwordEncoder.matches(p_contrasenia, usuarioBusc.getContrasenia())){
            throw new RuntimeException("Email o contraseña incorrectos");
        }

        if(usuarioBusc.getEstado().matches("Inactivo")){
            throw new RuntimeException("Cuenta dada de baja!. Contactese con el administrador");
        }

        String token = jwtService.generarToken(usuarioBusc);
        if(usuarioBusc.getIdRol() == 1){
            usuarioBusc.setRol("Administrador");
        }else if(usuarioBusc.getIdRol() == 2){
            usuarioBusc.setRol("Cliente");
        }else{
            usuarioBusc.setRol("Vendedor");
        }
        return new TokenResponse(token,usuarioBusc.getIdUsuario(), usuarioBusc.getCorreoElectronico(), usuarioBusc.getRol());
    }


    @Override
    public void crearUsuario(Usuario p_usuario) {
        //Verifica que no haya sido creado previamente
        if(usuarioDatos.existeCorreo(p_usuario.getCorreoElectronico())){
            throw new RuntimeException("Usuario registrado previamente");
        }
        //Setea el domicilio al usuario
        if(p_usuario.getDomicilios() != null){
            for(Domicilio domicilios : p_usuario.getDomicilios()){
                domicilios.setUsuario(p_usuario);
            }
        }
        //Codifica la contraseña
        p_usuario.setContrasenia(passwordEncoder.encode(p_usuario.getContrasenia()));
        usuarioDatos.crearUsuarioSP(
                p_usuario.getNombre(),
                p_usuario.getApellido(),
                p_usuario.getCorreoElectronico(),
                p_usuario.getContrasenia(),
                p_usuario.getTelefono(),
                p_usuario.getEstado(),
                p_usuario.getIdRol()
        );
    }

    @Override
    public Usuario buscarUsuario(String p_correoElectronico) {
        return usuarioDatos.buscarPorCorreo(p_correoElectronico);
    }

    @Override
    public void eliminarUsuario(int p_id_usuario) {
        usuarioDatos.eliminarUsuario(p_id_usuario);
    }

    @Override
    public List<Usuario> listarUsuarios() {
        return usuarioDatos.listarUsuarios();
    }
}
