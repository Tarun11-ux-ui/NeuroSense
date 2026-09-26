from __future__ import annotations
import pandas as pd
def clean_events(frame):
    f=frame.copy(); f.columns=[str(c).strip().lower() for c in f.columns]
    candidates={"record timestamp":"t","record_timestamp":"t","client timestamp":"t","client_timestamp":"t","timestamp":"t","x":"x","y":"y"}
    f=f.rename(columns={k:v for k,v in candidates.items() if k in f})
    required=[c for c in ("t","x","y") if c in f]
    if len(required)!=3: return pd.DataFrame(columns=['t','x','y'])
    return f[required].apply(pd.to_numeric, errors="coerce").dropna()
