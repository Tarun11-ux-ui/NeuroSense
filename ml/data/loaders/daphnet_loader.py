from __future__ import annotations
import io, zipfile, re, pandas as pd
from ml.config import DATASETS
ARCHIVE=DATASETS/'daphnet+freezing+of+gait.zip'
def recordings(archive=ARCHIVE):
    """Columns per Daphnet documentation: time, ankle/leg/hip accelerometer axes, annotation."""
    with zipfile.ZipFile(archive) as z:
        for n in z.namelist():
            if re.search(r'dataset/S\d+R\d+\.txt$',n):
                f=pd.read_csv(z.open(n),sep=r'\s+',header=None)
                yield f, n.split('/')[-1][0:3], n
