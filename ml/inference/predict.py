"""Programmatic inference adapters; reuse feature modules rather than duplicating transformations."""
from __future__ import annotations

import pandas as pd

from ml.features.gait_features import extract as gait_features
from ml.features.keystroke_features import extract as key_features
from ml.features.mouse_features import extract as mouse_features
from ml.fusion.fusion_engine import fuse
from ml.preprocessing.gait import prepare_inference_window
from ml.preprocessing.keystroke import clean_events
from ml.preprocessing.mouse import clean_events as clean_mouse


def predict_from_feature_frames(
    keystroke=None,
    mouse_dfl=None,
    voice=None,
    gait=None,
    mouse_balabit=None,
    spiral_output=None,
    facial=None,
    reaction=None,
):
    outputs = {}
    if keystroke is not None:
        from ml.models.keystroke_model import predict

        outputs["keystroke"] = predict(
            pd.DataFrame([key_features(clean_events(keystroke))])
        )
    if mouse_dfl is not None:
        from ml.models.mouse_model import predict

        outputs["mouse_dfl"] = predict(
            pd.DataFrame([mouse_features(clean_mouse(mouse_dfl))])
        )
    if mouse_balabit is not None:
        from ml.models.mouse_balabit_model import predict

        outputs["mouse_balabit"] = predict(
            pd.DataFrame([mouse_features(clean_mouse(mouse_balabit))])
        )
    if voice is not None:
        from ml.models.voice_model import predict

        outputs["voice"] = predict(voice)
    if gait is not None:
        from ml.models.gait_model import predict

        gait_columns = {str(column) for column in gait.columns}
        if gait_columns.intersection({"axis0_mean", "axis1_mean", "axis2_mean"}):
            gait_features_frame = gait
        else:
            gait_features_frame = pd.DataFrame([gait_features(prepare_inference_window(gait))])
        outputs["gait"] = predict(gait_features_frame)
    if spiral_output is not None:
        if "points" in spiral_output:
            from ml.inference.spiral_predict import predict_from_points

            outputs["spiral"] = predict_from_points(
                spiral_output["points"],
                spiral_output.get("width", 400),
                spiral_output.get("height", 400),
            )
        else:
            raise ValueError("Spiral input must contain captured drawing points.")
    if facial is not None:
        from ml.models.facial_model import predict
        outputs["facial"] = predict(facial)
    if reaction is not None:
        from ml.models.reaction_model import predict
        outputs["reaction"] = predict(reaction)
    return {"modalities": outputs, "fusion": fuse(outputs)}
