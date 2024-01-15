// Versi Axios
// import http from "./http-auth";

// export default new class AppService {
//     // Get Methods
//     getAllApp(){
//         return http.get('all/app');
//     }
//     getApp(){
//         return http.get('app');
//     }
//     getAppByID(id){
//         return http.get(`app/get/${id}`);
//     }
//     getPostUnpostApp(id){
//         return http.get(`app/post/${id}`);
//     }
//     getAppByAppByID(id){
//         return http.get(`/akses/app/get/${id}`);
//     }
//     getAppByUserID(id){
//         return http.get(`/akses/user/get/${id}`);
//     }

//     // Post Methods
//     addApp(data){
//         return http.post(`app/add`, data);
//     }
//     updateApp(id,data){
//         return http.post(`app/update/${id}`, data);
//     }
// }

// Versi Fetch API
import { baseURL, headerAuth, headerAuthMultipart } from "./http-auth2";
import http from "./http-auth";
import http3 from "./http-auth3";

export default new class AppService {
    getAllApp(){
        // return fetch(`${baseURL}all/app`, {
        //     headers:headerAuth
        // })
        // .then((res) => res.json())
        // .then((d) => d.data);
        return http.get('all/app');
    }
    getApp(){
        return fetch(`${baseURL}app`, {
            headers:headerAuth
        })
        .then((res) => res.json())
        .then((d) => d.data);
    }
    getAppByID(id){
        return fetch(`${baseURL}app/get/${id}`, {
            headers:headerAuth
        })
        .then((res) => res.json())
        .then((d) => d.data);
    }
    getPostUnpostApp(id){
        return fetch(`${baseURL}app/post/${id}`, {
            headers:headerAuth
        })
        .then((res) => res.json())
        .then((d) => d.data);
    }
    getAppByAppByID(id){
        return fetch(`${baseURL}akses/app/get/${id}`, {
            headers:headerAuth
        })
        .then((res) => res.json())
        .then((d) => d.data);
    }
    getAppByUserID(id){
        return fetch(`${baseURL}akses/user/get/${id}`, {
            headers:headerAuth
        })
        .then((res) => res.json())
        .then((d) => d.data);
    }

    getImage(urlImg){
        return fetch(`${urlImg}`)
        .then((res) => res.json())
        .then((d) => d.data);
    }

    // Post Methods
    addApp(data){
        // return fetch(`${baseURL}app/add`, {
        //     method: 'POST',
        //     headers:headerAuthMultipart,
        //     body: data
        // })
        // .then((res) => res.json())
        // .then((d) => d.data);
        return http3.post(`app/add`, data);
    }
    updateApp(id,data){
        // return fetch(`${baseURL}app/update/${id}`, {
        //     method: 'POST',
        //     headers:headerAuth,
        //     body: JSON.stringify(data)
        // })
        // .then((res) => res.json())
        // .then((d) => d.data);
        return http3.post(`app/update/${id}`, data);
    }
}