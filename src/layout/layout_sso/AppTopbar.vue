<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout2';
import { useRouter, useRoute } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const displayConfirmation = ref(false);
const router = useRouter();
const route = useRoute();
const route_name = computed(() => route.name)
const payload = JSON.parse(localStorage.getItem('payload'));

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const links = (paths) => {
    router.push({ path: paths })
}

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const logoutAction = () => {
    displayConfirmation.value = false;
    localStorage.removeItem('usertoken');
    localStorage.removeItem('payload');
    router.push('/auth/login')
};

const onSettingsClick = (link) => {
    router.push(link);
};
const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar dark shadow-6 bg-teal-700">
        <div class="layout-topbar-logo sm:flex hidden align-content-center cursor-pointer" @click="links('/home')">
            <i class="pi pi-lock text-3xl mr-2 text-white"></i>
            <span class="text-white font-light">Portal APPS - INL</span>
        </div>
        <!-- <router-link to="/home" class="layout-topbar-logo sm:flex hidden align-content-center"> -->
            <!-- <img src="layout/inl.png" alt="PT. INL" class="p-1" /> -->
            <!-- <img :src="logoUrl" alt="logo" /> -->
            <!-- <i class="pi pi-lock text-3xl mr-2 text-white"></i>
            <span class="text-white">Portal APPS - INL</span> -->
        <!-- </router-link> -->

        <div class="text-gray-300">
            <span class="text-md sm:text-xl font-bold">{{payload.name}}</span>
            <span class="text-xs sm:text-sm flex">{{payload.jabatan}} - Div. {{payload.divisi}}</span>
            <!-- <span class="text-xl font-bold">{{payload.name}}</span> -->
            <!-- <img src="demo/images/avatar/inl.png" alt="logo" width="40" /> -->
            <!-- <i class="pi pi-user"></i> -->
            <!-- <span>Test</span> -->
        </div>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <div class="px-3 py-2">
                <span class="block sm:hidden font-bold text-lg">{{payload.name}}</span>
                <span class="block sm:hidden font-light text-xs">{{payload.jabatan}}</span>
            </div>
            <!-- <button class="layout-topbar-button">
            </button> -->
            <button @click="onSettingsClick('/home')" :class="`${route_name == 'home' ? 'text-teal-700 bg-white' : 'bg-teal-700 text-white hover:text-teal-700 hover:bg-white ease-in-out duration-300'} p-link layout-topbar-button`" title="Home">
                <i class="pi pi-home"></i>
                <span>Home</span>
            </button>
            <button @click="onSettingsClick('/user-profile')" :class="`${route_name == 'userprofile' ? 'text-teal-700 bg-white' : 'bg-teal-700 text-white hover:text-teal-700 hover:bg-white ease-in-out duration-300'} p-link layout-topbar-button`" title="User Profile">
                <i class="pi pi-user"></i>
                <span>User Profile</span>
            </button>
            <button @click="onSettingsClick('/management-user')" :class="`${route_name == 'managementuser' ? 'text-teal-700 bg-white' : 'bg-teal-700 text-white hover:text-teal-700 hover:bg-white ease-in-out duration-300'} p-link layout-topbar-button`" title="Management User" v-show="payload.jabatan == 'super_admin'">
                <i class="pi pi-sitemap"></i>
                <span>Management User</span>
            </button>
            <button @click="onSettingsClick('/master-apps')" :class="`${route_name == 'masterapps' || route_name == 'masterappsaccess' ? 'text-teal-700 bg-white' : 'bg-teal-700 text-white hover:text-teal-700 hover:bg-white ease-in-out duration-300'} p-link layout-topbar-button`" title="Master Apps" v-show="payload.jabatan == 'super_admin'">
                <i class="pi pi-desktop"></i>
                <span>Master Apps</span>
            </button>
            <button @click="displayConfirmation = true" :class="`bg-teal-700 text-white hover:text-teal-700 hover:bg-white ease-in-out duration-300 p-link layout-topbar-button`" title="Sign Out">
                <i class="pi pi-sign-out"></i>
                <span>Sign Out</span>
            </button>
        </div>
        <Dialog v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true" position="topright" :draggable="false">
            <template #header>
                <h4>Sign Out</h4>
            </template>
            <div class="flex align-items-center justify-content-center">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color:red;" />
                <span class="font-semibold">Do you want to exit this session?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" @click="displayConfirmation = false" class="p-button-text p-button-secondary" />
                <Button label="Yes" icon="pi pi-check" @click="logoutAction" class="p-button-danger" autofocus />
            </template>
        </Dialog>
    </div>
</template>

<style lang="scss" scoped></style>
