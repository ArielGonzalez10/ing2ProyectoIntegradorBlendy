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

export function crearDomicilio(data){
    return api.post("/domicilios/crear",data);
}

export function listarProvincias(){
    return api.get("/provincias/listar");
}

export function listarLocalidades(p_id_provincia){
    return api.get(`/localidades/listar/${p_id_provincia}`);
}

export function listarMetodosPagos(){
    return api.get("/metodoPagos/listar");
}