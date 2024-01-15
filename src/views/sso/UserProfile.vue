<script setup>
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import AppTopbar from './home/components/AppTopbar.vue';


// API
import UserService from '@/api/UserService';
import LocationService from '@/api/LocationService';
import {listKelamin, listAgama, formUser, listPendidikan, listStatusKawin, listDivisi, listDept, listKantor, listStatusKaryawan} from '@/api/DataVariable';


// Variable
const payload = JSON.parse(localStorage.getItem('payload'));
const form_disabled = ref(true);
const btn_label = ref('Edit Profile');
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'User Profile', class:'font-bold' }]);
const selectedKelamin = ref(null);
const loadKelamin = ref(listKelamin);
const loadAgama = ref(listAgama);
const loadPendidikan = ref(listPendidikan);
const loadStatusKawin = ref(listStatusKawin);
const loadDivisi = ref(listDivisi)
const loadDept = ref(listDept)
const loadKantor = ref(listKantor)
const loadStatusKaryawan = ref(listStatusKaryawan)
const dialogs = ref(false)

const loadProv = ref([]);
const loadProvKTP = ref([]);
const loadProvDomisili = ref([]);
const loadKabKot = ref([]);
const loadKabKotKTP = ref([]);
const loadKabKotDomisili = ref([]);
const loadKecKTP = ref([]);
const loadKecDomisili = ref([]);
const loadKelKTP = ref([]);
const loadKelDomisili = ref([]);

const form_user = ref(formUser);

const email = ref(null)
const password = ref(null)
const repassword = ref(null)
const disablebtnchangepass = ref(true)
const loadings = ref(false)

const toast = useToast();

// Given accsess public funtion
onMounted( async() => {
    loadAll()
});

const loadAll = async () => {
    loadings.value = true
    await loadUsers();
    await loadDataProv();
    loadings.value = false
}

// Function
const loadUsers = async () => {
    // console.log(payload);
    await UserService.getUserID(payload.sub).then(res => {
        const load = res;
        // console.log(load)
        const data  = load
        form_user.value = {
            id:data.id,
            nik:data.nik,
            name:data.name,
            email:data.email,

            // Lahir
            tgl_lahir:data.tgl_lahir,
            prov_lahir:data.prov_lahir,
            kabkot_lahir:data.kabkot_lahir,
            kelamin:data.kelamin,
            statuskawin:data.status_perkawinan,
            noHP:data.noHP,
            pendidikan:data.pendidikan,
            jurusan:data.jurusan,
            agama:data.agama,
            domisili:data.domisili,

            // Alamat KTP
            prov_ktp:data.prov_ktp,
            kabkot_ktp:data.kabkot_ktp,
            kec_ktp:data.kec_ktp,
            kel_ktp:data.kel_ktp,
            alamat_ktp:data.alamat_ktp,

            // Alamat Domisili
            prov_domisili:data.prov_domisili,
            kabkot_domisili:data.kabkot_domisili,
            kec_domisili:data.kec_domisili,
            kel_domisili:data.kel_domisili,
            alamat_domisili:data.alamat_domisili,

            // Data Pekerjaan
            nrk:data.nrk,
            npwp:data.npwp,
            jabatan:data.jabatan,
            divisi:data.divisi,
            departemen:data.departemen,
            job_level:data.grade,
            tanggungan:data.jlh_tk,
            training:data.training,
            office:data.kantor,
            status:data.status,
            tgl_masuk:data.tgl_masuk,
            tgl_sampai:data.tgl_keluar,
            status_karyawan:data.status_karyawan,

            // Fasilitas Pekerjaan
            bpjs_kesehatan:data.bpjs_kesehatan,
            bpjs_ketenagakerjaan:data.bpjs_ketenagakerjaan,
            norek:data.no_rekening,
            rek:data.rekening,
            faskes1:data.faskes_1,
            gaji:data.gaji_pokok,
            tunjangan_t:data.tunjangan_tetap,
            tunjangan_tt:data.tunjangan_tidak_tetap,
            keterangan:data.keterangan,
        }
        // console.log(form_user.value);
    })
};

