# Model results

All numbers below come from the saved result JSON files and one held-out subject-level split (seed 42); they are research results, not clinical performance claims.

| Modality | Valid task | Selected model | Held-out result |
| --- | --- | --- | --- |
| Keystroke | MIT-CSXPD PD/control | Logistic regression | Accuracy 0.733, F1 0.714, ROC-AUC 0.864 (116 sessions, 85 cohort-scoped participants) |
| Voice | UCI PD/control | Random forest | Accuracy 0.735, F1 0.847, ROC-AUC 0.705 (195 recordings, 32 parsed recording-subject IDs) |
| Gait | Daphnet freezing-event detection, not PD detection | Histogram gradient boosting | Accuracy 0.939, F1 0.117, ROC-AUC 0.940 (5,985 subject-grouped windows) |
| Mouse | DFL behavioral atypicality only | Isolation Forest | 402 sessions from 21 users; no medical classification metric is valid |

The gait accuracy is dominated by non-freezing windows; its low F1/recall at the fixed 0.5 threshold must be considered when selecting a deployment threshold. No fusion accuracy is produced: the supplied modality datasets have no aligned multimodal participants.

## NewHandPD spiral modality

The spiral model uses only `HealthySpiral` and `PatientSpiral` JPEG folders in the supplied archive. No README was present; labels are taken strictly from those folder names. There are 264 images from 66 class-scoped filename subjects: 140 Healthy and 124 Patient. Subject-disjoint stratified splits contain 39 train subjects / 156 images, 13 validation subjects / 52 images, and 14 untouched test subjects / 56 images. No subject leakage was detected.

Images are grayscale, resized to 128×128 and scaled to `[0, 1]`. Training augmentation for neural models is limited to ±5° rotation, ±3 pixels translation, and 0.95–1.05 scale; horizontal flipping is excluded because handedness may matter. ResNet18 replicates grayscale into three channels and uses ImageNet normalization.

| Model | Validation accuracy | Validation F1 | Validation ROC-AUC |
| --- | ---: | ---: | ---: |
| HOG + RBF SVM | 0.673 | 0.721 | 0.787 |
| Compact CNN | 0.577 | 0.214 | 0.705 |
| ResNet18 transfer | 0.635 | 0.345 | 0.763 |

HOG + RBF SVM was selected using validation performance alone. Its single untouched-test evaluation was: accuracy 0.786, precision 0.700, recall 1.000, F1 0.824, ROC-AUC 0.917, confusion matrix `[[16, 12], [0, 28]]`. This is a small, single-split research result—not a diagnostic performance claim—and its high false-positive count and limited subject sample require caution. Image SHAP was not produced because the selected RBF HOG+SVM has no practical, medically interpretable image-region SHAP mapping; no unsupported explanation was claimed.

### Conservative cross-class identity audit and re-evaluation

The original class-scoped split was potentially optimistic: it treated `0:h20` and `1:p20` as different subjects. The archive has no reliable authoritative participant mapping for the actual `PatientSpiral` images. The conservative fallback uses the verified filename grammar `spN-H<number>.jpg` / `spN-P<number>.jpg`, discards the H/P class marker, and groups on the numeric token. This is not equivalent to verified real-person identity.

The corrected audit found 264 images, 38 conservative grouping IDs, 28 IDs appearing in both HealthySpiral and PatientSpiral, and 0 ambiguous filenames. The split contains 22 train groups / 152 images, 8 validation groups / 52 images, and 8 test groups / 60 images. Programmatic cross-split leakage is 0.

| Model | Conservative validation accuracy | Validation F1 | Validation ROC-AUC | Conservative test accuracy | Test F1 | Test ROC-AUC |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| HOG + RBF SVM | 0.750 | 0.755 | 0.884 | not selected | — | — |
| Compact CNN | 0.462 | 0.000 | 0.866 | not selected | — | — |
| ResNet18 transfer | 0.827 | 0.836 | 0.949 | 0.817 | 0.836 | 0.875 |

ResNet18 was selected using validation performance only. Its one untouched-test evaluation was accuracy 0.817, precision 0.718, recall 1.000, F1 0.836, ROC-AUC 0.875, confusion matrix `[[21, 11], [0, 28]]`. Compared with the previous potentially optimistic HOG result (0.786 accuracy, 0.917 ROC-AUC), the conservative estimate has lower ROC-AUC (0.875); the model and split are not combined with the previous evaluation. Despite the conservative filename grouping, true participant independence remains unverified, so these results may still be optimistic and are research/hackathon evidence only—not diagnosis.
