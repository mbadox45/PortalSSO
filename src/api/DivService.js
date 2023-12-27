import http from "./http-auth3";

class DivService {

    // Divisi
    getDivisi(){
        return http.get(`division`);
    }
    getDivisiID(id){
        return http.get(`division/get/${id}`);
    }
    postDivisi(data){
        return http.post(`division/add`,data);
    }
    updateDivisi(id,data){
        return http.post(`division/update/${id}`,data);
    }

    // Departemen
    getDept(){
        return http.get(`department`);
    }
    getDeptID(id){
        return http.get(`department/get/${id}`);
    }
    getDeptByDivisi(id){
        return http.get(`dept/get-division/${id}`);
    }
    postDept(data){
        return http.post(`department/add`,data);
    }
    updateDept(id,data){
        return http.post(`department/update/${id}`,data);
    }
}

export default new DivService;