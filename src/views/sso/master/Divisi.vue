<script setup>

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

// API
import DivService from '@/api/DivService';
import UserService from '@/api/UserService';

// Component
import DialogDepartemen from './components/DialogDepartemen.vue';

const apps  = ref(null);
const user_list  = ref(null);
const expandedRows = ref([]);
const titleModal  = ref(null);
const filters1 = ref(null);
const displayConfirmation = ref(false);
const loadingGetApps = ref(null)

const dialogs = ref(false);
const datadialog = ref(null);
const nomordialog = ref(null);
const titledialogs = ref(null);
const status_form = ref('add');

const toast = useToast();
const confirmPopup = useConfirm();

const form_apps = ref({
    id: null,
    divisi:'',
    bom:null,
    kode:'',
});

// Versi Fetch API
const loadApp = async () => {
    try {
        const divisi = await DivService.getDivisi();
        const response = divisi.data;
        const data = response.data;
        const list =[];
        for (let i = 0; i < data.length; i++) {
            const user = await UserService.getUserID(data[i].bom);
            list[i] = {
                no: i+1,
                id: data[i].id,
                divisi: data[i].divisi,
                status: data[i].status,
                bom: data[i].bom,
                name_bom: user.name,
                departments: data[i].departments,
            }
        }
        apps.value = list;
    } catch (error) {
        console.error('Error fetching data:', error);
        apps.value = [];
    }
}

// Versi Fetch API
const loadUser = async () => {
    try {
        const user = await UserService.getUser();
        // console.log(user);
        const list =[];
        for (let i = 0; i < user.length; i++) {
            if (user[i].grade === '5' || user[i].grade === '6' || user[i].grade === '13') {
                list.push({
                    no: i+1,
                    bom: user[i].id,
                    name: user[i].name + ' - '+ user[i].jabatan,
                })
            }
        }
        // console.log(list)
        user_list.value = list;
    } catch (error) {
        console.error('Error fetching data:', error);
        user_list.value = [];
    }
}

const resetForms = () => {
    status_form.value = 'add';
    form_apps.value = {
        id: null,
        divisi:'',
        bom:null,
        kode:'',
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
            DivService.getPostUnpostApp(id).then(res => {
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

const modalApps = (status,data) => {
    console.log(status,data)
    displayConfirmation.value = true;
    status_form.value = status
    if (status === 'add') {
        titleModal.value = 'Add Divisi';
        resetForms();
        loadUser();
    } else {
        titleModal.value = 'Edit Divisi';
        loadUser();
        form_apps.value = {
            id: data.id,
            divisi: data.divisi,
            bom: data.bom,
        }
    }
};

const dialogApps = (data) => {
    dialogs.value = true;
    datadialog.value = data.departments;
    nomordialog.value = data.id;
    titledialogs.value = `DIVISI <i class="pi pi-angle-double-right mx-2"></i> <strong>${data.divisi}</strong>`;
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

const submitData = () => {
    if (status_form === 'add') {
        const formData = {
            kode: form_apps.value.kode,
            divisi: form_apps.value.divisi,
            bom: form_apps.value.bom
        }
        DivService.postDivisi(formData).then(res => {
            const load = res.data;
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Data saved successfully`, life: 3000 });
            loadApp();
            closeConfirmation()
        })
    } else {
        const formData = {
            kode: form_apps.value.kode,
            divisi: form_apps.value.divisi,
            bom: form_apps.value.bom
        }
        DivService.updateDivisi(form_apps.value.id ,formData).then(res => {
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
                            <label for="firstname2">Kode Divisi</label>
                            <InputText type="text" autocomplete="off" placeholder="Kode Divisi" v-model="form_apps.kode"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Divisi</label>
                            <InputText type="text" autocomplete="off" placeholder="Divisi" v-model="form_apps.divisi"/>
                        </div>
                        <div class="field col-12 md:col-12">
                            <label for="firstname2">Board of Management/Director</label>
                            <Dropdown v-model="form_apps.bom" :options="user_list" filter optionLabel="name" optionValue="bom" placeholder="Select a Board of Management/Director"></Dropdown>
                            <!-- <InputText type="text" autocomplete="off" placeholder="BOM" v-model="form_apps.bom"/> -->
                        </div>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" @click="closeConfirmation" class="p-button-text p-button-danger" />
                        <Button label="Save" icon="pi pi-save" @click="submitData(titleModal=='Edit Apps'? 'edit' : 'add')" class="p-button-text p-button-success" autofocus />
                    </template>
                </Dialog>
                <Dialog v-model:visible="dialogs" :style="{ width: '750px' }" :modal="true">
                    <template #header>
                        <h4 class="font-normal" v-html="titledialogs"></h4>
                    </template>
                    <!-- Body -->
                    <div>
                        <dialog-departemen :nomor_dialog="nomordialog" :data_dialog="datadialog" ></dialog-departemen>
                    </div>
                </Dialog>
                <div class="grid">
                    <div class="col-6">
                        <h5>List Divisi</h5>
                    </div>
                    <div class="col-6 text-right">
                        <Button type="button" icon="pi pi-plus" size="small" label="Add Divisi" class="p-button-outlined mb-2" @click="modalApps('add','')"/>
                    </div>
                </div>
                <DataTable :value="apps" :rows="10" :paginator="true" responsiveLayout="scroll" :filters="filters1" v-model:filters="filters1" v-model:expandedRows="expandedRows">
                    <template #header>
                        <div class="p-fluid">
                            <span class="p-input-icon-left mb-2">
                                <i class="pi pi-search" />
                                <InputText v-model="filters1['global'].value" placeholder="Keyword Search" />
                            </span>
                        </div>
                    </template>
                    <template #empty> No customers found. </template>
                    <template #loading> Loading customers data. Please wait. </template>
                    <Column expander style="width: 1rem"></Column>
                    <Column field="no" header="No" :sortable="false" style="width: 3rem"></Column>
                    <Column field="divisi" header="Divisi" :sortable="true" style="width: 12rem "></Column>
                    <Column field="name_bom" header="BOM" :sortable="true" style="width: 12rem"></Column>
                    <Column style="width: 12rem">
                        <template #header> 
                            <div class="text-center w-full">#</div> 
                        </template>
                        <template #body="{data}">
                            <div class="flex align-items-center justify-content-center">
                                <Button icon="pi pi-eye" type="button" class="p-button-text p-button-info" @click="dialogApps(data)"></Button>
                                <Button icon="pi pi-pencil" type="button" class="p-button-text p-button-warning" @click="modalApps('edit',data)"></Button>
                                <Button icon="pi pi-trash" type="button" class="p-button-text p-button-danger"></Button>
                            </div>
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="p-3">
                            <h6 class="font-bold">Departemen</h6>
                            <DataTable :value="slotProps.data.departments" class="p-datatable-sm">
                                <Column field="kode" sortable>
                                    <template #header>
                                        <span class="text-xs">Kode Departemen</span>
                                    </template>
                                    <template #body="{data}">
                                        <span class="text-sm">{{ data.kode }}</span>
                                    </template>
                                </Column>
                                <Column field="department" sortable>
                                    <template #header>
                                        <span class="text-xs">Departemen</span>
                                    </template>
                                    <template #body="{data}">
                                        <span class="text-sm">{{ data.department }}</span>
                                    </template>
                                </Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>  
</template>