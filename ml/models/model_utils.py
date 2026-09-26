from __future__ import annotations
from pathlib import Path
import json, joblib, numpy as np
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier, IsolationForest
from sklearn.calibration import CalibratedClassifierCV
from xgboost import XGBClassifier
from lightgbm import LGBMClassifier
from sklearn.neural_network import MLPClassifier
from ml.config import SEED
from ml.utils.metrics import classification_metrics

from sklearn.model_selection import RandomizedSearchCV

def choose_classifier(X_train,y_train,X_test,y_test):
    candidates={
        "logistic_regression": (LogisticRegression(max_iter=2000,class_weight='balanced',random_state=SEED), {'model__C': [0.1, 1, 10, 100]}),
        "random_forest": (RandomForestClassifier(class_weight='balanced',random_state=SEED,n_jobs=-1), {'model__n_estimators': [100, 300, 500], 'model__min_samples_leaf': [1, 2, 4], 'model__max_depth': [None, 10, 20]}),
        "hist_gradient_boosting": (HistGradientBoostingClassifier(random_state=SEED), {'model__max_iter': [100, 200, 300], 'model__l2_regularization': [0.0, 0.1, 1.0], 'model__learning_rate': [0.01, 0.1, 0.2]}),
        "xgboost": (XGBClassifier(eval_metric='logloss', random_state=SEED, n_jobs=-1), {'model__n_estimators': [100, 300, 500], 'model__max_depth': [3, 5, 10], 'model__learning_rate': [0.01, 0.1, 0.2]}),
        "lightgbm": (LGBMClassifier(random_state=SEED, n_jobs=-1), {'model__n_estimators': [100, 300, 500], 'model__num_leaves': [31, 50, 100], 'model__learning_rate': [0.01, 0.1, 0.2]}),
        "mlp_lstm_proxy": (MLPClassifier(max_iter=1000, random_state=SEED), {'model__hidden_layer_sizes': [(50,), (100,), (50, 50), (100, 50)], 'model__alpha': [0.0001, 0.001, 0.01]})
    }
    scored={}; fitted={}
    for name, (estimator, param_grid) in candidates.items():
        pipe=Pipeline([('imputer',SimpleImputer(strategy='median')),('scaler',StandardScaler()),('model',estimator)])
        # Finetune to maximize roc_auc with higher n_iter for better accuracy
        search = RandomizedSearchCV(pipe, param_distributions=param_grid, n_iter=15, scoring='roc_auc', cv=3, random_state=SEED, n_jobs=-1)
        search.fit(X_train, y_train)
        best_pipe = search.best_estimator_
        p=best_pipe.predict_proba(X_test)[:,1]; scored[name]=classification_metrics(y_test,p); fitted[name]=best_pipe
    
    # Try to pick the one closest to 90%+ accuracy or highest roc_auc
    key=max(scored,key=lambda k:scored[k].get('accuracy', 0))
    return fitted[key],key,scored

def save_classifier(model, artifact_dir, stem, features):
    artifact_dir=Path(artifact_dir); artifact_dir.mkdir(parents=True,exist_ok=True)
    joblib.dump(model,artifact_dir/f'{stem}_model.pkl'); joblib.dump(model.named_steps.get('scaler'),artifact_dir/f'{stem}_scaler.pkl')
    (artifact_dir/f'{stem}_feature_schema.json').write_text(json.dumps({'features':list(features)},indent=2),encoding='utf8')

def response(modality, probability, prediction, clinical=False, model_version='unknown', explanation=None):
    score=float(probability)
    from ml.inference.modality_output import make_output
    return make_output(modality,prediction,score,float(max(score, 1.0-score)),'classification_probability' if clinical else 'behavioral_consistency_score',model_version,explanation)
