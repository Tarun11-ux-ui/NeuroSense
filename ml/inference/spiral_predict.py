"""Inference adapter for raw spiral drawing points."""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
from PIL import Image, ImageDraw
from skimage.feature import hog

from ml.config import ARTIFACTS


MODEL_PATH = ARTIFACTS / "spiral" / "best_spiral_model.pkl"


def predict_from_points(points: list[dict], width: float = 400, height: float = 400) -> dict:
    if len(points) < 50:
        raise ValueError("Spiral drawing is too short. Trace at least 50 points.")

    image = Image.new("L", (128, 128), 255)
    draw = ImageDraw.Draw(image)
    scaled = [
        (float(point["x"]) * 127 / width, float(point["y"]) * 127 / height)
        for point in points
    ]
    draw.line(scaled, fill=0, width=3, joint="curve")
    pixels = np.asarray(image, dtype=np.float32) / 255.0
    features = hog(
        pixels,
        orientations=9,
        pixels_per_cell=(16, 16),
        cells_per_block=(2, 2),
        block_norm="L2-Hys",
    )

    if not MODEL_PATH.exists():
        raise FileNotFoundError(f"Trained spiral model not found: {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)
    base_probability = float(model.predict_proba([features])[0, 1])

    # Advanced Tremor Analysis: Velocity and Pressure variance
    times = np.array([p["t"] for p in points])
    x_coords = np.array([p["x"] for p in points])
    y_coords = np.array([p["y"] for p in points])
    pressures = np.array([p.get("pressure", 0.5) for p in points])
    
    dt = np.diff(times)
    # Avoid zero division
    dt[dt == 0] = 1.0 
    dx = np.diff(x_coords)
    dy = np.diff(y_coords)
    
    velocities = np.sqrt(dx**2 + dy**2) / dt
    
    velocity_variance = float(np.var(velocities))
    pressure_variance = float(np.var(pressures))
    
    # Heuristics for Tremor
    # High velocity variance -> jerky movements
    # High pressure variance -> unstable grip
    tremor_penalty = 0.0
    if velocity_variance > 0.05:  # threshold is heuristic, can be tuned
        tremor_penalty += 0.15
    if pressure_variance > 0.02:
        tremor_penalty += 0.15

    final_probability = min(1.0, base_probability + tremor_penalty)
    prediction = "Atypical (Deviated/Tremor)" if final_probability >= 0.5 else "Healthy (Typical)"

    return {
        "modality": "spiral",
        "prediction": prediction,
        "score": final_probability,
        "confidence": max(final_probability, 1.0 - final_probability),
        "score_type": "classification_probability",
        "model_version": "HOG-SVM",
        "explanation": {},
    }
