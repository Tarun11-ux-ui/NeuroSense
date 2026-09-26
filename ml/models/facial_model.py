"""
Heuristic facial expression and blink rate model for NeuroSense.
Analyzes EAR (Eye Aspect Ratio) for blinking (bradykinesia/reduced blinking) 
and mouth openness variations (masked facies/hypomimia).
"""
import pandas as pd
import numpy as np

def predict(features_df: pd.DataFrame) -> dict:
    """
    Predict risk based on facial telemetry.
    Input: DataFrame with columns [timestamp, ear, mouthOpenness]
    """
    if features_df.empty:
        return {"score": 0.0, "confidence": 0.0, "details": "No data"}
        
    duration_seconds = (features_df['timestamp'].iloc[-1] - features_df['timestamp'].iloc[0]) / 1000.0
    if duration_seconds < 1.0:
        return {"score": 0.0, "confidence": 0.0, "details": "Insufficient capture duration"}

    ear_series = features_df['ear']
    mouth_series = features_df['mouthOpenness']

    # Simple blink detection: EAR drops below a threshold
    ear_mean = ear_series.mean()
    ear_threshold = ear_mean * 0.8
    blinks = 0
    in_blink = False
    for val in ear_series:
        if val < ear_threshold and not in_blink:
            blinks += 1
            in_blink = True
        elif val >= ear_threshold:
            in_blink = False
            
    blinks_per_minute = (blinks / duration_seconds) * 60.0
    
    # Normal blink rate is ~15-20 per minute. Parkinson's is often < 12.
    if blinks_per_minute < 5:
        blink_risk = 0.9
    elif blinks_per_minute < 10:
        blink_risk = 0.6
    elif blinks_per_minute < 14:
        blink_risk = 0.3
    else:
        blink_risk = 0.05
        
    # Masked facies: reduced facial animation (measured by low variance in mouth openness when speaking)
    mouth_std = mouth_series.std()
    
    # If mouth std is very low, it indicates little to no mouth movement
    if mouth_std < 0.005:
        mouth_risk = 0.85
    elif mouth_std < 0.01:
        mouth_risk = 0.5
    else:
        mouth_risk = 0.1
        
    # Combined risk
    combined_risk = (blink_risk * 0.6) + (mouth_risk * 0.4)
    
    return {
        "score": float(np.clip(combined_risk, 0.0, 1.0)),
        "confidence": 0.78,
        "details": f"EAR blinks/min: {blinks_per_minute:.1f}, Mouth variance: {mouth_std:.4f}"
    }
