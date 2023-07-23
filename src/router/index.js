import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import AppLayout2 from '@/layout/layout_sso/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        // {
        //     path: '/',
        //     component: AppLayout,
        //     redirect:'/home',
        //     children: [
        //         {
        //             path: '/',
        //             name: 'dashboard',
        //             component: () => import('@/views/Dashboard.vue')
        //         },
        //         {
        //             path: '/uikit/formlayout',
        //             name: 'formlayout',
        //             component: () => import('@/views/uikit/FormLayout.vue')
        //         },
        //         {
        //             path: '/uikit/input',
        //             name: 'input',
        //             component: () => import('@/views/uikit/Input.vue')
        //         },
        //         {
        //             path: '/uikit/floatlabel',
        //             name: 'floatlabel',
        //             component: () => import('@/views/uikit/FloatLabel.vue')
        //         },
        //         {
        //             path: '/uikit/invalidstate',
        //             name: 'invalidstate',
        //             component: () => import('@/views/uikit/InvalidState.vue')
        //         },
        //         {
        //             path: '/uikit/button',
        //             name: 'button',
        //             component: () => import('@/views/uikit/Button.vue')
        //         },
        //         {
        //             path: '/uikit/table',
        //             name: 'table',
        //             component: () => import('@/views/uikit/Table.vue')
        //         },
        //         {
        //             path: '/uikit/list',
        //             name: 'list',
        //             component: () => import('@/views/uikit/List.vue')
        //         },
        //         {
        //             path: '/uikit/tree',
        //             name: 'tree',
        //             component: () => import('@/views/uikit/Tree.vue')
        //         },
        //         {
        //             path: '/uikit/panel',
        //             name: 'panel',
        //             component: () => import('@/views/uikit/Panels.vue')
        //         },

        //         {
        //             path: '/uikit/overlay',
        //             name: 'overlay',
        //             component: () => import('@/views/uikit/Overlay.vue')
        //         },
        //         {
        //             path: '/uikit/media',
        //             name: 'media',
        //             component: () => import('@/views/uikit/Media.vue')
        //         },
        //         {
        //             path: '/uikit/menu',
        //             component: () => import('@/views/uikit/Menu.vue'),
        //             children: [
        //                 {
        //                     path: '/uikit/menu',
        //                     component: () => import('@/views/uikit/menu/PersonalDemo.vue')
        //                 },
        //                 {
        //                     path: '/uikit/menu/seat',
        //                     component: () => import('@/views/uikit/menu/SeatDemo.vue')
        //                 },
        //                 {
        //                     path: '/uikit/menu/payment',
        //                     component: () => import('@/views/uikit/menu/PaymentDemo.vue')
        //                 },
        //                 {
        //                     path: '/uikit/menu/confirmation',
        //                     component: () => import('@/views/uikit/menu/ConfirmationDemo.vue')
        //                 }
        //             ]
        //         },
        //         {
        //             path: '/uikit/message',
        //             name: 'message',
        //             component: () => import('@/views/uikit/Messages.vue')
        //         },
        //         {
        //             path: '/uikit/file',
        //             name: 'file',
        //             component: () => import('@/views/uikit/File.vue')
        //         },
        //         {
        //             path: '/uikit/charts',
        //             name: 'charts',
        //             component: () => import('@/views/uikit/Chart.vue')
        //         },
        //         {
        //             path: '/uikit/misc',
        //             name: 'misc',
        //             component: () => import('@/views/uikit/Misc.vue')
        //         },
        //         {
        //             path: '/blocks',
        //             name: 'blocks',
        //             component: () => import('@/views/utilities/Blocks.vue')
        //         },
        //         {
        //             path: '/utilities/icons',
        //             name: 'icons',
        //             component: () => import('@/views/utilities/Icons.vue')
        //         },
        //         {
        //             path: '/pages/timeline',
        //             name: 'timeline',
        //             component: () => import('@/views/pages/Timeline.vue')
        //         },
        //         {
        //             path: '/pages/empty',
        //             name: 'empty',
        //             component: () => import('@/views/pages/Empty.vue')
        //         },
        //         {
        //             path: '/pages/crud',
        //             name: 'crud',
        //             component: () => import('@/views/pages/Crud.vue')
        //         },
        //         {
        //             path: '/documentation',
        //             name: 'documentation',
        //             component: () => import('@/views/utilities/Documentation.vue')
        //         }
        //     ]
        // },
        {
            path: '/',
            component: AppLayout2,
            redirect:'/home',
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/sso/Home.vue'),
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
                    path: '/management-user',
                    name: 'managementuser',
                    component: () => import('@/views/sso/ManagementUser.vue'),
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
