<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/home' }]
    },
    {
        label: 'Master',
        items: [
            { label: 'Divisi', icon: 'pi pi-fw pi-id-card', to: '/divisi' },
            { label: 'Akses Level', icon: 'pi pi-fw pi-id-card', items: [
                { label: 'Master Aplikasi', icon: 'pi pi-fw pi-id-card', to: '/master-apps' },
                { label: 'Akses User', icon: 'pi pi-fw pi-id-card', to: '/master-apps/akses' },
            ]},
        ]
    },
    {
        label: 'Management',
        items: [
            { label: 'Management User', icon: 'pi pi-fw pi-id-card', to: '/management-user' },
        ]
    },
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
