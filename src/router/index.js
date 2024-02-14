import {
	createRouter,
	createWebHistory
} from 'vue-router';
import Home from '/src/views/Home.vue';
import Writing from '/src/views/Writing.vue';
import Keyboard from '/src/views/Keyboards.vue';
import Creative from '/src/views/Creative.vue';
import About from '/src/views/About.vue';
import Photography from '/src/views/Photography.vue';
import Faroe from '/src/views//photo_categories/faroe.vue';


const photo_sections = ['faroe', 'family', 'life', 'me&tim', 'milu', 'nature',
	'street', 'valencia', 'portraits'
]
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
				import(`/src/views//photo_categories/${section}.vue`)
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
