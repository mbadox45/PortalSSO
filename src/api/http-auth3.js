import { URL_API_Portal } from "./env";
import axios from "axios";

const http = axios.create({
    // baseURL:'http://localhost:8001/api/',
    baseURL: URL_API_Portal,
    headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        // 'Access-Control-Allow-Methods':'*',
    }
})

export default http;