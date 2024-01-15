<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const displayConfirmation = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
const logoutAction = () => {
    displayConfirmation.value = false;
    localStorage.removeItem('usertoken');
    localStorage.removeItem('payload');
    router.push('/auth/login')
};

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};
const onSettingsClick = () => {
    topbarMenuActive.value = false;
    router.push('/documentation');
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
                        <span class="font-medium text-orange-400 text-2xl">Portal APPS</span>
                    </router-link>
                </div>
            </template>
            <template #end>
                <button class="p-link layout-topbar-button text-orange-400 mx-3 p-2 bg-yellow-50 border-circle" @click="onMenuToggle()">
                    <i class="pi pi-th-large text-3xl m-1"></i>
                </button>
                <button class="p-link layout-topbar-button text-orange-400 mx-3 p-2 bg-yellow-50 border-circle" @click="displayConfirmation = true" v-tooltip.bottom="'Sign Out'">
                    <i class="pi pi-sign-out text-3xl m-1"></i>
                </button>
            </template>
        </Menubar>
    </div>
    <!-- <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img src="layout/Portal.png" alt="logo" class="p-1 w-11rem h-5rem"/>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button @click="displayConfirmation = true" class="p-link layout-topbar-button">
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
    </div> -->
</template>

<style lang="scss" scoped></style>