const loadDataProv = async () => {
    await LocationService.getProv().then(res => {
        const load = res.data.provinsi;
        const list = [];
        for (let i = 0; i < load.length; i++) {
            list[i] = {
                code: load[i].id,
                name: load[i].nama
            }
        }
        loadProv.value = list;
    })
}

const submitData = async() => {
    await UserService.updateUser(payload.sub, form_user.value).then(res => {
        console.log(res);
        const load = res.data;
        if (load.code == 200) {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            loadUsers();
        } else {
            toast.add({ severity: 'warn', summary: 'Warning', detail: `Update failed (${load.code})`, life: 3000 });
        }
    })
}

const formatCurrency = (dis) => {
    if (dis == true) {
        form_disabled.value = true
        btn_label.value = 'Edit Profile'
    } else {
        form_disabled.value = false
        btn_label.value = 'Batal'
    }
    console.log(form_disabled.value)
};

// Dialog Change Password
const dialogChangePassword = () => {
    dialogs.value = true;
    email.value = form_user.value.email;
    password.value = null;
    repassword.value = null;
}

const syncRePassword = () => {
    if (password.value != null && repassword.value != null) {
        if (password.value == repassword.value) {
            disablebtnchangepass.value = false;
        } else {
            disablebtnchangepass.value = true;
        }
    } else {
        disablebtnchangepass.value = true;
    }
}

const submitChangePassword = async () => {
    const data = {
        email: email.value,
        password: password.value
    }
    await UserService.addPasswordUpdate(data).then(res => {
        console.log(res);
        const load = res.data;
        if (load.code == 200) {
            toast.add({ severity: 'success', summary: 'Successfully', detail: `Updated successfully`, life: 3000 });
            loadUsers();
            dialogs.value = false;
        } else {
            dialogs.value = false;
            toast.add({ severity: 'warn', summary: 'Warning', detail: `Update failed (${load.code})`, life: 3000 });
        }
    })
}

</script>

