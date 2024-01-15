import http from "./http-common";

class AuthService{
    // postSignIn(data){
    //     return fetch(`${baseURL}login`, {
    //         method: 'POST',
    //         headers:headerAuth,
    //         body: JSON.stringify(data)
    //     })
    //     .then((res) => res.json())
    //     .then((d) => d.data);
    //     // return http.post(`user/add`, data);
    // }
    postSignIn(data){
        return http.post('login',data);
    }
    postForgotPassword(data){
        return http.post('password/reset',data);
    }
}

export default new AuthService;