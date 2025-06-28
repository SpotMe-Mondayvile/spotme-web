import apiClient from "../api-client";

export function signup(routine){
    return apiClient.post('/v1/routine/register',routine)
}

export function routineAdd(routine){
    return apiClient.post('/v1/routine/add',routine)
}

export function routineGetAll(){
    return apiClient.get('/v1/routine/all')
}
export function routineGetById(rId){
    return apiClient.get(`/v1/routine/id/${rId}`)
}

export function routineDelete(rId){
    return apiClient.get(`/v1/routine/id/${rId}`)
}