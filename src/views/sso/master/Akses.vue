<script setup>

import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppService from '@/api/AppService';
import UserService from '@/api/UserService';
import AccessService from '@/api/AccessService';
import {listAkses} from '@/api/DataVariable';

const apps  = ref(null);
const users  = ref(null);
const userid = ref(null);
const akses_user = ref(null);
const loadAkses = ref(listAkses);
const respontable = ref(null);
const loadingGetAccess = ref(null)
const filters1 = ref(null);

const titleModal  = ref(null);
const displayConfirmation = ref(false);
const countries = ref([]);
// const loadProv = ref([]);
const filteredCountries = ref(null);

const toast = useToast();

const form_apps = ref({
    app_id: null,
    user_id: null,
    level_akses: null,
    akses_id:null,
    user:'',
});

const modalApps = (status,id) => {
    // console.log(status,id)
    displayConfirmation.value = true;
    loadApp();
    if (status == 'add') {
        titleModal.value = 'Add Access';
        resetForms();
    } else if (status == 'edit') {
        titleModal.value = 'Edit Access';
        console.log(id);
        form_apps.value = {
            app_id: id.app_id,
            user_id: users.value.code,
            level_akses: id.level_akses,
            akses_id: id.akses_id,
            user:users.value.name,
        }
    } else {
        titleModal.value = 'Delete Access';
        form_apps.value.app_id = id.app_id
    }
};

const closeConfirmation = () => {
    displayConfirmation.value = false;
};

const resetForms = () => {
    form_apps.value = {
        app_id: null,
        user_id: users.value.code,
        user: users.value.name,
        level_akses: null,
        akses_id:null,
    }
}

