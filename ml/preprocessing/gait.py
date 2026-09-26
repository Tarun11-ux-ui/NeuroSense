from __future__ import annotations

import numpy as np
import pandas as pd

GAIT_WINDOW_SAMPLES = 5 * 64
MIN_GAIT_DURATION_SECONDS = 4.0


def signal_matrix(frame):
    """Convert raw gait telemetry into the nine channels used by Daphnet features."""
    if frame is None or len(frame) == 0:
        return np.empty((0, 9), dtype=float)

    data = frame.copy() if isinstance(frame, pd.DataFrame) else pd.DataFrame(frame)
    nested_pose = {"leftAnkle", "rightAnkle"}.issubset(data.columns)

    if nested_pose:
        left = pd.json_normalize(data["leftAnkle"]).reindex(columns=["x", "y", "z"])
        right = pd.json_normalize(data["rightAnkle"]).reindex(columns=["x", "y", "z"])
        delta = left.to_numpy(dtype=float) - right.to_numpy(dtype=float)
        values = np.column_stack(
            [left.to_numpy(dtype=float), right.to_numpy(dtype=float), delta]
        )
    else:
        excluded = {"timestamp", "time", "t", "label", "annotation"}
        numeric = data.drop(
            columns=[column for column in data.columns if str(column) in excluded],
            errors="ignore",
        ).apply(pd.to_numeric, errors="coerce")
        values = numeric.to_numpy(dtype=float)[:, :9]

    values = np.nan_to_num(values, nan=0.0, posinf=0.0, neginf=0.0)
    if values.shape[1] < 9:
        values = np.pad(values, ((0, 0), (0, 9 - values.shape[1])))
    return values[:, :9]


def prepare_inference_window(frame):
    """Validate and resample one raw capture to the model's 5-second window."""
    data = frame.copy() if isinstance(frame, pd.DataFrame) else pd.DataFrame(frame)
    if len(data) < 2:
        raise ValueError("Gait capture is too short. Record at least 4 seconds of movement.")

    timestamp_column = next(
        (column for column in ("timestamp", "time", "t") if column in data.columns),
        None,
    )
    if timestamp_column is None:
        raise ValueError("Gait telemetry must include timestamps for duration validation.")

    timestamps = pd.to_numeric(data[timestamp_column], errors="coerce").to_numpy(dtype=float)
    timestamps = timestamps[np.isfinite(timestamps)]
    if len(timestamps) < 2:
        raise ValueError("Gait telemetry contains invalid timestamps.")
    duration = (timestamps.max() - timestamps.min()) / (1000.0 if timestamps.max() > 100.0 else 1.0)
    if duration < MIN_GAIT_DURATION_SECONDS:
        raise ValueError(
            f"Gait capture is too short ({duration:.1f}s). Record at least 4 seconds of movement."
        )

    values = signal_matrix(data)
    source_times = np.linspace(0.0, duration, len(values))
    target_times = np.linspace(0.0, MIN_GAIT_DURATION_SECONDS, GAIT_WINDOW_SAMPLES)
    return np.column_stack(
        [np.interp(target_times, source_times, values[:, index]) for index in range(values.shape[1])]
    )


def windows(frame, window_size, step=None):
    step = step or window_size
    return [
        frame[i : i + window_size]
        for i in range(0, max(0, len(frame) - window_size + 1), step)
    ]
