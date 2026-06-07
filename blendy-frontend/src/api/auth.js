import api from "./axios.js";

export function login(data){
    return api.post("/usuarios/iniciarSesion",data);
}

export function registro({correoElectronico,nombre,apellido,contrasenia,telefono,estado,idRol,imagenes}){
    return api.post("/usuarios/crear",{},{
        params: {
            p_correoElectronico:correoElectronico,
            p_nombre:nombre,
            p_apellido:apellido,
            p_contrasenia:contrasenia,
            p_telefono:telefono,
            p_estado:estado,
            p_id_rol:idRol
        }
    });
}

export function buscarUsuario(data){
    return api.get("/usuarios/buscar",{
        params:{p_correoElectronico:data}
    })
}

export function modificarUsuario({ correoElectronico, nombre, apellido, telefono }){
    return api.put("/usuarios/modificar", {}, {
        params: {
            p_correo: correoElectronico, 
            p_nombre: nombre,
            p_apellido: apellido,
            p_telefono: telefono
        }
    });
}