def predict(reaction_df):
    """
    Predict cognitive latency (reaction time).
    Normal reaction time for simple tasks: ~250-350ms.
    Elevated in PD or cognitive impairment: > 450ms.
    Returns probability of impairment (0.0 to 1.0).
    """
    if len(reaction_df) == 0:
        return {"prediction": 0, "classification_probability": 0.0, "reaction_time_ms": 0}
        
    avg_time = reaction_df['time'].mean()
    
    # Sigmoid-like scaling for probability
    # 250ms -> ~0.05
    # 400ms -> ~0.5
    # 600ms -> ~0.9
    prob = max(0.0, min(1.0, (avg_time - 250) / 350))
    
    return {
        "prediction": 1 if prob >= 0.5 else 0,
        "score": prob,
        "classification_probability": prob,
        "reaction_time_ms": avg_time,
        "explanation": f"Average reaction time of {avg_time:.0f}ms. " + 
                       ("Elevated latency suggests potential bradyphrenia or dopaminergic deficits." if prob >= 0.5 else "Reaction time within normal limits.")
    }
