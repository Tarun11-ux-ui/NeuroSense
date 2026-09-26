"""Dataset-safe utilities. Splits are always grouped when a subject is known."""
from __future__ import annotations
from pathlib import Path
import json
import zipfile
import numpy as np
from sklearn.model_selection import GroupShuffleSplit

def zip_members(archive: Path, suffix: str):
    with zipfile.ZipFile(archive) as z:
        return [n for n in z.namelist() if n.lower().endswith(suffix.lower())]

def grouped_split(X, y, groups, test_size=.25, seed=42):
    # Some small clinical cohorts are highly imbalanced by subject. Search deterministic
    # grouped candidates, never falling back to a sample-level split.
    for offset in range(100):
        split = GroupShuffleSplit(n_splits=1, test_size=test_size, random_state=seed + offset)
        train, test = next(split.split(X, y, groups))
        if len(np.unique(np.asarray(y)[train])) > 1 and len(np.unique(np.asarray(y)[test])) > 1:
            return train, test
    raise ValueError('No subject-level split contains both labels; a valid clinical evaluation cannot be run.')

def save_schema(path: Path, features):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps({"features": list(features)}, indent=2), encoding="utf-8")

def percentile_score(value, reference, higher_is_atypical=True):
    """0=typical, 1=atypical empirical percentile score; never clinical probability."""
    arr = np.asarray(reference, dtype=float)
    p = np.mean(arr <= value)
    return float(p if higher_is_atypical else 1 - p)
