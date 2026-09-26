def explain_tree_model(model, features, row):
    """Returns real SHAP values for fitted tree estimators; caller handles optional shap dependency."""
    import shap
    estimator=model.named_steps.get('model',model); values=shap.TreeExplainer(estimator).shap_values(row)
    return {'feature_names':list(features),'shap_values':values.tolist() if hasattr(values,'tolist') else values}
