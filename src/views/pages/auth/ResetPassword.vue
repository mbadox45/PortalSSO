<script setup>
// Vue Component
import { useLayout } from '@/layout/composables/layout';
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';

// HTML Components
import AppConfig from '@/layout/AppConfig.vue';

// API
import UserService from '@/api/UserService';
import { URL_WEB_Portal } from '@/api/env';

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { layoutConfig } = useLayout();
const re_password = ref(null);
const password = ref(null);
const email = ref(null);
const isLoading = ref(false);

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

onMounted(() => {
    kondisi_page()
})

const kondisi_page = () => {
    const token = route.query.token;
    if (token == null) {
        link_back()
    }
}

const link_back = () => {
    window.location.replace(`${URL_WEB_Portal}home`);
}

const onSubmit = (e) => {
    e.preventDefault();
    if (re_password.value && password.value && email.value ) {
        const post = {
            email: email.value,
            password: password.value,
        }
        isLoading.value = true
        try {
            UserService.addPasswordUpdate(post).then(res => {
                const load = res.data;
                if (load.code == 200) {
                    toast.add({ severity: 'success', summary: 'Successfully', detail: `Update password successfully`, life: 3000 });
                    window.location.replace(`${URL_WEB_Portal}home`);
                } else {
                    toast.add({ severity: 'warn', summary: 'Attention', detail: 'The password or email you entered is incorrect, please try again', life: 3000 });
                    console.log(load);
                }
            }).catch(error => {
                console.error(error.response.status);
                toast.add({ severity: 'warn', summary: 'Attention', detail: 'The password or email you entered is incorrect, please try again', life: 3000 });
            })
        } catch (error) {
            toast.add({ severity: 'danger', summary: 'Attention', detail: 'Invalid process, please contact the ICT team', life: 3000 });
            // console.error(error.response.status);
        } finally {
            isLoading.value = false
        }
    } else {
        toast.add({ severity: 'warn', summary: 'Attention', detail: 'Please complete the data', life: 3000 });
    }
};
</script>

<template>
    <div class="flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden bg-no-repeat bg-cover bg-center" style="background-image: url('/layout/bg2.jpg');">
        <Toast position="top-center"/>
        <div class="md:flex align-items-center justify-content-center w-full h-full px-3 lg:px-8 md:px-6 sm:px-4">
            <div class="w-full py-6 sm:py-2 px-5 sm:px-4" style="border-radius: 53px">
                <div class="text-center">
                    <img src="/layout/Portal.png" alt="PT.INL" class="w-20rem sm:w-30rem flex-shrink-0"/>
                </div>

            </div>
            <Divider layout="vertical" class="hidden md:block"/>
            <div class="w-full shadow-5 py-6 px-5 md:px-6 sm:px-4 bg-white" style="border-radius: 40px">

                <form @submit="onSubmit">
                    <h3 class="text-center">RESET PASSWORD</h3>
                    <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                    <InputText id="email1" type="email" placeholder="Email address" class="w-full mb-2" style="padding: 1rem" v-model="email" autocomplete="off" disabled />
                    <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                    <Password id="password1" v-model="password" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                    <label for="password2" class="block text-900 font-medium text-xl mb-2">Re-Password</label>
                    <Password id="password2" v-model="re_password" placeholder="Password" :feedback="false" :toggleMask="true" class="w-full mb-3" inputClass="w-full" inputStyle="padding:1rem"></Password>
                    <label v-if="isLoading == true" class="block text-900 text-xl font-medium mb-2">Loading ...</label>
                    <div class="flex gap-3">
                        <Button label="Back to Login" text icon="pi pi-arrow-left" severity="secondary" class="w-full text-xl" @click="link_back" rounded></Button>
                        <Button label="Submit" icon="pi pi-save" severity="info" class="w-full text-xl" type="submit" rounded></Button>
                    </div>
                    <Divider class="mt-5"/>
                    <div class="text-center hidden md:block">
                        <strong>Portal APPS - INL</strong> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari
                    </div>
                    <div class="text-center block md:hidden">
                        <h5>Portal APPS - INL</h5> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari
                    </div>
                    <!-- <Button label="Sign In" class="w-full p-3 text-xl" @click="onSubmit"></Button> -->
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
