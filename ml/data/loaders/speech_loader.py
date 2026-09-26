from __future__ import annotations
import io, zipfile, pandas as pd
from ml.config import DATASETS
ARCHIVE=DATASETS/'Parkinson Speech Dataset (UCI).zip'
def load_voice(archive=ARCHIVE):
    with zipfile.ZipFile(archive) as z: frame=pd.read_csv(z.open('parkinsons.data'))
    # `phon_R01_S01_1` identifies the person as R01_S01; recording suffix is removed.
    frame['subject_id']=frame['name'].str.rsplit('_',n=1).str[0]
    return frame
