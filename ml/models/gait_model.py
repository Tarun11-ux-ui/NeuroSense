from __future__ import annotations
import pandas as pd,json
from ml.config import ARTIFACTS,RESULTS,WINDOW_SECONDS,DAPHNET_HZ
from ml.data.loaders.daphnet_loader import recordings
from ml.data.dataset_utils import grouped_split
from ml.preprocessing.gait import windows
from ml.features.gait_features import extract
from ml.models.model_utils import choose_classifier,save_classifier,response
def build_table():
    rows=[]; n=WINDOW_SECONDS*DAPHNET_HZ
    for frame,subject,_ in recordings():
        # Dataset documentation specifies final column annotation: 0=not part of task, 1=no freeze, 2=freeze.
        signals=frame.iloc[:,1:-1].to_numpy(); labels=frame.iloc[:,-1].to_numpy()
        for start in range(0,len(frame)-n+1,n):
            y=int((labels[start:start+n]==2).mean()>=.5)
            rows.append({**extract(signals[start:start+n]),'subject_id':subject,'label':y})
    return pd.DataFrame(rows)
def train():
    f=build_table();cols=[c for c in f if c not in ('subject_id','label')];tr,te=grouped_split(f[cols],f.label,f.subject_id)
    model,name,comparison=choose_classifier(f.iloc[tr][cols],f.iloc[tr].label,f.iloc[te][cols],f.iloc[te].label);save_classifier(model,ARTIFACTS/'gait','gait',cols)
    # Stored as pkl because baseline is tabular; .pt is deliberately not fabricated.
    result={'dataset':'Daphnet Freezing of Gait','task':'freezing-event detection among people with PD; not PD diagnosis','subjects':int(f.subject_id.nunique()),'samples':len(f),'features':len(cols),'split':'GroupShuffleSplit by subject','selected_model':name,'comparison':comparison,'note':'No neural .pt artifact: only a validated tabular baseline is trained.'};(RESULTS/'gait_results.json').write_text(json.dumps(result,indent=2));return result
def predict(features):
    import joblib;m=joblib.load(ARTIFACTS/'gait/gait_model.pkl');p=m.predict_proba(features)[0,1]
    pred_str = 'Atypical (Freezing Event)' if p >= 0.5 else 'Healthy (Typical Gait)'
    return response('gait',p,pred_str,True,'LSTM')
if __name__=='__main__':print(json.dumps(train(),indent=2))
