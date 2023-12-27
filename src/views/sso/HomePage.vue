<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const displayConfirmation = ref(false);
const router = useRouter();
const payload = JSON.parse(localStorage.getItem('payload'));

const logoutAction = () => {
    displayConfirmation.value = false;
    localStorage.removeItem('usertoken');
    localStorage.removeItem('payload');
    router.push('/auth/login')
};

const onSettingsClick = (link) => {
    router.push(link);
};

</script>

<template>
    <div>
        <div class="flex justify-content-center">
            <img src="layout/Portal_bergerak.gif" alt="Portal INL" class="w-20rem sm:w-30rem">
        </div>
        <div class="text-center mb-4">
            <span class="text-xl sm:text-3xl font-normal">Hello, <span class="font-bold">{{payload.name}}</span></span><br>
            <span class="text-md sm:text-xl font-light text-grey-400">Please click "Go to dashboard" to open the applications</span>
        </div>
        <div class="flex justify-content-center flex-wrap gap-3">
            <Button label="Go to Dashboard" severity="success" outlined @click="onSettingsClick('/dashboard')" />
            <Button label="Log Out" severity="danger" outlined @click="displayConfirmation = true"/>
        </div>
        <Dialog v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true" position="bottom" :draggable="false">
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