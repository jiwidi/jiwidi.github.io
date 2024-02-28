import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '../views/home.vue'; // Adjusted to relative path
import Writing from '../views/writing.vue'; // Adjusted to relative path
import Keyboard from '../views/keyboards.vue'; // Adjusted to relative path
import Creative from '../views/creative.vue'; // Adjusted to relative path
import About from '../views/about.vue'; // Adjusted to relative path
import Photography from '../views/photography.vue'; // Adjusted to relative path
import Faroe from '../views/photo_categories/faroe.vue'; // Adjusted to relative path
import Projects from '../views/projects.vue'; // Adjusted to relative path

const photo_sections = [
	'faroe', 'family', 'life', 'me&tim', 'milu', 'nature', 'street',
	'valencia', 'portraits'
];
const routes = [{
		path: '/index.html',
		redirect: '/'
	},
	{
		path: '/',
		component: Home
	},
	{
		path: '/writing',
		component: Writing
	},
	{
		path: '/keyboards',
		component: Keyboard
	},
	{
		path: '/creative',
		component: Creative
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/projects',
		component: Projects
	},
	{
		path: '/photography',
		component: Photography
	},
	// Create a route for each photo section
	...photo_sections.map(section => {
		return {
			path: `/photography/${section}`,
			component: () =>
				import(`../views/photo_categories/${section}.vue`)
		}
	}),
	{
		path: '/writing/twitter_open_source_algorithm',
		component: () =>
			import('../views/writing/twitteralgorithm.vue')
	},
	{
		path: '/writing/gpt4_release',
		component: () =>
			import('../views/writing/gpt4_release.vue')
	},
	{
		path: '/writing/llama_size_isnt_everything',
		component: () =>
			import('../views/writing/llama_size_isnt_everything.vue')
	},
	{
		path: '/writing/search_google_vs_microsoft',
		component: () =>
			import('../views/writing/search_google_vs_microsoft.vue')
	},
	{
		path: '/writing/feeds_worse_overtime',
		component: () =>
			import('../views/writing/feeds_worse_overtime.vue')
	},
	{
		path: '/writing/browser_behavior_language',
		component: () =>
			import('../views/writing/browser_behavior_language.vue')
	},
	{
		path: '/writing/takeaways_nvidia_22',
		component: () =>
			import('../views/writing/takeaways_nvidia_22.vue')
	},
	{
		path: '/writing/recsys_2022',
		component: () =>
			import('../views/writing/recsys22.vue')
	},
	{
		path: '/creative/watermelon',
		component: () =>
			import('../views/creative/watermelon.vue')
	},
	{
		path: '/:catchAll(.*)',
		redirect: '/'
	}
];

const router = createRouter({
	mode: 'history',
	history: createWebHistory(),
	routes,
});

export default router;
