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

	// {
	// 	path: '/creative/photos/watermelon',
	// 	redirect: 'src/assets/photos/creative/watermelon.jpg'
	// },
	// {
	// 	path: '/:catchAll(.*)',
	// 	redirect: '/'
	// }
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
