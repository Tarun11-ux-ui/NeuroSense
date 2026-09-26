def explain_fusion(outputs, weights):
    available={m:o for m,o in outputs.items() if o is not None};total=sum(weights.get(m,1.) for m in available) or 1
    return [{'modality':m,'weighted_contribution':float(o['score']*weights.get(m,1.)/total)} for m,o in available.items()]
