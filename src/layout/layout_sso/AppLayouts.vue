<script setup>
import { computed, watch, onMounted, ref } from 'vue';
import AppTopbar from './AppTopbar.vue';
import AppFooter from '../AppFooter.vue';
import { useRouter, useRoute } from 'vue-router';
// import AppSidebar from './AppSidebar.vue';
// import AppConfig from './AppConfig.vue';
import { useLayout } from '@/layout/composables/layout2';

const router = useRouter();
const route = useRoute();
const route_name = computed(() => route.name)

const { layoutConfig, layoutState, isSidebarActive } = useLayout();

const outsideClickListener = ref(null);

onMounted(() => {
    tokenChecker();
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-theme-light': layoutConfig.darkTheme.value === 'light',
        'layout-theme-dark': layoutConfig.darkTheme.value === 'dark',
        'layout-overlay': layoutConfig.menuMode.value === 'overlay',
        'layout-static': layoutConfig.menuMode.value === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive.value && layoutConfig.menuMode.value === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive.value,
        'layout-mobile-active': layoutState.staticMenuMobileActive.value,
        'p-input-filled': layoutConfig.inputStyle.value === 'filled',
        'p-ripple-disabled': !layoutConfig.ripple.value
    };
});

const tokenChecker = () => {
    const token = localStorage.getItem('usertoken');
    
    if (token) {
        const tokenData = parseJwt(token);
        const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds

        if (Date.now() > expirationTime) {
            // Token has expired, remove it from localStorage
            localStorage.removeItem('usertoken');
            localStorage.removeItem('payload');
            // window.location.replace("http://192.168.1.223:8085/auth/login");
            window.location.replace("http://localhost:5173/auth/login");
            // router.push('/auth/login');
            console.log('expired');
        } else {
            console.log('Token activated');
            console.log(token);
            // config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
}

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive.value = false;
                layoutState.staticMenuMobileActive.value = false;
                layoutState.menuHoverActive.value = false;
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
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <div class="layout-main-container bg-white">
        <!-- <div class="layout-main-container bg-no-repeat bg-cover bg-center" style="background-image: url('/layout/bg5.jpg');;"> -->
            <div class="layout-main">
                <router-view></router-view>
            </div>
            <app-footer></app-footer>
        </div>
        <!-- <app-config></app-config> -->
        <div class="layout-mask"></div>
    </div>
</template>

<style lang="scss" scoped></style>
