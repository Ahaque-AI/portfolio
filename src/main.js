/**
 * Vue app bootstrap.
 *
 * - Self-hosted fonts (Fraunces Variable + Geist Variable)
 * - Global stylesheet (editorial palette + paper grain + drop caps)
 * - Router (vue-router for /projects/:slug)
 * - Strict-mode mount
 */
import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import '@fontsource-variable/fraunces/wght.css';
import '@fontsource-variable/fraunces/wght-italic.css';
import '@fontsource-variable/fraunces/soft.css';
import '@fontsource-variable/geist/wght.css';
import './style.css';
createApp(App).use(router).mount('#app');
