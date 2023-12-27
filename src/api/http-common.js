import axios from "axios";
import { URL_API_Portal } from "./env";

export default axios.create({
    // baseURL:'http://localhost:8001/api/',
    baseURL: URL_API_Portal,
    headers:{
        'Content-Type': 'application/json'
    }
})