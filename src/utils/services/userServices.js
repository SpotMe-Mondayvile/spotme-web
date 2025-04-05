import apiClient from "../api-client";

export function signup(user){
    return apiClient.post('/v1/auth/register',user)
}

export function userLogin(creds){
    return apiClient.post('/v1/auth/authenticate',creds)
}

export function userGetInfo(){
    return apiClient.get('/v1/user/getinfo')
}
export function userGetEmail(email){
    return apiClient.get(`/v1/user/email/${email}`)
}

export function getProfile(){
    var userData;
    try{
        userData = localStorage.getItem("userProfData")
    }catch(e){
        userData = userGetInfo
        localStorage.setItem("userProfData")
        console.log("Stored User Profile")
    }
    return userData
}