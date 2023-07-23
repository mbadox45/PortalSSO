<script setup>

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import UserService from '@/api/UserService';

const router = useRouter();

const payload = JSON.parse(localStorage.getItem('payload'));
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Management User', class:'font-bold', disabled:true }]);

const displayConfirmation = ref(false);
const users = ref(null);
const filters1 = ref(null);

const loadUser = () => {
    console.log(localStorage.getItem('usertoken'));
    UserService.getUser().then(res => {
        const load = res;
        if (load.length > 0) {
            const list = [];
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    no: i+1,
                    id: load[i].id,
                    nrk: load[i].nrk,
                    name: load[i].name,
                    jabatan: load[i].jabatan,
                    divisi: load[i].divisi,
                    departemen: load[i].departemen,
                }
            }
            users.value = list;
        } else {
            console.log('tidak ada')
        }
    })
}

const linkDirection = (link) => {
    router.push(link)
    // displayConfirmation.value = true;
};

const addUserDialogClose = () => {
    displayConfirmation.value = false;
};

const initFilters1 = () => {
    filters1.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
};

onBeforeMount(() => {
    initFilters1()
});

onMounted(() => {
    loadUser();
});
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-orange-100" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <h5>Table Users</h5>
                <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{width:'80rem'}" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span>Are you sure you want to proceed?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="addUserDialogClose" class="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" @click="addUserDialogClose" class="p-button-text" autofocus />
                    </template>
                </Dialog>
                <DataTable :value="users" :rows="10" :paginator="true" responsiveLayout="scroll" :filters="filters1" v-model:filters="filters1">
                    <template #header>
                        <div class="flex justify-content-between flex-column sm:flex-row">
                            <Button type="button" icon="pi pi-plus" label="Add User" class="p-button-outlined mb-2" @click="linkDirection('/add-user')"/>
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" />
                            </span>
                        </div>
                    </template>
                    <template #empty> Data not found. </template>
                    <template #loading> Loading data. Please wait. </template>
                    <Column field="no" header="No" :sortable="false" style="width: 5%"></Column>
                    <Column field="nrk" header="ID Karyawan" :sortable="true" style="width: 15%"></Column>
                    <Column field="name" header="Nama" :sortable="true" style="width: 25%"></Column>
                    <Column field="jabatan" header="Jabatan" :sortable="true" style="width: 35%"></Column>
                    <Column field="divisi" header="Divisi" :sortable="true" style="width: 35%"></Column>
                    <Column field="departemen" header="Departemen" :sortable="true" style="width: 35%"></Column>
                    <Column style="width: 20%">
                        <template #header> 
                            <div class="text-center w-full">#</div> 
                        </template>
                        <template #body="slotProps">
                            <div class="flex">
                                <Button icon="pi pi-pencil" type="button" class="p-button-text p-button-warning" @click="linkDirection(`/edit-user/${slotProps.data.id}`)"></Button>
                                <Button icon="pi pi-trash" type="button" class="p-button-text p-button-danger"></Button>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </div>
    </div>  
</template>