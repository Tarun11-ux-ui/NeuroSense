from __future__ import annotations
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix, brier_score_loss

def classification_metrics(y_true, probability, threshold=.5):
    y_true, probability = np.asarray(y_true), np.asarray(probability)
    pred = (probability >= threshold).astype(int)
    result = {"accuracy": float(accuracy_score(y_true,pred)), "precision": float(precision_score(y_true,pred,zero_division=0)), "recall": float(recall_score(y_true,pred,zero_division=0)), "f1": float(f1_score(y_true,pred,zero_division=0)), "confusion_matrix": confusion_matrix(y_true,pred).tolist(), "brier_score": float(brier_score_loss(y_true,probability))}
    if len(np.unique(y_true)) == 2: result["roc_auc"] = float(roc_auc_score(y_true,probability))
    return result
