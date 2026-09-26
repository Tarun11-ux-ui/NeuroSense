import numpy as np
def extract(image):
    gy,gx=np.gradient(image); mag=np.hypot(gx,gy)
    return {"ink_fraction":float((image<.8).mean()),"intensity_std":float(image.std()),"edge_mean":float(mag.mean()),"edge_std":float(mag.std())}
