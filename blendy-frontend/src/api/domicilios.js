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
    return api.get("/provincias/listar");
}

export function listarLocalidades(p_id_provincia){
    return api.get(`/localidades/listar/${p_id_provincia}`);
}
