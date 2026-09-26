from PIL import Image, ImageOps
import numpy as np
def load_image(path, size=(128,128)):
    return np.asarray(ImageOps.grayscale(Image.open(path)).resize(size), dtype=np.float32)/255.
