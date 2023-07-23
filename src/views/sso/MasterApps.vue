<script>

import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { onMounted, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProductService from '@/service/ProductService';
import UserService from '@/api/UserService';

export default {
    setup(){
        const payload = JSON.parse(localStorage.getItem('payload'));
        const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
        const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Master Apps', class:'font-bold' }]);

        const nestedRouteItems = ref([
            {
                label: 'Master Aplikasi',
                to: '/master-apps'
            },
            {
                label: 'Akses User',
                to: '/master-apps/akses'
            },
        ]);
        onMounted(() => {
            // Produk();
            // loadUser();
            // loadDataProv();
            // funcSelected();
        });

        return{
            payload, breadcrumbHome, breadcrumbItems, nestedRouteItems
        }
    }
}
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-orange-100" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <TabMenu :model="nestedRouteItems" class="mb-4" />
                <router-view/>
            </div>
        </div>
    </div>  
</template>