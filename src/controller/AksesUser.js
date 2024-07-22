import AppService from '@/api/AppService';
import AccessService from '@/api/AccessService';

const payload = JSON.parse(localStorage.getItem('payload'));

export const getApp = async() => {
    try {
        const response = await AppService.getApp();
        return response;
    } catch (error) {
        return null;
    }
}

export const getAllApp = async() => {
    try {
        const response = await AppService.getAllApp();
        const load = response.data;
        const data = load.data;
        return data;
    } catch (error) {
        return null;
    }
}

export const getAksesUser = async() => {
    try {
        const response = await AppService.getAppByUserID(payload.sub);
        return response;
    } catch (error) {
        return null;
    }
}

export const getAksesApps = async() => {
    try {
        let get_akses;
        if (payload.jabatan == 'super_admin') {
            get_akses = await getApp();
        } else {
            get_akses = await getAksesUser();
        }
        if (get_akses != null) {
            const get_all_app = await getAllApp()
            if (get_all_app != null) {
                const list = [];
                for (let i = 0; i < get_akses.length; i++) {
                    const app_filter = get_all_app.find(item => item.app_id == get_akses[i].app_id)
                    if (app_filter.status_app != 0) {
                        list.push({
                            "no": i+1,
                            "app_id": app_filter.app_id,
                            "nama_app": app_filter.nama_app,
                            "url_app": app_filter.url_app,
                            "logo_app": app_filter.logo_app,
                            "status_app": app_filter.status_app,
                        });
                    }
                }
                return list;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}