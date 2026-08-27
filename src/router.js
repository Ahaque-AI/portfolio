/**
 * vue-router config.
 *
 * - `/`              → HomePage (long-form essay with all sections)
 * - `/projects/:slug` → ProjectPage (case-study for one project)
 * - `/:pathMatch(.*)*` → NotFoundPage
 *
 * Uses HTML5 history mode (clean URLs, no hash). Static-host-friendly:
 *   - Surge, Netlify, Cloudflare Pages, GitHub Pages (with SPA fallback) all support this.
 *   - For Surge, no `_redirects` needed — `200.html` fallback works automatically.
 */
import { createRouter, createWebHistory } from 'vue-router';
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('./pages/HomePage.vue'),
        meta: { title: 'Abdul Haque — AI Software Engineer' },
    },
    {
        path: '/projects/:slug',
        name: 'project',
        component: () => import('./pages/ProjectPage.vue'),
        props: true,
        meta: { title: 'Project — Abdul Haque' },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('./pages/NotFoundPage.vue'),
        meta: { title: 'Not found — Abdul Haque', noindex: true },
    },
];
export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition)
            return savedPosition;
        if (to.hash)
            return { el: to.hash, behavior: 'smooth', top: 80 };
        return { top: 0, behavior: 'instant' };
    },
});
router.afterEach((to) => {
    const title = to.meta.title ?? 'Abdul Haque — AI Software Engineer';
    document.title = title;
});
