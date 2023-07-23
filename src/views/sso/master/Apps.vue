<script setup>

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppService from '@/api/AppService';

const apps  = ref(null);
const titleModal  = ref(null);
const filters1 = ref(null);
const displayConfirmation = ref(false);
const loadingGetApps = ref(null)
const files = ref(null);

const toast = useToast();
const confirmPopup = useConfirm();

const form_apps = ref({
    app_id: 0,
    nama_app:'',
    url_app:'',
    file:null,
});

// Versi Fetch API
const loadApp = () => {
    AppService.getAllApp().then(res => {
        const load = res;
        if (load != null) {
            const list = [];
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    no: i+1,
                    app_id: load[i].app_id,
                    nama_app: load[i].nama_app,
                    url_app: load[i].url_app,
                    logo_app: load[i].logo_app,
                    status_app: load[i].status_app,
                }
            }
            apps.value = list;
            console.log(list)
        } else {
            console.log('tidak ada')
        }
    })
}

const resetForms = () => {
    form_apps.value = {
        app_id: 0,
        nama_app:'',
        url_app:'',
        logo_app:'',
        file:null,
    }
}

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

const confirmPostUnpost = (event,id,status) => {
    let message, detail;
    if (status == 0) {
        message = 'Are you sure you want to post the URL?'
        detail = 'URL successfully posted'
    } else {
        message = 'Are you sure you want to unpost the URL?'
        detail = 'URL successfully unposted'
    }
    confirmPopup.require({
        target: event.target,
        message: message,
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            AppService.getPostUnpostApp(id).then(res => {
                // console.log(res);
                loadApp();
                toast.add({ severity: 'success', summary: 'Successfully', detail: `${detail} ${res}`, life: 3000 });
            })
        },
        reject: () => {
            // toast.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
            // console.log(event.currentTarget)
        }
    });
};

const modalApps = (status,id) => {
    console.log(status,id)
    displayConfirmation.value = true;
    if (status == 'add') {
        titleModal.value = 'Add Apps';
        resetForms();
    } else {
        titleModal.value = 'Edit Apps';
        loadingGetApps.value = 'Loading ...'
        AppService.getAppByID(id).then(res => {
            loadingGetApps.value = null;
            form_apps.value = {
                app_id : res.app_id,
                nama_app : res.nama_app,
                url_app: res.url_app,
                logo_app: res.logo_app,
            }
        })
    }
};

const onUpload = (event) => {
    // const file = event.files;
    const file = event.target.files;
    // form_apps.value.file = file;
    console.log(file);
}

const closeConfirmation = () => {
    displayConfirmation.value = false;
};

const submitData = (status) => {
    if (status == 'add') {
        const formData = {
            logo_app: files.value.files[0],
            nama_app: form_apps.value.nama_app,
            url_app: form_apps.value.url_app
        }
        AppService.addApp(formData).then(res => {
            const load = res.data;
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            loadApp();
            closeConfirmation()
            // if (load.code == 200) {
            // } else {
            //     toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
            //     loadApp();
            //     closeConfirmation()
            // }
        })
    } else {
        let formData = {};
        if (files.value == null) {
            formData = {
                nama_app: form_apps.value.nama_app,
                url_app: form_apps.value.url_app
            }
        } else {
            formData = {
                logo_app: files.value.files[0],
                nama_app: form_apps.value.nama_app,
                url_app: form_apps.value.url_app
            }
        }
        AppService.updateApp(form_apps.value.app_id ,formData).then(res => {
            const load = res.data;
            if (load.code == 200) {
                toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
                loadApp();
                closeConfirmation()
            } else {
                toast.add({ severity: 'warn', summary: 'Caution', detail: `Process failed`, life: 3000 });
                loadApp();
                closeConfirmation()
            }
        })
    }
}

onBeforeMount(() => {
    initFilters1()
});

const link = (links) => {
    window.open(links);
};

