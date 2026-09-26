from __future__ import annotations
import json
from ml.models import keystroke_model,mouse_model,spiral_model,voice_model,gait_model
from ml.config import RESULTS
def write_fusion_diagnostic():
    path=RESULTS/'fusion_results.json'
    path.write_text(json.dumps({'note':'Fusion evaluation requires aligned, same-subject multimodal observations, which none of the supplied independent datasets provides. No synthetic fusion result was generated.'},indent=2))
    return path
def run_all(include_spiral=False):
    results={'keystroke':keystroke_model.train(),'mouse':mouse_model.train(),'voice':voice_model.train(),'gait':gait_model.train()}
    if include_spiral: results['spiral']=spiral_model.train()
    write_fusion_diagnostic()
    return results
if __name__=='__main__':print(json.dumps(run_all(),indent=2))
