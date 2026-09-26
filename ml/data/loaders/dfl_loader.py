from __future__ import annotations
import zipfile, pandas as pd
from ml.config import DATASETS
def sessions(root=DATASETS/'DFL Mouse Dynamics Dataset'):
    """DFL has per-user archives; it supplies behavior traces, no clinical outcome."""
    for archive in root.glob('User*.zip'):
        with zipfile.ZipFile(archive) as z:
            for n in z.namelist():
                if n.lower().endswith('.csv'):
                    yield pd.read_csv(z.open(n), on_bad_lines='skip'), archive.stem, None, n