const submitData = (status) => {
    form_apps.value = {
        app_id: form_apps.value.app_id,
        user_id: form_apps.value.user_id,
        level_akses: form_apps.value.level_akses,
        akses_id: form_apps.value.akses_id,
    }
    if (status == 'add') {
        AccessService.addAccess(form_apps.value).then(res => {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully ${res}`, life: 3000 });
            loadSelected();
            closeConfirmation();
        })
    } else if (status == 'edit') {
        AccessService.updateAccess(form_apps.value.akses_id, form_apps.value).then(res => {
            console.log(res);
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            loadSelected();
            closeConfirmation();
        })
    } else {
        toast.add({ severity: 'success', summary: 'Successfully', detail: `Deleted successfully`, life: 3000 });
        closeConfirmation();
        console.log(status)
    }
}

const loadSelected = async () => {
    if (users.value.name != null) {
        userid.value = users.value.name;
        respontable.value = 'Loading ....';
        const response = await AppService.getAppByUserID(users.value.code);
        const load = response;
        if (load.length > 0) {
            const list = [];
            for (let i = 0; i < load.length; i++) {
                const app = await appID(load[i].app_id)
                if (app != null) {
                    list[i] = {
                        no: i+1,
                        akses_id: load[i].akses_id,
                        logo_app: app.logo_app,
                        app_id: load[i].app_id,
                        nama_app: app.nama_app,
                        level_akses: load[i].level_akses,
                        user_id: load[i].user_id,
                    }
                }
                // await AppService.getAppByID(load[i].app_id).then(response =>{
                //     console.log(response)
                // });
            }
            akses_user.value = list;
            console.log(list);
            respontable.value = null;
        } else {
            akses_user.value = null;
            respontable.value = 'Data not found';
        }
    }  else {
        akses_user.value = null;
        respontable.value = null;
        userid.value = null;
    }
}

const appID = async(id) => {
    let data;
    try {
        const response = await AppService.getAppByID(id);
        data = response;
    } catch (error) {
        data = null;
    }
    return data
}

const loadUser = async () => {
    await UserService.getUser().then(res => {
        const load = res;
        if (load != null) {
            const list = [];
            for (let i = 0; i < load.length; i++) {
                list[i] = {
                    name: load[i].name,
                    code: load[i].id,
                }
            }
            countries.value = list;
        } else {
            console.log('tidak ada')
        }
    })
}

const loadApp = async () => {
    await AppService.getApp().then(res => {
        const load = res;
        const data = load;
        const list = [];
        for (let i = 0; i < data.length; i++) {
            list[i] = {
                app_id: data[i].app_id,
                name: data[i].nama_app,
            }
        }
        apps.value = list;
    })
}

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

const searchCountry = (event) => {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    const filtered = [];
    const query = event.query;
    for (let i = 0; i < countries.value.length; i++) {
        const country = countries.value[i];
        if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(country);
        }
    }
    filteredCountries.value = filtered;
};

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <div class="card">
                <Toast />
                <Dialog v-model:visible="displayConfirmation" :style="{ width: '550px' }" :modal="true">
                    <template #header>
                        <h4>{{ titleModal }} <span class="ml-5 text-xl">{{loadingGetAccess}}</span></h4>
                    </template>
                    <div class="p-fluid formgrid grid" v-show="titleModal != 'Delete Access'">
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Nama</label>
                            <InputText id="email" type="text" autocomplete="off" placeholder="Nama" disabled v-model="form_apps.user"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Name App</label>
                            <Dropdown v-model="form_apps.app_id" :options="apps" optionValue="app_id" optionLabel="name" placeholder="Name App" />
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Access Level</label>
                            <Dropdown v-model="form_apps.level_akses" :options="loadAkses" optionValue="level_akses" optionLabel="name" placeholder="Access Level" />
                        </div>
                    </div>
                    <div class="p-fluid" v-show="titleModal == 'Delete Access'">
                        <span>Apakah anda ingin menghapus akses ini ? </span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text p-button-danger" />
                        <Button label="Submit" icon="pi pi-save" @click="submitData(titleModal=='Edit Access'? 'edit' : titleModal=='Add Access'? 'add':'delete')" class="p-button-text p-button-success" autofocus />
                    </template>
                </Dialog>

                <span class="p-float-label p-fluid">
                    <AutoComplete id="autocomplete" v-model="users" :suggestions="filteredCountries" @complete="searchCountry($event)" @change="loadSelected" field="name"></AutoComplete>
                    <label for="autocomplete">Select User</label>
                </span>
                <div class="grid mt-3">
                    <div class="col-12 md:col-12">
                        <h5>{{userid || 'Please select user'}}</h5>
                        <DataTable :value="akses_user" :rows="10" :paginator="true" responsiveLayout="scroll" :filters="filters1" v-model:filters="filters1">
                            <template #header>
                                <div class="flex justify-content-between flex-column sm:flex-row">
                                    <Button type="button" icon="pi pi-plus" label="Add Access" class="p-button-outlined mb-2" :disabled="userid == null ? true : false" @click="modalApps('add','')"></Button>
                                    <span class="p-input-icon-left mb-2">
                                        <i class="pi pi-search"></i>
                                        <InputText v-model="filters1['global'].value" placeholder="Keyword Search" style="width: 100%" :disabled="userid == null ? true : false" />
                                    </span>
                                </div>
                            </template>
                            <template #empty> 
                                <div class="text-center">{{respontable}}</div> 
                            </template>
                            <template #loading> Loading customers data. Please wait. </template>
                            <Column field="no" header="No" :sortable="false" style="width: 5%"></Column>
                            <Column style="width: 35%">
                                <template #header> 
                                    <div class="text-center w-full">
                                        Logo
                                    </div> 
                                </template>
                                <template #body="slotProps">
                                    <div class="text-center w-full">
                                        <img :src="slotProps.data.logo_app" :alt="slotProps.data.nama_app" width="50" class="shadow-2" />
                                    </div> 
                                </template>
                            </Column>
                            <Column field="nama_app" header="Nama App" :sortable="true" style="width: 35%"></Column>
                            <Column field="level_akses" header="Akses Level" :sortable="true" style="width: 35%"></Column>
                            <Column style="width: 20%">
                                <template #header> 
                                    <div class="text-center w-full">#</div> 
                                </template>
                                <template #body="slotProps">
                                    <div class="flex">
                                        <Button icon="pi pi-pencil" type="button" class="p-button-text p-button-warning" @click="modalApps('edit',slotProps.data)"></Button>
                                        <Button icon="pi pi-trash" type="button" class="p-button-text p-button-danger" @click="modalApps('delete',slotProps.data.akses_id)"></Button>
                                    </div>
                                </template>
                            </Column>
                        </DataTable>
                        <!-- <h6 class="text-center text-gray-400">{{respontable}}</h6> -->
                    </div>
                </div>
            </div>
        </div>
    </div>  
</template>