<template>
    <div class="layout-wrapper">
        <app-topbar></app-topbar>
        <div class="layout-main-container bg-gray-100" style="background-image: url('/layout/bg6.jpg');">
            <div class="layout-main">
                <div class="grid">
                    <Toast/>
                    <Dialog v-model:visible="dialogs" :style="{ width: '450px' }" :modal="true">
                        <template #header>
                            <h4>Change Password</h4>
                        </template>
                        <div class="p-fluid formgrid grid">
                            <div class="field col-12 md:col-12">
                                <label for="firstname2">Password</label>
                                <Password id="password1" v-model="password" placeholder="Password" @input="syncRePassword" :feedback="true" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                            </div>
                            <div class="field col-12 md:col-12">
                                <label for="firstname2">Re-Password</label>
                                <Password id="password1" v-model="repassword" placeholder="Re-Password" @input="syncRePassword" :feedback="true" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                            </div>
                        </div>
                        <template #footer>
                            <Button label="No" icon="pi pi-times" @click="dialogs = false" class="p-button-outlined p-button-danger" />
                            <Button label="Save" icon="pi pi-save" @click="submitChangePassword" class="p-button-outlined p-button-success" autofocus :disabled="disablebtnchangepass" />
                        </template>
                    </Dialog>
                    <div class="col-12 md:col-12">
                        <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-orange-100" />
                    </div>
                    <div class="col-12 md:col-4">
                        <div class="card p-fluid">
                            <div class="surface-section">
                                <div class="text-700 text-center">
                                    <span class="p-5 shadow-2 mb-3 inline-block surface-card border-circle">
                                        <i class="pi pi-user text-8xl text-blue-500"></i>
                                    </span>
                                    <div class="text-900 font-bold text-2xl mb-3">{{payload.name}}</div>
                                    <div class="text-700 text-gray-400 text-xl mb-5">{{payload.jabatan}}</div>
                                    <hr>
                                    <div class="text-700 text-md font-semibold mb-5">{{payload.departemen}}</div>
                                    <div class="">
                                        <Button @click="dialogChangePassword" label="Change Password" icon="pi pi-key"  class="p-button-warning font-bold px-5 py-3 p-button-rounded my-2"></Button>
                                        <Button @click="formatCurrency(!form_disabled)" :label="btn_label" :icon="form_disabled == true ? 'pi pi-pencil':'pi pi-times'" :class="form_disabled == true ? 'p-button-secondary ':'p-button-danger'" class="font-bold px-5 py-3 p-button-rounded my-2"></Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-8">
                        <div v-show="loadings == true" class="text-center">
                            <p>Loading...</p>
                            <ProgressBar mode="indeterminate" style="height: 10px"></ProgressBar>
                        </div>
                        <div class="card" v-show="loadings == false">
                            <h5>IDENTITAS USER</h5>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-4">
                                    <label for="firstname2">Alamat Email</label>
                                    <InputText id="email" type="email" :disabled="form_disabled" v-model="form_user.email"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Nama</label>
                                    <InputText id="lastname2" type="text" :disabled="form_disabled" v-model="form_user.name"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">NIK</label>
                                    <InputText id="lastname2" type="number" :disabled="form_disabled" v-model="form_user.nik"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Jenis Kelamin</label>
                                    <Dropdown v-model="form_user.kelamin" :options="loadKelamin" optionValue="kelamin" :disabled="form_disabled" optionLabel="name" placeholder="Jenis Kelamin" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Agama</label>
                                    <Dropdown v-model="form_user.agama" :options="loadAgama" optionValue="agama" :disabled="form_disabled" optionLabel="name" placeholder="Agama" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Pendidikan Terakhir</label>
                                    <Dropdown v-model="form_user.pendidikan" :options="loadPendidikan" optionValue="pendidikan" :disabled="form_disabled" optionLabel="name" placeholder="Pendidikan Terakhir" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Jurusan</label>
                                    <InputText id="lastname2" type="text" :disabled="form_disabled" v-model="form_user.jurusan"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Status Kawin</label>
                                    <Dropdown v-model="form_user.statuskawin" :options="loadStatusKawin" optionValue="statuskawin" :disabled="form_disabled" optionLabel="name" placeholder="Status Kawin" />
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">No. HP</label>
                                    <InputText id="lastname2" type="number" :disabled="form_disabled" v-model="form_user.noHP"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Tgl Lahir</label>
                                    <Calendar inputId="calendar" v-model="form_user.tgl_lahir" :disabled="form_disabled"></Calendar>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Provinsi Lahir</label>
                                    <Dropdown v-model="form_user.prov_lahir" :options="loadProv" :disabled="form_disabled" optionLabel="name" @change="loadDataKabKot('lahir')" placeholder="Provinsi Lahir" />
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Kab/Kota Lahir</label>
                                    <Dropdown v-model="form_user.kabkot_lahir" :options="loadKabKot" :disabled="form_disabled" optionLabel="name" placeholder="Kabupaten/Kota" />
                                </div>
                            </div>
                            <hr/>
                            <h5>ALAMAT KTP</h5>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Provinsi</label>
                                    <Dropdown v-model="form_user.prov_ktp" :options="loadProvKTP" :disabled="form_disabled" @change="loadDataKabKot('ktp')" optionLabel="name" placeholder="Provinsi" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kabupaten/Kota</label>
                                    <Dropdown v-model="form_user.kabkot_ktp" :options="loadKabKotKTP" :disabled="form_disabled" optionLabel="name" @change="loadDataKec('ktp')" placeholder="Kabupaten/Kota" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kecamatan</label>
                                    <Dropdown v-model="form_user.kec_ktp" :options="loadKecKTP" :disabled="form_disabled" optionLabel="name" @change="loadDataKel('ktp')" placeholder="Kecamatan" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kelurahan</label>
                                    <Dropdown v-model="form_user.kel_ktp" :options="loadKelKTP" :disabled="form_disabled" optionLabel="name" placeholder="Kelurahan" />
                                </div>
                                <div class="field col-12">
                                    <label for="address">Alamat</label>
                                    <Textarea id="address" rows="4" v-model="form_user.alamat_ktp" :disabled="form_disabled" />
                                </div>
                            </div>
                            <h5>ALAMAT DOMISILI</h5>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Provinsi</label>
                                    <Dropdown v-model="form_user.prov_domisili" :options="loadProvDomisili" :disabled="form_disabled" @change="loadDataKabKot('domisili')" optionLabel="name" placeholder="Provinsi" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kabupaten/Kota</label>
                                    <Dropdown v-model="form_user.kabkot_domisili" :options="loadKabKotDomisili" :disabled="form_disabled" optionLabel="name" @change="loadDataKec('domisili')" placeholder="Kabupaten/Kota" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kecamatan</label>
                                    <Dropdown v-model="form_user.kec_domisili" :options="loadKecDomisili" :disabled="form_disabled" optionLabel="name" @change="loadDataKel('domisili')" placeholder="Kecamatan" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Kelurahan</label>
                                    <Dropdown v-model="form_user.kel_domisili" :options="loadKelDomisili" :disabled="form_disabled" optionLabel="name" placeholder="Kelurahan" />
                                </div>
                                <div class="field col-12">
                                    <label for="address">Alamat</label>
                                    <Textarea id="address" v-model="form_user.alamat_domisili" :disabled="form_disabled" rows="4" />
                                </div>
                            </div>
                            <hr/>
                            <h5>DATA PEGAWAI</h5>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">NRK</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.nrk"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">NPWP</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.npwp"/>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Divisi</label>
                                    <Dropdown v-model="form_user.divisi" :options="loadDivisi" optionValue="divisi" disabled optionLabel="name" placeholder="Divisi" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Departemen</label>
                                    <Dropdown v-model="form_user.departemen" :options="loadDept" optionValue="departemen" disabled optionLabel="name" placeholder="Departemen" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Jabatan</label>
                                    <InputText id="lastname2" type="text" disabled v-model="form_user.jabatan"/>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Job Level</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.job_level"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Tanggungan</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.tanggungan"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Training</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.training"/>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Penempatan</label>
                                    <Dropdown v-model="form_user.office" :options="loadKantor" optionValue="office" disabled optionLabel="name" placeholder="Penempatan" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Status Karyawan</label>
                                    <Dropdown v-model="form_user.status_karyawan" :options="loadStatusKaryawan" optionValue="status_karyawan" disabled optionLabel="name" placeholder="Status Karyawan" />
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Tgl Masuk</label>
                                    <Calendar inputId="calendar" v-model="form_user.tgl_masuk" disabled></Calendar>
                                </div>
                                <div class="field col-12 md:col-3">
                                    <label for="lastname2">Tgl Keluar</label>
                                    <Calendar inputId="calendar" v-model="form_user.tgl_sampai" disabled></Calendar>
                                </div>
                            </div>
                            <h5>FASILITAS PEGAWAI</h5>
                            <div class="p-fluid formgrid grid">
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">BPJS Kesehatan</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.bpjs_kesehatan"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Faskes 1</label>
                                    <InputText id="lastname2" type="text" disabled v-model="form_user.faskes1"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">BPJS Ketenagakerjaan</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.bpjs_ketenagakerjaan"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Nomor Rekening</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.norek"/>
                                </div>
                                <div class="field col-12 md:col-6">
                                    <label for="lastname2">Nama Bank</label>
                                    <InputText id="lastname2" type="text" disabled v-model="form_user.rek"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Gaji Pokok</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.gaji"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Tunjangan Tetap</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.tunjangan_t"/>
                                </div>
                                <div class="field col-12 md:col-4">
                                    <label for="lastname2">Tunjangan Tidak Tetap</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.tunjangan_tt"/>
                                </div>
                                <div class="field col-12 md:col-12">
                                    <label for="lastname2">Keterangan</label>
                                    <InputText id="lastname2" type="number" disabled v-model="form_user.keterangan"/>
                                </div>
                            </div>
                            <div class="grid">
                                <div class="field col-12 text-right">
                                    <Button label="Save" class="p-button-outlined p-button-success mx-2" :disabled="form_disabled" @click="submitData" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
