from __future__ import annotations
import zipfile, re
from pathlib import Path
from ml.config import DATASETS
ARCHIVE=DATASETS/'NewHandPd Dataset.zip'
def image_manifest(archive=ARCHIVE, spiral_only=False):
    """Yield (archive member, class-scoped subject ID, PD/control label)."""
    with zipfile.ZipFile(archive) as z:
        for n in z.namelist():
            if n.lower().endswith(('.jpg','.png','.jpeg')):
                if spiral_only and not any(part.endswith('Spiral') for part in n.split('/')):
                    continue
                # The supplied archive names its PD class folders `Patient...`.
                label=1 if '/Patient' in n or '/Parkinson' in n or '/Park' in n else 0 if '/Healthy' in n else None
                m=re.search(r'[-_]([A-Za-z]?\d+)\.(?:jpg|png|jpeg)$',n,re.I)
                if label is not None and m: yield n, f"{label}:{m.group(1).lower()}", label
