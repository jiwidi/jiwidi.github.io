import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '../views/Home.vue';
import Writing from '../views/Writing.vue';
import Keyboard from '../views/Keyboards.vue';
import Creative from '../views/Creative.vue';
import About from '../views/About.vue';
import Photography from '../views/Photography.vue';
import Faroe from '../views/photo_categories/faroe.vue';


const photo_sections = ['faroe', 'family', 'life', 'me&tim', 'milu', 'nature',
	'street', 'valencia', 'portraits'
]
const routes = [{
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
