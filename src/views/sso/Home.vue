<script setup>
import { onMounted, reactive, ref, computed, onBeforeMount } from 'vue';
import AppService from '@/api/AppService';

const listApp = ref([]);
const searchKeyword = ref('');
const layout = ref('grid');
const sortOrder = ref(null);
const sortField = ref(null);
const token = localStorage.getItem('usertoken');
const loadings = ref(true)

const loadApp = () => {
    const payload = JSON.parse(localStorage.getItem('payload'));
    console.log(token);
    if (payload.jabatan == 'super_admin') {
        AppService.getApp().then(res => {
            const list = [];
            for (let i = 0; i < res.length; i++) {
                list[i] = {
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
    return listApp.value.filter(item =>
        item.nama_app.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
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
    <div class="grid">
        <!-- <div class="col-12 lg:col-12 xl:col-12 hidden sm:block">
            <div class="card mb-0">
                <div class="flex justify-content-between items-center">
                    <div>
                        <h2 class="block text-500 font-medium mb-3">Selamat Datang di, <strong>Portal SSO</strong></h2>
                        <div class="text-900 font-medium text-xl">PT. INDUSTRI NABATI LESTARI</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-circle p-2">
                        <i class="pi pi-globe text-blue-500" style="font-size:5rem;"></i>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="col-12 lg:col-12 xl:col-12 text-center">
            <span class="p-input-icon-left w-8">
                <i class="pi pi-search" />
                <InputText v-model="searchKeyword" placeholder="Search by App name ..." size="small" style="width: 100%;"/>
            </span>
            <!-- <span>{{ filteredList.length }}</span> -->
        </div>
        <div class="col-12 lg:col-12 xl:col-12">
            <div class="col-12 lg:col-12 xl:col-12 text-center p-6" v-if="listApp.length < 1">
                <div class="flex align-items-center justify-content-center mb-3" v-if="loadings == true">
                    <div class="">
                        <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" />
                    </div>
                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                </div>
                <div v-else>
                    <p class="text-gray-500 font-semibold text-xl">- Anda belum mendapatkan akses modul aplikasi -</p>
                    <p class="text-red-600 font-semibold text-md">Silahkan hubungi tim ICT untuk mendapatkan hak akses aplikasi !</p>
                </div>
            </div>
            <DataView :value="filteredList" :layout="layout" :paginator="filteredList.length > 12 ? true : false" :rows="12" :sortOrder="sortOrder" :sortField="sortField" v-else>
                <template #grid="slotProps">
                    <div class="col-12 lg:col-3 md:col-6 sm:col-12">
                        <div class="card m-3 border-none shadow-2 bg-yellow-50">
                            <div class="flex align-items-center justify-content-between">
                                <div class="flex align-items-center">
                                    <Chip :label="slotProps.data.status_app == 1 ? 'Posted' : 'Unposted'" icon="pi pi-tag" class="bg-transparent" />
                                </div>
                                <div class="flex align-items-center">
                                    <span class="font-light text-sm ">PT. Industri Nabati Lestari</span>
                                </div>
                            </div>
                            <div class="text-center">
                                <!-- <div class="flex align-items-center justify-content-center h-12rem" style="background-color: aqua;"> -->
                                <div class="flex align-items-center justify-content-center h-6rem">
                                    <img :src="slotProps.data.logo_app" :alt="slotProps.data.nama_app" class="max-w-5rem my-3 mx-0" />
                                </div>
                                <div class="text-2xl font-semibold">{{ slotProps.data.nama_app }}</div>
                                <Divider />
                                <Button icon="pi pi-link" label="Go to app.." severity="primary" text size="small" @click="link(slotProps.data.app_id, slotProps.data.url_app)"></Button>
                            </div>
                            <div class="flex align-items-center justify-content-between text-center">
                            </div>
                        </div>
                    </div>
                </template>
            </DataView>
        </div>
        <!-- <div class="col-12 lg:col-6 xl:col-3" v-for="list in listApp" :key="list.app_id">
            <div class="card mb-0">
                <div class="flex">
                    <div class="mr-3">
                        <img :src="list.logo_app" alt="Test" width="70" height="70" />
                    </div>
                    <div class="w-full">
                        <span class="block text-500 text-2xl font-medium mb-2">{{list.nama_app}}</span>
                        <div class="text-900 font-medium text-sm">-</div>
                        <div class="text-right w-full mt-3">
                            <Chip label="Go to app.." class="bg-white text-gray-400 hover:text-blue-400 hover:bg-blue-50 ease-in-out duration-300 cursor-pointer" @click="link(list.app_id, list.url_app)"></Chip>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>
