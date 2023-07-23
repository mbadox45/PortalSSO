export const baseURL = 'http://36.92.181.10:4763/api/';
// export const baseURL = 'http://localhost:8001/api/';

// // With Authorization
export const headerAuth = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods':'*',
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