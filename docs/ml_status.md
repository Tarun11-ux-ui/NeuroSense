# ML modality status

Metrics below are only reported where they were actually generated. A “held-out grouped evaluation” is not called a final test when it was also used for model selection.

| Modality | Dataset / task | Subjects or users / samples | Split | Model | Validation / held-out metrics | Test metrics | Artifact | Status |
|---|---|---:|---|---|---|---|---|---|
| Keystroke | NeuroQWERTY; documented PD/control `gt` classification | 85 / 116 | GroupShuffleSplit by cohort-scoped pID | Logistic regression | Accuracy 0.733, F1 0.714, ROC-AUC 0.864 | Not separately available; the saved comparison is a held-out grouped evaluation | `models/keystroke/typing_model.pkl` | Trained; preprocessing/schema saved |
| Mouse (Balabit) | Legal/illegal authentication-session behavior; not clinical | 10 accounts / 816 sessions | GroupShuffleSplit by claimed account folder | Random forest | Accuracy 0.633, F1 0.652, ROC-AUC 0.627 (held-out grouped evaluation) | Not separately available | `models/mouse_balabit/mouse_balabit_model.pkl` | Trained as separate behavioral model |
| Mouse (DFL) | Unsupervised behavioral atypicality; no clinical labels | 21 users / 402 sessions | No clinical train/test labels; fit-only anomaly model | Isolation Forest | Not applicable | Not applicable | `models/mouse_dfl/mouse_dfl_model.pkl` | Trained; no medical metric claimed |
| Spiral | NewHandPD; conservative filename-grouped PD/control task | 38 groups / 264 images | 22/8/8 group train/validation/test; zero cross-split group overlap | ResNet18 transfer | Accuracy 0.827, F1 0.836, ROC-AUC 0.949 | Accuracy 0.817, F1 0.836, ROC-AUC 0.875 | `models/spiral/best_spiral_model.pt` | Validated result preserved; real-person identity remains unverified |
| Voice | UCI Parkinson Speech; documented `status` classification | 32 parsed subjects / 195 recordings | GroupShuffleSplit by subject | Random forest | Accuracy 0.735, F1 0.847, ROC-AUC 0.705 | Not separately available; held-out grouped comparison only | `models/voice/voice_model.pkl` | Trained; precomputed acoustic features |
| Gait | Daphnet freezing-event detection; not PD diagnosis | 10 subjects / 5,985 windows | GroupShuffleSplit by subject | Histogram gradient boosting | Accuracy 0.939, F1 0.117, ROC-AUC 0.940 | Not separately available; held-out grouped comparison only | `models/gait/gait_model.pkl` | Trained; severe class imbalance limits accuracy interpretation |

## Explainability and limitations

Tree SHAP hooks exist for fitted tree pipelines but no unsupported medical explanation is emitted. The selected spiral ResNet has no claimed image-region SHAP explanation. Balabit labels represent authentication misuse simulations, DFL has no clinical labels, and Daphnet contains participants with Parkinson disease but supports freezing-event detection only. No valid multimodal accuracy exists because the datasets do not contain matched subjects across modalities.
