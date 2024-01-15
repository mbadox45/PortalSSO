import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppLayouts from '@/layout/layout_sso/AppLayouts.vue';
import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            redirect:'/home',
            children: [
                {
                    path: '/management-user',
                    name: 'managementuser',
                    component: () => import('@/views/sso/ManagementUser.vue'),
                    meta:{
                        requiresAuth: true,
                    }
                },
                {
                    path: '/master-apps',
                    component: () => import('@/views/sso/MasterApps.vue'),
                    children: [
                        {
                            path: '/master-apps',
                            name: 'masterapps',
                            component: () => import('@/views/sso/master/Apps.vue')
                        },
                        {
                            path: '/master-apps/akses',
                            name:'masterappsaccess',
                            component: () => import('@/views/sso/master/Akses.vue')
                        },
                    ],
                    meta:{
                        requiresAuth: true,
                    },
                },
                {
                    path: '/divisi',
                    name: 'divisi',
                    component: () => import('@/views/sso/master/Divisi.vue'),
                    meta:{
                        requiresAuth: true,
                    }
                },
                {
                    path: '/add-user/',
                    name: 'adduser',
                    component: () => import('@/views/sso/forms/FormUser.vue'),
                    meta:{
                        requiresAuth: true,
                    }
                },
                {
                    path: '/edit-user/:id',
                    name: 'edituser',
                    component: () => import('@/views/sso/forms/FormUser.vue'),
                    meta:{
                        requiresAuth: true,
                    }
                },
            ],
        },
        {
            path: '/home',
            name: 'dashboard',
            component: () => import('@/views/sso/home/Index.vue'),
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/user-profile',
            name: 'userprofile',
            component: () => import('@/views/sso/UserProfile.vue'),
            meta:{
                requiresAuth: true,
            }
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/forgot/password',
            name: 'forgot-password',
            component: () => import('@/views/pages/auth/ForgotPassword.vue'),
            meta:{
                guestOnly:true,
            }
        },
        {
            path: '/reset/password',
            name: 'reset-password',
            component: () => import('@/views/pages/auth/ResetPassword.vue'),
            meta:{
                guestOnly:true,
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    const tokens = localStorage.getItem('usertoken') != null;

    if (to.matched.some((route) => route.meta.requiresAuth)) {
        if (tokens) {
            next();
        } else {
            next('/auth/login');
        }
    } else if (to.matched.some((route) => route.meta.guestOnly)) {
        if (tokens) {
            next('/home');
        } else {
            next();
        }
    } else {
        next();
    }
})

export default router;
