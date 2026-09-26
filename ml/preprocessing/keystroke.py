from __future__ import annotations
import numpy as np
import pandas as pd
def clean_events(frame):
    """Uses timing only; filters mouse and long modifier events, preserving no text."""
    f=frame.copy()
    # rename columns safely if they use different names, but frontend uses key, press, release, hold
    required = ["key", "press", "release", "hold"]
    if not all(c in f.columns for c in required):
        return pd.DataFrame(columns=required)
        
    f["key"]=f["key"].astype(str)
    f=f[~f.key.str.contains("mouse|Shift|Alt|Control|BackSpace", case=False, regex=True)]
    for c in ("hold","release","press"): f[c]=np.asarray(f[c],dtype=float)
    return f[(f.hold>=0)&(f.hold<5)&(f.press>0)&(f.release>0)]
