import { createRouter, createWebHistory } from 'vue-router';
import { installViewTransitions } from '../lib/viewTransitions.js';
import Home from '../views/home.vue';
import Writing from '../views/writing.vue';
import Creative from '../views/creative.vue';
import About from '../views/about.vue';
import Photography from '../views/photography.vue';
import Projects from '../views/projects.vue';

// All lazily-loaded route components live here so the prefetcher
// (src/lib/prefetch.js) can warm them on idle without duplicating
// the dynamic import paths.
export const lazyLoaders = {
	'writing/ai_revolution_interfaces': () => import('../views/writing/ai_revolution_interfaces.vue'),
	'writing/twitter_open_source_algorithm': () => import('../views/writing/twitteralgorithm.vue'),
	'writing/gpt4_release': () => import('../views/writing/gpt4_release.vue'),
	'writing/llama_size_isnt_everything': () => import('../views/writing/llama_size_isnt_everything.vue'),
	'writing/search_google_vs_microsoft': () => import('../views/writing/search_google_vs_microsoft.vue'),
	'writing/feeds_worse_overtime': () => import('../views/writing/feeds_worse_overtime.vue'),
	'writing/browser_behavior_language': () => import('../views/writing/browser_behavior_language.vue'),
	'writing/takeaways_nvidia_22': () => import('../views/writing/takeaways_nvidia_22.vue'),
	'writing/recsys_2022': () => import('../views/writing/recsys22.vue'),
	'creative/watermelon': () => import('../views/creative/watermelon.vue'),
	'creative/kipling_if': () => import('../views/creative/kipling_if.vue'),
	'creative/keyboards': () => import('../views/creative/keyboards.vue'),
	'photography/faroe': () => import('../views/photo_categories/faroe.vue'),
	'photography/family': () => import('../views/photo_categories/family.vue'),
	'photography/life': () => import('../views/photo_categories/life.vue'),
	'photography/me&tim': () => import('../views/photo_categories/me&tim.vue'),
	'photography/milu': () => import('../views/photo_categories/milu.vue'),
	'photography/nature': () => import('../views/photo_categories/nature.vue'),
	'photography/street': () => import('../views/photo_categories/street.vue'),
	'photography/portraits': () => import('../views/photo_categories/portraits.vue'),
};

const routes = [
	{ path: '/index.html', redirect: '/' },
	{ path: '/', component: Home },
	{ path: '/writing', component: Writing },
	// Keyboards moved under creative — keep old links working.
	{ path: '/keyboards', redirect: '/creative/keyboards' },
	{ path: '/creative', component: Creative },
	{ path: '/about', component: About },
	{ path: '/projects', component: Projects },
	{ path: '/photography', component: Photography },
	...Object.entries(lazyLoaders).map(([slug, loader]) => ({
		path: '/' + slug,
		component: loader,
	})),
	{ path: '/:catchAll(.*)', redirect: '/' },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	// Instant jumps: an animated scroll on every route change reads as lag.
	// Smooth scrolling stays only for same-page anchor links.
	scrollBehavior(to, from, savedPosition) {
		if (savedPosition) return savedPosition;
		if (to.hash) return { el: to.hash, behavior: 'smooth' };
		return { top: 0 };
	},
});

installViewTransitions(router);

export default router;
