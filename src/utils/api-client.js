import axios from "axios";

let API_URL = import.meta.env.VITE_REST_ORIGIN

if (API_URL===undefined){
API_URL= `http://${window.location.hostname}:8080`; // Replace with your API URL pattern
}

export default axios.create({
    baseURL: `${API_URL}/api`
})