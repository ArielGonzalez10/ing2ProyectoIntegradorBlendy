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

export function modificarUsuario(data){
    return api.put("/usuarios/modificar", data);
}

export function listarDomicilios(data){
    return api.get("/domicilios/listar",{
        params:{p_correoElectronico:data}
    })
}

export function listarMetodosPagos(){
    return api.get("/metodoPagos/listar");
}