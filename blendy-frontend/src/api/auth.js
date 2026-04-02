import api from "./axios.js";

export function login(data){
    return api.post("/usuarios/iniciarSesion",data);
}

export function registro(data){
    return api.post("/usuarios/crear",data);
}