"""Common output contract for all modality adapters.

`score` is intentionally typed: clinical classifier probabilities, mouse
behavior scores, and gait freezing scores are not interchangeable medical risks.
"""
from __future__ import annotations
def make_output(modality, prediction, score, confidence, score_type, model_version='unknown', explanation=None):
    valid={'classification_probability','behavioral_consistency_score','anomaly_score','confidence'}
    if score_type not in valid: raise ValueError(f'Unsupported score_type: {score_type}')
    return {'modality':modality,'prediction':str(prediction),'score':float(score),'confidence':float(confidence),'score_type':score_type,'model_version':model_version,'explanation':explanation or {}}
