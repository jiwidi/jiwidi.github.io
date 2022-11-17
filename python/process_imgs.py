from PIL import Image
import PIL
import os
import glob
import argparse
from tqdm import tqdm


def main(args):
    #  python python/process_imgs.py --input_dir ~/Library/Mobile\ Documents/com~apple~CloudDocs/Photos/personal_gallery/ --output_dir photos/images/
    # Create thumbnails path if it doesnt exists
    thumbnails_path = os.path.join(args.output_dir, 'thumbnails')
    fullsize_path = os.path.join(args.output_dir, 'fullsize')
    if not os.path.exists(thumbnails_path):
        os.makedirs(thumbnails_path)
    if not os.path.exists(fullsize_path):
        os.makedirs(fullsize_path)

    # Read them with PIL and resize them to 50% its size in thumbnails format.
    all_pics = list(glob.iglob(args.input_dir + '**/**', recursive=True))
    #Glob and icloud for some reason returns double the number of files, we use a set to fix that.
    i=0
    max_size = [512,512]
    seen = set()
    for pic in tqdm(all_pics):
        if (pic not in seen):
            try:
                im = Image.open(pic)
                im.convert('RGB').save(os.path.join(fullsize_path, f"{i}.jpg"), 'jpeg')
                im.thumbnail(max_size)
                im.convert('RGB').save(os.path.join(thumbnails_path, f"{i}.jpg"), 'jpeg')
                i+=1
            except:
                continue
        seen.add(pic)


if __name__ == "__main__":
    """
    This scripts takes an input dir where is expencting to find a folder "raw" with a set of images and processed them,
    saving the results in a different folder "thumbnailsg" within the same input dir.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--input_dir', type=str, help='input directory')
    parser.add_argument('--output_dir', type=str, help='output directory')
    args = parser.parse_args()
    main(args)
