<script setup>
    import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
    import { useLayout } from '@/layout/composables/layout';
    import { useRouter } from 'vue-router';

    import {URL_WEB_Portal} from '@/api/env'

    const { layoutConfig, onMenuToggle } = useLayout();

    const outsideClickListener = ref(null);
    const topbarMenuActive = ref(false);
    const displayConfirmation = ref(false);
    const router = useRouter();
    const payload = JSON.parse(localStorage.getItem('payload'));

    const items = ref([
        {
            label: 'Home',
            root: false,
            icon: 'pi-home',
            route: '/home',
        },
        {
            label: 'My Profile',
            root: false,
            icon: 'pi-user',
            route: '/user-profile',
        },
        {
            label: 'Management User',
            root: payload.jabatan != 'super_admin' ? true : false,
            icon: 'pi-wrench',
            route: '/management-user',
        },
    ]);

    onMounted(() => {
        bindOutsideClickListener();
        tokenChecker()
    });

    onBeforeUnmount(() => {
        unbindOutsideClickListener();
    });

    const logoUrl = computed(() => {
        return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
    });

    const onTopBarMenuButton = () => {
        topbarMenuActive.value = !topbarMenuActive.value;
    };
    const onSettingsClick = () => {
        topbarMenuActive.value = false;
        router.push('/documentation');
    };
    const routing = (routes) => {
        router.push(routes);
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

    const tokenChecker = () => {
        const token = localStorage.getItem('usertoken');
        
        if (token) {
            const tokenData = parseJwt(token);
            const expirationTime = tokenData.exp * 1000; // Convert expiration time to milliseconds

            if (Date.now() > expirationTime) {
                // Token has expired, remove it from localStorage
                localStorage.removeItem('usertoken');
                localStorage.removeItem('payload');
                window.location.replace(URL_WEB_Portal);
                console.log('expired');
            } else {
                console.log('Token activated');
                console.log(token);
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

    const logoutAction = () => {
        localStorage.removeItem('usertoken');
        localStorage.removeItem('payload');
        window.location.replace(URL_WEB_Portal);
    }
</script>

<template>
    <div class="py-3 px-5 fixed w-full z-3">
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
        <Menubar :model="items" class="shadow-2 surface-0 " style="border-radius: 3rem">
            <template #start>
                <div class="flex align-items-center">
                    <router-link to="/" class="flex align-items-center">
                        <img src="/layout/inl.png" alt="PT Industri Nabati Lestari" class="mx-3" style="width: 50px;" />
                        <Divider class="hidden sm:block md:block" layout="vertical" />
                    </router-link>
                </div>
            </template>
            <template #item={item}>
                <Button :label="item.label" :class="`${item.root == true ? 'hidden':'block'}`" :icon="`pi ${item.icon}`" severity="warning" text size="sm" @click="routing(item.route)"/>
            </template>
            <template #end>
                <button class="p-link layout-topbar-button text-orange-400 mx-3 p-2 bg-yellow-50 border-circle" @click="displayConfirmation = true" v-tooltip.bottom="'Sign Out'">
                    <i class="pi pi-sign-out text-3xl m-1"></i>
                </button>
            </template>
        </Menubar>
    </div>
</template>

<style lang="scss" scoped></style>
