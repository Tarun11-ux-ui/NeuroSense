from __future__ import annotations
import zipfile, pandas as pd
from ml.config import DATASETS
ARCHIVE=DATASETS/'Mouse-Dynamics-Challenge-master.zip'
def labelled_sessions(archive=ARCHIVE):
    with zipfile.ZipFile(archive) as z:
        labels=pd.read_csv(z.open('Mouse-Dynamics-Challenge-master/public_labels.csv'))
        # Public labels are legal/illegal account-session labels, not medical labels.
        for _,row in labels.iterrows():
            session=str(row.iloc[0]); name=next((n for n in z.namelist() if n.endswith('/'+session)),None)
            if name:
                # Group by claimed account folder for a user-level holdout; labels are
                # legal/illegal authentication sessions, never medical labels.
                yield pd.read_csv(z.open(name)), name.split('/')[-2], int(row.iloc[-1]), name
