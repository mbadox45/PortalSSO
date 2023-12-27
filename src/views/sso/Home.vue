<script setup>
import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import AppService from '@/api/AppService';

const listApp = ref([]);
const searchKeyword = ref('');
const layout = ref('grid');
const sortOrder = ref(null);
const sortField = ref(null);
const payloads = JSON.parse(localStorage.getItem('payload'));
const token = localStorage.getItem('usertoken');
const loadings = ref(true)

const loadApp = () => {
    const payload = JSON.parse(localStorage.getItem('payload'));
    console.log(token);
    if (payload.jabatan == 'super_admin') {
        AppService.getApp().then(res => {
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
        AppService.getAppByUserID(payload.sub).then(async res => {
            const load = res;
            const list = [];
            for (let i = 0; i < load.length; i++) {
                await AppService.getAppByID(load[i].app_id).then(response =>{
                    list[i] = {
                        "no": i+1,
                        "logo_app": response.logo_app,
                        "app_id": load[i].app_id,
                        "nama_app": response.nama_app,
                        "url_app": response.url_app,
                        "status_app": response.status_app,
                    }
                });
            }
            if (list.length > 0) {
                listApp.value = list;
                loadings.value = false
            } else {
                listApp.value = [];
                loadings.value = false
            }
        });
    }
};

const filteredList = computed(() => {
    return listApp.value.filter(item => {
        const lowerCasedKeyword = searchKeyword.value.toLowerCase();
        return (
            item.nama_app.toLowerCase().includes(lowerCasedKeyword) || // Filter by nama_app
            // item.url_app.toLowerCase().includes(lowerCasedKeyword) ||   // Filter by url_app
            item.no.toString().includes(searchKeyword.value) 
        );
    });
});

const link = (id, links) => {
    const payload = JSON.parse(localStorage.getItem('payload'));
    console.log(`${links}/verify/${payload.sub}?token=${token}`)
    if (id == 18 || id == 19) {
        window.open(`${links}`);
    } else {
        window.open(`${links}/verify/${payload.sub}?token=${token}`);
    }
};

onBeforeMount(() => {
    // productService.getProductsSmall().then((data) => (products.value = data));
    loadApp()
});
</script>

<template>
    <div class="h-full">
        <div class="grid">
            <div class="col-12 lg:col-12 xl:col-12">
                <div class="card mb-0">
                    <div class="flex justify-content-between items-center">
                        <div>
                            <h4 class="block text-500 font-medium mb-3">{{payloads.name}}</h4>
                            <div class="text-900 font-medium text-sm">{{payloads.divisi}}</div>
                        </div>
                        <div class="flex align-items-center justify-content-center bg-blue-100 border-circle p-2">
                            <i class="pi pi-user text-blue-500" style="font-size:3rem;"></i>
                        </div>
                    </div>
                    <div class="p-fluid mt-3">
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="searchKeyword" placeholder="Search by App name ..." size="small"/>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- <DataView class="flex flex-wrap justify-content-center column-gap-6 row-gap-6" :value="filteredList" :layout="layout" :paginator="filteredList.length > 50 ? true : false" :rows="50" :sortOrder="sortOrder" :sortField="sortField">
            <template #grid="{data}">
                <div class="border-circle w-9rem h-9rem bg-primary font-bold flex align-items-center justify-content-center mx-4 my-2">{{ data.no }}</div>
            </template>
        </DataView> -->
        <div class="">
            <div class="flex flex-wrap justify-content-center column-gap-5 sm:column-gap-8 row-gap-6 p-3">
                <div v-for="(item, index) in filteredList" :key="index">
                    <div v-tooltip.bottom="{value: `<div class='text-white'><span class='text-white font-normal'>${item.nama_app}</span><br/><span class='text-sm'>${item.url_app}</span></div>`, escape: true, class: 'custom-error text-center font-light text-lg'}" class="border-1 hover:border-2 border-circle border-dotted border-gray-500 hover:border-green-500 transition-all w-9rem h-9rem hover:w-12rem hover:h-12rem shadow-2 hover:shadow-7 hover:hidden transition-duration-300 bg-gray-100 hover:bg-green-100 font-bold flex align-items-center justify-content-center cursor-pointer">
                        <img :src="item.logo_app" :alt="item.nama_app" class="max-w-5rem my-3 mx-0" />
                        <!-- {{ item.no }} -->
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
