import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppLayouts from '@/layout/layout_sso/AppLayouts.vue';
import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // {
        //     path: '/',
        //     component: AppLayouts,
        //     redirect:'/home',
        //     children: [
        //         {
        //             path: '/home',
        //             name: 'home',
        //             component: () => import('@/views/sso/HomePage.vue'),
        //             meta:{
        //                 requiresAuth: true,
        //             }
        //         },
        //     ],
        // },
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
            path: '/',
            component: AppLayout2,
            redirect:'/user-profile',
            children: [
            ]
        },
        // {
        //     path: '/landing',
        //     name: 'landing',
        //     component: () => import('@/views/pages/Landing.vue')
        // },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login2.vue'),
            meta:{
                guestOnly:true,
            }
        },
        // {
        //     path: '/auth/login',
        //     name: 'login',
        //     component: () => import('@/views/pages/auth/Signin.vue'),
        //     meta:{
        //         guestOnly:true,
        //     }
        // },
        // {
        //     path: '/auth/access',
        //     name: 'accessDenied',
        //     component: () => import('@/views/pages/auth/Access.vue')
        // },
        // {
        //     path: '/auth/error',
        //     name: 'error',
        //     component: () => import('@/views/pages/auth/Error.vue')
        // }
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
