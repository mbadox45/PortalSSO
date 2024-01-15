import { URL_API_Portal } from "./env";

export const baseURL = URL_API_Portal;
// export const baseURL = 'http://localhost:8001/api/';

// // With Authorization
export const headerAuth = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods':'*',
    'Access-Control-Allow-Origin':'*',
    'Authorization':`Bearer ${localStorage.getItem('usertoken')}`,
}
export const headerAuthMultipart = {
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Methods':'*',
    'Authorization':`Bearer ${localStorage.getItem('usertoken')}`,
}
// Without Authorization
export const header = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods':'*',
}

// export const methodGetWithoutAuth = {
//     headers:header
// }

// export const methodGetAuth = {
//     headers:headerAuth
// }
// export const methodPostAuth = {
//     headers:headerAuth
// }