onMounted(() => {
    loadApp();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="card">
                <Toast />
                <Dialog v-model:visible="displayConfirmation" :style="{ width: '550px' }" :modal="true">
                    <template #header>
                        <h4>{{ titleModal }} <span class="ml-5 text-xl">{{ loadingGetApps }}</span></h4>
                    </template>
                    <div class="p-fluid formgrid grid">
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Nama App</label>
                            <InputText id="email" type="text" autocomplete="off" placeholder="Nama Aplikasi" v-model="form_apps.nama_app"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">URL</label>
                            <InputText id="email" type="text" autocomplete="off" placeholder="Example: https://github.com/" v-model="form_apps.url_app"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Logo Aplikasi</label><br>
                            <input type="file" accept="image/*" ref="files" placeholder="Logo Aplikasi" class="p-button-success py-2"/>
                            <!-- <FileUpload mode="basic" name="demo" accept="image/*" type="file" v-model="files" :maxFileSize="1000000" customUpload /> -->
                            <!-- <InputText id="email" type="file" v-model="form_apps.file"/> -->
                        </div>
                        <div class="field col-12 md:col-12" v-if="titleModal=='Edit Apps'">
                            <!-- <label for="firstname2">Gambar</label> -->
                            <!-- <img :src="form_apps.logo_app" alt="Logo App" width="50"> -->
                        </div>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text p-button-danger" />
                        <Button label="Save" icon="pi pi-save" @click="submitData(titleModal=='Edit Apps'? 'edit' : 'add')" class="p-button-text p-button-success" autofocus />
                    </template>
                </Dialog>
                <h5>List App</h5>
                <DataTable :value="apps" :rows="10" :paginator="true" responsiveLayout="scroll" :filters="filters1" v-model:filters="filters1">
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-plus" label="Add Apps" class="p-button-outlined mb-2" @click="modalApps('add','')"/>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column field="no" header="No" :sortable="false" style="width: 5%"></Column>
                    <Column field="nama_app" header="Nama App" :sortable="true" style="width: 25%"></Column>
                    <Column style="width: 15%">
                        <template #header>
                            <div class="text-center w-full">Logo</div> 
                        </template>
                        <template #body="slotProps">
                            <div class="text-center w-full">
                                <img :src="slotProps.data.logo_app" :alt="slotProps.data.nama_app" width="50" class="shadow-2" />
                            </div> 
                        </template>
                    </Column>
                    <Column style="width: 15%">
                        <template #header>
                            <div class="text-center w-full">URL</div> 
                        </template>
                        <template #body="slotProps">
                            <div class="text-center w-full">
                                <Button icon="pi pi-link" label="Link" type="button" class="p-button-text p-button-warning" :title="slotProps.data.url_app" @click="link(`https://${slotProps.data.url_app}`)"></Button>
                            </div> 
                        </template>
                    </Column>
                    <Column style="width: 25%">
                        <template #header> 
                            <div class="text-center w-full">Status</div> 
                        </template>
                        <template #body="slotProps">
                            <div class="text-center w-full">
                                <ConfirmPopup></ConfirmPopup>
                                <Chip v-if="slotProps.data.status_app == 1" :data-id="slotProps.data.app_id" label="Posted" class="cursor-pointer" icon="pi pi-window-maximize" :style="{ 'background-color': '#2196F3', color: '#ffffff' }" @click.prevent="confirmPostUnpost($event, slotProps.data.app_id, slotProps.data.status_app)"></Chip>
                                <Chip v-else label="Unposted" :data-id="slotProps.data.app_id" icon="pi pi-window-minimize" class="cursor-pointer" :style="{ 'background-color': '#E74C3C', color: '#ffffff' }" @click.prevent="confirmPostUnpost($event, slotProps.data.app_id, slotProps.data.status_app)"></Chip>
                            </div> 
                            <!-- <Button v-if="slotProps.data.status_app == 1" icon="pi pi-window-maximize" :label="'Posted'" type="button" class="p-button-text p-button-success"></Button>
                            <Button v-else icon="pi pi-window-minimize" :label="'Unposted'" type="button" class="p-button-text p-button-danger"></Button> -->
                        </template></Column>
                    <Column style="width: 20%">
                        <template #header> 
                            <div class="text-center w-full">#</div> 
                        </template>
                        <template #body="slotProps">
                            <div class="flex align-items-center justify-content-center">
                                <Button icon="pi pi-pencil" type="button" class="p-button-text p-button-warning" @click="modalApps('edit',slotProps.data.app_id)"></Button>
                                <Button icon="pi pi-trash" type="button" class="p-button-text p-button-danger"></Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>  
</template>