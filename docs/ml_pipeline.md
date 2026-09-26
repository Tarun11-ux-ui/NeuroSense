# ML pipeline

Each loader reads its source archive without changing `datasets/`. Preprocessing and feature extraction live in shared modules and inference imports those same modules. Tabular clinical tasks compare logistic regression, random forest, and histogram gradient boosting; the selected model is chosen on the held-out grouped split and saved with its exact feature schema. Mouse outputs are behavioral atypicality scores. Daphnet outputs freezing-event patterns. Fusion accepts only available modalities and reports a non-diagnostic Motor Consistency Score.

Run `python -m ml.models.keystroke_model`, `python -m ml.models.mouse_model`, `python -m ml.models.voice_model`, `python -m ml.models.gait_model`, and `python -m ml.models.spiral_model`. Run all tabular models with `python -m ml.evaluation.evaluate_all`. Spiral is opt-in because archive decoding/training is more resource intensive: `python -m ml.evaluation.evaluate_all --spiral` is not implemented; use its module command directly.

All clinical probabilities are research-model outputs, not medical risk estimates. The fusion message is intentionally restricted to atypical motor patterns and recommends professional evaluation only where an application chooses to add that advisory text.

Current integration uses the common output contract in `ml/inference/modality_output.py`. Mouse components are separate (`mouse_balabit` authentication anomaly and `mouse_dfl` unsupervised behavioral atypicality). Fusion accepts `keystroke`, `mouse_balabit`, `mouse_dfl`, `spiral`, `voice`, and `gait`, ignores missing modalities rather than treating them as zero, and reports only a prototype Motor Consistency Score. No multimodal accuracy is reported.
