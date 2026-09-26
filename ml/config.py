from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATASETS = ROOT / "datasets"
ARTIFACTS = ROOT / "models"
RESULTS = ROOT / "results"
SEED, TEST_SIZE = 42, 0.25
WINDOW_SECONDS, DAPHNET_HZ = 5, 64

for directory in (ARTIFACTS, RESULTS, RESULTS / "plots"):
    directory.mkdir(parents=True, exist_ok=True)
