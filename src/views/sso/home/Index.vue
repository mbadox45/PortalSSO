<script setup>
import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import AppService from '@/api/AppService';
import AppTopbar from './components/AppTopbar.vue';

const router = useRouter();
const listApp = ref([]);
const searchKeyword = ref('');
const payloads = JSON.parse(localStorage.getItem('payload'));
const token = localStorage.getItem('usertoken');
const loadings = ref(true)

const items = ref([
{
        label: 'Router',
        icon: 'pi pi-palette',
        items: [
            {
                label: 'Styled',
                route: '/theming'
            },
            {
                label: 'Unstyled',
                route: '/unstyled'
            }
        ]
    },
    {
        label: 'Programmatic',
        icon: 'pi pi-link',
        command: () => {
            router.push('/installation');
        }
    },
    {
        label: 'External',
        icon: 'pi pi-home',
        items: [
            {
                label: 'Vue.js',
                url: 'https://vuejs.org/'
            },
            {
                label: 'Vite.js',
                url: 'https://vuejs.org/'
            }
        ]
    }
]);

const loadApp = async() => {
    const payload = JSON.parse(localStorage.getItem('payload'));
    // console.log(payload);
    if (payload.jabatan == 'super_admin') {
        await AppService.getApp().then(res => {
            const list = [];
            for (let i = 0; i < res.length; i++) {
            // for (let i = 0; i < 100; i++) {
                list[i] = {
                    "no": i+1,
                    "app_id": res[i].app_id,
                    "nama_app": res[i].nama_app,
                    "url_app": res[i].url_app,
                    "logo_app": res[i].logo_app,
                    "status_app": res[i].status_app,
                }
            }
            listApp.value = list;
            console.log(list);
            loadings.value = false
        })
    } else {
        loadings.value = true
        const response = await AppService.getAppByUserID(payload.sub);
        const load = response;
        const list = [];
        for (let i = 0; i < load.length; i++) {
            const app_detail = await appID(load[i].app_id)
            if (app_detail != null) {
                if (app_detail.status_app != 0) {
                    list[i] = {
                        "no": i+1,
                        "app_id": app_detail.app_id,
                        "nama_app": app_detail.nama_app,
                        "url_app": app_detail.url_app,
                        "logo_app": app_detail.logo_app,
                        "status_app": app_detail.status_app,
                    }
                }
            }
        }
        listApp.value = list;
        loadings.value = false
    }
};

const appID = async(app_id) => {
    let data;
    try {
        const response = await AppService.getAppByID(app_id);
        data = response;
    } catch (error) {
        data = null;
    }
    return data
}

const onSettingsClick = (link) => {
    router.push(link);
};

const filteredList = computed(() => {
    return listApp.value.filter(item => {
        const lowerCasedKeyword = searchKeyword.value.toLowerCase();
        return (
            // item.nama_app.toLowerCase().includes(lowerCasedKeyword) || // Filter by nama_app
            item.no.toString().includes(searchKeyword.value) 
        );
    });
});

const link = (id, links) => {
    const payload = JSON.parse(localStorage.getItem('payload'));
    const pathSegments = new URL(links).pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    if (lastSegment == 'verify') {
        window.open(`${links}/${payload.sub}?token=${token}`);
    } else {
        window.open(`${links}`);
    }
};

onMounted(() => {
    loadApp()
});

</script>
<template>
    <div class="layout-wrapper">
        <app-topbar></app-topbar>
        <div class="layout-main-container bg-gray-100" style="background-image: url('/layout/bg6.jpg');">
            <div class="layout-main">
                <div class="card grid">
                    <div class="col-12 md:col-6">
                        <h3 class="text-yellow-600"> Hi, {{payloads.name}} </h3>
                        <span class="text-gray-500 font-semibold"> {{payloads.jabatan}} </span>
                    </div>
                    <div class="col-12 md:col-6 text-right">
                        <i class="pi pi-users text-7xl text-pink-500"></i>
                    </div>
                </div>
                <div v-show="loadings == true" class="text-center">
                    <p>Loading...</p>
                    <ProgressBar mode="indeterminate" style="height: 10px"></ProgressBar>
                </div>
                <div class="w-full relative">
                    <div class="flex flex-wrap justify-content-center column-gap-5 sm:column-gap-8 row-gap-6 p-3">
                        <div v-for="(item, index) in filteredList" :key="index">
                            <div v-tooltip.bottom="{value: `<div class='text-white'><span class='text-white font-normal'>${item.nama_app}</span></div>`, escape: true, class: 'custom-error text-center font-light text-lg'}" @click="link(item.app_id, item.url_app)" class="border-2 border-circle border-solid border-gray-300 hover:border-gray-500 transition-all w-9rem h-9rem hover:w-12rem hover:h-12rem shadow-2 hover:shadow-7 hover:hidden transition-duration-300 bg-gray-100 hover:bg-gray-200 font-bold flex align-items-center justify-content-center cursor-pointer">
                                <img :src="item.logo_app" :alt="item.nama_app" class="max-w-5rem my-3 mx-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="py-3 w-full left-0 text-center">
                <strong>Portal APPS - INL</strong> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari
            </div>
        </div>
    </div>
</template>