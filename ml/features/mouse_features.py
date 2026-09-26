import numpy as np
def extract(events):
    a=events.to_numpy(float)
    if len(a)<3:return {k:0. for k in ("distance","velocity_mean","velocity_std","acceleration_mean","jerk_mean","straightness","direction_changes")}
    dt=np.diff(a[:,0]); dxy=np.diff(a[:,1:3],axis=0); dist=np.linalg.norm(dxy,axis=1); valid=dt>0
    v=dist[valid]/dt[valid]; acc=np.diff(v); jerk=np.diff(acc)
    straight=np.linalg.norm(a[-1,1:3]-a[0,1:3])/(dist.sum()+1e-9); angles=np.unwrap(np.arctan2(dxy[:,1],dxy[:,0]))
    return {"distance":float(dist.sum()),"velocity_mean":float(v.mean()) if len(v) else 0.,"velocity_std":float(v.std()) if len(v) else 0.,"acceleration_mean":float(np.abs(acc).mean()) if len(acc) else 0.,"jerk_mean":float(np.abs(jerk).mean()) if len(jerk) else 0.,"straightness":float(straight),"direction_changes":float(np.sum(np.abs(np.diff(angles))>.5))}
