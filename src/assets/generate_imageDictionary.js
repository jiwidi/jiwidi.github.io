import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import {
	fileURLToPath
} from 'url';
import {
	dirname
} from 'path';

const __filename = fileURLToPath(
	import.meta.url);
const __dirname = dirname(__filename);
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.bmp',
	'.svg'
]);

const basePath = __dirname + '/img/photography/';
const image_base_path = '/assets/img/photography/';
const thumbnailsPath = path.join(__dirname, 'thumbnails');

// Ensure the thumbnails directory exists
if (!fs.existsSync(thumbnailsPath)) {
	fs.mkdirSync(thumbnailsPath, {
		recursive: true
	});
}

const generateImageDictionary = (basePath) => {
	const imageDictionary = {
		".": []
	};

	const walkSync = (dir, relativePath) => {
		const files = fs.readdirSync(dir);

		files.forEach((file) => {
			const filePath = path.join(dir, file);
			const fileStat = fs.statSync(filePath);

			if (fileStat.isDirectory()) {
				const subDirPath = path.join(thumbnailsPath,
					relativePath, file);
				if (!fs.existsSync(subDirPath)) {
					fs.mkdirSync(subDirPath, {
						recursive: true
					});
				}
				walkSync(filePath, path.join(relativePath,
					file)); // Recursive call for subdirectories
			} else if (imageExtensions.has(path.extname(file)
					.toLowerCase())) {
				const key = relativePath === '' ? '.' :
					relativePath;
				if (!imageDictionary[key]) {
					imageDictionary[key] = [];
				}
				const relativeFilePath = key === '.' ? file :
					path.join(key, file);
				const thumbnailFilePath = path.join(
					thumbnailsPath, relativeFilePath);


				// Generate thumbnail
				sharp(filePath)
					.resize({
						width: 800
					})
					.toFormat(
						'jpeg'
					) // Convert to jpeg for size efficiency
					.toFile(thumbnailFilePath, (err, info) => {
						if (err) throw err;
					});

				// Add to image dictionary
				imageDictionary[key].push(image_base_path +
					relativeFilePath);
			}
		});
	};

	walkSync(basePath, '');

	return imageDictionary;
};

// Get current image dictionary
const imageDictionary = generateImageDictionary(basePath);

// Write the dictionary to a JSON file
fs.writeFileSync(path.join(__dirname, 'imageDictionary.json'), JSON.stringify(
	imageDictionary, null, 2), 'utf-8');
