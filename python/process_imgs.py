from PIL import Image
import PIL
import os
import glob
import argparse
from tqdm import tqdm


def main(args):
    images_path = os.path.join(args.input_dir, 'raw')

    # Create thumbnails path if it doesnt exists
    thumbnails_path = os.path.join(args.input_dir, 'thumbnails')
    fullsize_path = os.path.join(args.input_dir, 'fullsize')
    if not os.path.exists(thumbnails_path):
        os.makedirs(thumbnails_path)
    if not os.path.exists(fullsize_path):
        os.makedirs(fullsize_path)

    # Read them with PIL and resize them to 50% its size in thumbnails format.
    all_pics = list(glob.iglob(images_path + '**/**', recursive=True))
    i=0
    max_size = [1024,1024]
    for pic in tqdm(all_pics):
        if "jpg" in pic or "png" in pic:
            im = Image.open(os.path.join(pic))
            im.convert('RGB').save(os.path.join(fullsize_path, f"{i}.jpg"), 'jpeg')
            im.thumbnail(max_size)
            im.convert('RGB').save(os.path.join(thumbnails_path, f"{i}.jpg"), 'jpeg')
            i+=1


if __name__ == "__main__":
    """
    This scripts takes an input dir where is expencting to find a folder "raw" with a set of images and processed them,
    saving the results in a different folder "thumbnailsg" within the same input dir.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_dir', type=str, help='input directory')
    args = parser.parse_args()
    main(args)
