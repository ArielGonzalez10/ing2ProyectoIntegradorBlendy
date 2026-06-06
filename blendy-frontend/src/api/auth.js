import api from "./axios.js";

export function login(data){
    return api.post("/usuarios/iniciarSesion",data);
}

export function registro(data){
    return api.post("/usuarios/crear",data);
}

export function buscarUsuario(data){
    return api.get("/usuarios/buscar",{
        params:{p_correoElectronico:data}
    })
}

export function modificarUsuario({ correoElectronico, nombre, apellido, telefono }){
    return api.put("/usuarios/modificar", {}, {
        params: {
            p_correo: correoElectronico, // Mapeas tu estado al @RequestParam del back
            p_nombre: nombre,
            p_apellido: apellido,
            p_telefono: telefono
        }
    });
}