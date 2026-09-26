def feature_columns(frame): return [c for c in frame.columns if c not in ("name","status","subject_id")]
