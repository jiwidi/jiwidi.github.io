// Build-time photo pipeline.
//
// Walks src/assets/img/photography/original/ and produces, per image:
//   thumbnails/  — 800px wide, q75 (gallery grid)
//   medium_res/  — max 2048px wide, q75 (lightbox)
// plus two manifests next to this file:
//   imageDictionary.json — { section: [originalPath, ...] } (unchanged format)
//   imageMeta.json       — { originalPath: { w, h } } for aspect-ratio
//                          placeholders (no layout shift while lazy-loading)
//
// Generation is incremental: outputs newer than their source are skipped, so
// local runs and CI builds only pay for new or changed photos.

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg']);

const basePath = path.join(__dirname, 'img/photography');
const originalPath = path.join(basePath, 'original');
const mediumPath = path.join(basePath, 'medium_res');
const thumbnailsPath = path.join(basePath, 'thumbnails');

const PUBLIC_PREFIX = '/assets/img/photography/original/';

const THUMB_WIDTH = 800;
const MEDIUM_WIDTH = 2048;
const JPEG_QUALITY = 75;
const CONCURRENCY = 4;

const isUpToDate = (src, out) =>
	fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs;

// Collect every image under original/, keyed by section (subdirectory).
const collectImages = (dir, relativePath = '') => {
	const entries = [];
	for (const file of fs.readdirSync(dir).sort()) {
		const filePath = path.join(dir, file);
		const rel = relativePath === '' ? file : path.posix.join(relativePath, file);
		if (fs.statSync(filePath).isDirectory()) {
			entries.push(...collectImages(filePath, rel));
		} else if (imageExtensions.has(path.extname(file).toLowerCase())) {
			entries.push({ filePath, rel, section: relativePath === '' ? '.' : relativePath });
		}
	}
	return entries;
};

const processImage = async ({ filePath, rel }, meta) => {
	const thumbOut = path.join(thumbnailsPath, rel);
	const mediumOut = path.join(mediumPath, rel);
	fs.mkdirSync(path.dirname(thumbOut), { recursive: true });
	fs.mkdirSync(path.dirname(mediumOut), { recursive: true });

	// Dimensions as displayed (swap when EXIF orientation rotates the image).
	const md = await sharp(filePath).metadata();
	let { width, height } = md;
	if (md.orientation && md.orientation >= 5) [width, height] = [height, width];
	meta[PUBLIC_PREFIX + rel] = { w: width, h: height };

	if (!isUpToDate(filePath, thumbOut)) {
		await sharp(filePath)
			.rotate() // bake EXIF orientation
			.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
			.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
			.toFile(thumbOut);
	}

	if (!isUpToDate(filePath, mediumOut)) {
		await sharp(filePath)
			.rotate()
			.resize({ width: MEDIUM_WIDTH, withoutEnlargement: true })
			.jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
			.toFile(mediumOut);
	}
};

const run = async () => {
	const images = collectImages(originalPath);

	const dictionary = { '.': [] };
	for (const { rel, section } of images) {
		if (!dictionary[section]) dictionary[section] = [];
		dictionary[section].push(PUBLIC_PREFIX + rel);
	}

	const meta = {};
	const queue = [...images];
	let failures = 0;
	await Promise.all(
		Array.from({ length: CONCURRENCY }, async () => {
			while (queue.length) {
				const job = queue.pop();
				try {
					await processImage(job, meta);
				} catch (err) {
					failures += 1;
					console.error(`[images] failed on ${job.rel}: ${err.message}`);
				}
			}
		})
	);

	// Stable key order so the committed manifests diff cleanly.
	const sortedMeta = Object.fromEntries(
		Object.keys(meta).sort().map((k) => [k, meta[k]])
	);

	fs.writeFileSync(
		path.join(__dirname, 'imageDictionary.json'),
		JSON.stringify(dictionary, null, 2),
		'utf-8'
	);
	fs.writeFileSync(
		path.join(__dirname, 'imageMeta.json'),
		JSON.stringify(sortedMeta, null, 2),
		'utf-8'
	);

	console.log(`[images] ${images.length} photos, ${failures} failures`);
	if (failures > 0) process.exitCode = 1;
};

run();
