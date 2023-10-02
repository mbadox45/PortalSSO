import axios from "axios";
import { URL_API_Portal } from "./DataVariable";

const http = axios.create({
    baseURL: URL_API_Portal,
    // baseURL:'http://localhost:8001/api/',
    headers:{
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('usertoken')}`,
        'Access-Control-Allow-Methods':'*',
    }
})

// http.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('usertoken');
    
//         if (token) {
//             const tokenData = parseJwt(token);
//             const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds
    
//             if (Date.now() > expirationTime) {
//                 // Token has expired, remove it from localStorage
//                 localStorage.removeItem('usertoken');
//                 localStorage.removeItem('payload');
//                 // this.$router.push('/login');
//             } else {
//                 config.headers['Authorization'] = `Bearer ${token}`;
//             }
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
  
// // Helper function to parse JWT token and retrieve payload
// function parseJwt(token) {
//     const base64Url = token.split('.')[1];
//     const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//     const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));

//     return JSON.parse(jsonPayload);
// }

export default http;