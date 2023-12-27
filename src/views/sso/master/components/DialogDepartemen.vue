<script setup>
    import { onMounted, ref, defineProps } from 'vue';
    import { formDepartemen } from '@/api/DataVariable';

    // API
    import DivService from '@/api/DivService';
    
    // Variable
    const props = defineProps({
        nomor_dialog:{
            type:Number
        },
        status_dialog:{
            type:String
        },
        data_dialog:{
            type:Array
        },
        in_props: String, // Change the type to match your prop type
    });
    const status = props.status_dialog;
    const status_forms = ref('add');
    const nomordialog = props.nomor_dialog;
    const loaddatadialog = props.data_dialog;
    const expandedRows = ref([]);
    const loadingTable = ref(null);
    
    // Forms
    const forms = ref(formDepartemen)

    // Data Table
    const list_table = ref([])

    const loadData = async() => {
        loadDialog()
        resetForm();
    }

    const resetForm = () => {
        status_forms.value = 'add'
        forms.value = {
            id: null,
            divisi_id: nomordialog,
            department: '',
            kode: '',
        }
    }

    const loadDialog = () => {
        console.log(loaddatadialog)
        const data = loaddatadialog;
        for (let i = 0; i < data.length; i++) {
            list_table.value.push({
                no: i+1,
                id: data[i].id,
                divisi_id: data[i].divisi_id,
                kode: data[i].kode,
                status: data[i].status,
                department: data[i].department,
            })
        }
    }

    const loadDept = async() => {
        const dept = await DivService.getDeptByDivisi(nomordialog);
        const response = dept.data;
        const data = response.data;
        for (let i = 0; i < data.length; i++) {
            list_table.value.push({
                no: i+1,
                id: data[i].id,
                divisi_id: data[i].divisi_id,
                kode: data[i].kode,
                status: data[i].status,
                department: data[i].department,
            })
        }
    }

    const formEdit = (data) => {
        status_forms.value = 'edit'
        forms.value = {
            id: data.id,
            divisi_id: data.divisi_id,
            department: data.department,
            kode: data.kode,
        }
    }

    onMounted(() => {
        loadData();
    })

    // Post Data
    const postTable = () => {
        if (status_forms.value === 'add') {
            DivService.postDept(forms.value).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadDept();
                    resetForm();
                } else {
                    loadDialog();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        } else {
            DivService.updateDept(forms.value.id, forms.value).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    loadDept();
                    resetForm();
                } else {
                    loadDialog();
                }
            }).catch(error => {
                console.error(error.response.status);
            })
        }
        // console.log(status_forms.value);
        // console.log(forms.value);
    }
</script>

<template>
    <div class="grid p-fluid">
        <div class="col-12">
            <h6 class="font-semibold">LIST DEPARTEMEN</h6>
            <h6 class="font-semibold text-md" v-show="loadingTable !== null">{{loadingTable}}</h6>
            <DataTable showGridlines :value="list_table" editMode="row" dataKey="id" tableClass="p-datatable-sm" v-show="loadingTable === null">
                <Column>
                    <template #header>
                        <span class="text-xs">No</span>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ data.no }}</span>
                    </template>
                </Column>
                <Column field="kode">
                    <template #header>
                        <div class="field w-full">
                            <label for="firstname2" class="text-sm">{{ status_forms === 'add_fv' ? 'Tambah' : status_forms === 'edit_fv' ? 'Edit' : ''}}</label>
                            <InputText type="text" autocomplete="off" placeholder="Kode Departemen" v-model="forms.kode"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ data.kode }}</span>
                    </template>
                </Column>
                <Column field="department">
                    <template #header>
                        <div class="field w-full">
                            <label for="firstname2" class="text-sm">{{ status_forms === 'add_fv' ? 'Tambah' : status_forms === 'edit_fv' ? 'Edit' : ''}}</label>
                            <InputText type="text" autocomplete="off" placeholder="Departemen" v-model="forms.department"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <span class="text-sm">{{ data.department }}</span>
                    </template>
                </Column>
                <Column style="width: 30%; min-width: 8%" headerStyle="text-align:center;" >
                    <template #header>
                        <div class="flex justify-content-center flex-wrap w-full">
                            <Button icon="pi pi-save" severity="primary" class="mr-2" outlined size="small" @click="postTable()"/>
                            <Button icon="pi pi-refresh" severity="secondary" outlined size="small" @click="resetForm()"/>
                        </div>
                    </template>
                    <template #body="{ data }">
                        <div class="flex justify-content-center flex-wrap" >
                            <Button icon="pi pi-pencil" severity="warning" class="mr-2" outlined @click="formEdit(data)" size="small"/>
                            <Button icon="pi pi-trash" severity="danger" outlined size="small" :disabled="data.disabled"/>
                        </div>
                    </template>
                </Column>
            </DataTable>
        </div>
    </div>
</template>