import numpy as np
def extract(window):
    x=np.asarray(window,float); result={}
    for i in range(x.shape[1]-1):
        s=x[:,i]; result.update({f"axis{i}_{k}":float(v) for k,v in {"mean":s.mean(),"std":s.std(),"rms":np.sqrt(np.mean(s*s)),"energy":np.mean(s*s),"dominant_frequency":np.argmax(np.abs(np.fft.rfft(s))[1:])+1}.items()})
    return result
