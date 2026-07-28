import { lazyLoaders } from '../router/index.js';
import imageDictionary from '../assets/imageDictionary.json';
import { photoCategories } from './siteContent.js';

const onIdle = (cb, timeout = 2000) => {
	if (typeof window === 'undefined') return;
	if ('requestIdleCallback' in window) {
		window.requestIdleCallback(cb, { timeout });
	} else {
		setTimeout(cb, 600);
	}
};

const isSlowConnection = () => {
	if (typeof navigator === 'undefined') return false;
	const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
	if (!c) return false;
	if (c.saveData) return true;
	if (c.effectiveType && /^(slow-)?2g$/.test(c.effectiveType)) return true;
	return false;
};

const queueImport = (loader, delay) => {
	setTimeout(() => {
		try { loader().catch(() => { /* swallow — prefetch is best-effort */ }); }
		catch (e) { /* noop */ }
	}, delay);
};

// Warm every lazily-loaded route chunk so navigation renders synchronously.
export const prefetchRoutes = () => {
	const loaders = Object.values(lazyLoaders);
	loaders.forEach((loader, i) => queueImport(loader, i * 30));
};

// Insert a <link rel="prefetch"> for an image URL (browser caches it).
const prefetchUrl = (url) => {
	const link = document.createElement('link');
	link.rel = 'prefetch';
	link.as = 'image';
	link.href = url;
	document.head.appendChild(link);
};

const toThumb = (url) => url.replace('/original/', '/thumbnails/');

// Cover images shown by photoGrid on /photography — small, always worth prefetching.
export const prefetchPhotoCovers = () => {
	photoCategories.forEach((category) => prefetchUrl(category.image));
};

// All gallery thumbnails for a given section. Used when the user is already on
// /photography — we assume they're about to dive into a category.
export const prefetchSectionThumbs = (section) => {
	const list = imageDictionary[section];
	if (!Array.isArray(list)) return;
	list.forEach(url => prefetchUrl(toThumb(url)));
};

// All sections — only call from /photography.
export const prefetchAllSectionThumbs = () => {
	Object.keys(imageDictionary).forEach(section => {
		if (section === '.') return;
		prefetchSectionThumbs(section);
	});
};

// Top-level entrypoint — call once after first paint.
export const startBackgroundPrefetch = () => {
	if (isSlowConnection()) return;
	onIdle(() => {
		prefetchRoutes();
		prefetchPhotoCovers();
	});
};
