"""Fusion emits motor-pattern consistency, never a disease diagnosis."""
from __future__ import annotations
MODALITIES=('keystroke','mouse_balabit','mouse_dfl','spiral','voice','gait','facial','reaction')
DEFAULT_WEIGHTS={'keystroke':1.,'mouse_balabit':.7,'mouse_dfl':.7,'spiral':1.,'voice':1.,'gait':1.,'facial':1.,'reaction':0.8}
def fuse(outputs,weights=None):
    weights={**DEFAULT_WEIGHTS,**(weights or {})};available=[m for m in MODALITIES if m in outputs and outputs[m] is not None]
    if not available:return {'motor_consistency_score':None,'confidence':0.,'available_modalities':[],'missing_modalities':list(MODALITIES),'interpretation':'No modality outputs were supplied.'}
    # Every adapter's `score` is normalized to 0 typical / 1 atypical before this point.
    total=sum(weights[m] for m in available);score=sum(float(outputs[m]['score'])*weights[m] for m in available)/total
    confidence=sum(float(outputs[m].get('confidence',0))*weights[m] for m in available)/total
    
    # Explainable AI (XAI) Analysis
    overall_score_100 = round(score * 100)
    
    contributors = []
    if 'facial' in available and outputs['facial']['score'] > 0.5:
        contributors.append('Reduced blink frequency and/or masked facies (hypomimia) detected')
    if 'reaction' in available and outputs['reaction']['score'] > 0.5:
        contributors.append('Elevated reaction time latency detected, suggesting potential cognitive slowing or bradyphrenia')
    if 'keystroke' in available and outputs['keystroke']['score'] > 0.5:
        contributors.append('Elevated variance in keystroke latency and hold times')
    if 'spiral' in available and outputs['spiral']['score'] > 0.5:
        contributors.append('Statistically significant deviation in fine motor control during spatiotemporal tracing')
    if 'voice' in available and outputs['voice']['score'] > 0.5:
        contributors.append('Acoustic anomalies detected (e.g., vocal jitter/shimmer variances)')
    if 'gait' in available and outputs['gait']['score'] > 0.5:
        contributors.append('Irregularities detected in postural stability and ambulation cadence')
    elif 'gait' in available and outputs['gait']['score'] <= 0.5:
        contributors.append('Postural stability and ambulation mechanics within normative bounds')
    if 'mouse_dfl' in available and outputs['mouse_dfl']['score'] > 0.5:
        contributors.append('Micro-fluctuations identified in cursor trajectory and click dynamics')
        
    if not contributors:
        contributors.append('All assessed modalities map to healthy normative distributions')
        
    if overall_score_100 > 75:
        recommendation = "Significant deviations observed across multiple biometric modalities. A comprehensive clinical evaluation by a neurologist is strongly recommended."
    elif overall_score_100 > 50:
        recommendation = "Mild motor-cognitive anomalies detected relative to baseline metrics. Continued longitudinal monitoring is advised."
    else:
        recommendation = "Biometric telemetry indicates overall neuro-motor stability. Fused modalities fall strictly within healthy normative distributions."
        
    return {
        'motor_consistency_score': float(score),
        'overall_score': f"{overall_score_100}/100",
        'confidence': float(confidence),
        'available_modalities': available,
        'missing_modalities': [m for m in MODALITIES if m not in available],
        'modality_scores': {m: float(outputs[m]['score']) for m in available},
        'explainable_ai': {
            'primary_contributors': contributors,
            'recommendation': recommendation
        }
    }
