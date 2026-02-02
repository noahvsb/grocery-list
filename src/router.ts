import { createRouter, createWebHistory } from 'vue-router'

import { HomePage, NotFoundPage } from './pages/pages.ts';

const router = createRouter({
    history: createWebHistory('/grocery-list/'),
    routes: [
        { path: '/', component: HomePage },
        { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundPage }
    ]
});

export default router;