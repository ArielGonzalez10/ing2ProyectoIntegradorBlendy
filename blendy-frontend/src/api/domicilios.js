import api from "./axios.js";

export function listarDomicilios(data){
    return api.get("/domicilios/listar",{
        params:{p_correoElectronico:data}
    })
}

export function crearDomicilio(data){
    return api.post("/domicilios/crear",data);
}

export function listarProvincias(){
    return api.get("domicilios/provincias/listar");
}

export function listarLocalidades(p_provincia){
    return api.get(`domicilios/localidades/listar/${p_provincia}`);
}

export function listarCP(p_localidad){
    return api.get(`domicilios/cp/listar/${p_localidad}`);
}