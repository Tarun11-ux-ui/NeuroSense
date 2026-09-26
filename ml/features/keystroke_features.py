import numpy as np
def extract(events):
    if len(events) == 0:
        return {
            "n_events": 0, "typing_rate": 0.,
            "hold_mean": 0., "hold_std": 0., "hold_median": 0., "hold_p90": 0.,
            "flight_mean": 0., "flight_std": 0., "flight_median": 0., "flight_p90": 0.
        }
    h=events.hold.to_numpy(float); p=events.press.to_numpy(float); flight=np.diff(p)
    def stats(x, prefix):
        if len(x) == 0: return {f"{prefix}_{k}": 0. for k in ("mean", "std", "median", "p90")}
        return {f"{prefix}_{k}": float(v) for k,v in {"mean":np.mean(x),"std":np.std(x),"median":np.median(x),"p90":np.percentile(x,90)}.items()}
    result={"n_events":len(h), "typing_rate":float(len(h)/(p[-1]-p[0])) if len(h)>1 and p[-1]>p[0] else 0.}
    result.update(stats(h,"hold")); result.update(stats(flight,"flight")); return result
