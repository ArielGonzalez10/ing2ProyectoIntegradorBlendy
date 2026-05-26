package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Administrador;
import com.ing2.blendy.capaModelo.Cliente;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaModelo.Vendedor;
import org.springframework.stereotype.Component;

/*@Component*/
public class UsuarioFabrica {
    /**
    public Usuario crearUsuario(Usuario p_usuario){
        if(p_usuario == null){
            throw new RuntimeException("No hay información para registrar el usuario");
        }

        if(p_usuario instanceof Cliente){
            return this.crearCliente((Cliente) p_usuario);
        }else if(p_usuario instanceof Vendedor){
            return this.crearVendedor((Vendedor) p_usuario);
        }else if(p_usuario instanceof Administrador){
            return this.crearAdministrador((Administrador) p_usuario);
        }
        return p_usuario;
    }**/

    private Cliente crearCliente(Cliente p_cliente){
        return p_cliente;
    }

    private Vendedor crearVendedor(Vendedor p_vendedor){
        return p_vendedor;
    }

    private Administrador crearAdministrador(Administrador p_administrador){
        return p_administrador;
    }
}
