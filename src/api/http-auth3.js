import axios from "axios";

const http = axios.create({
    // baseURL:'http://localhost:8001/api/',
    baseURL:'http://36.92.181.10:4763/api/',
    headers:{
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        // 'Access-Control-Allow-Methods':'*',
    }
})

export default http;