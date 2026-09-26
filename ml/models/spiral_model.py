"""Leak-free NewHandPD spiral evaluation: HOG+SVM, CNN, and ResNet18."""
from __future__ import annotations
import io,json,random,zipfile,re
from collections import Counter
import numpy as np
from PIL import Image,ImageOps
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score,precision_score,recall_score,f1_score,roc_auc_score,confusion_matrix,roc_curve,ConfusionMatrixDisplay
from skimage.feature import hog
from ml.config import ARTIFACTS,RESULTS,SEED
from ml.data.loaders.newhandpd_loader import ARCHIVE,image_manifest
OUT=ARTIFACTS/'spiral'
SPIRAL_NAME_RE=re.compile(r'^sp\d+-([HP])(\d+)\.(?:jpg|jpeg|png)$',re.I)

def conservative_manifest():
    """Return spiral records grouped by the unscoped numeric filename participant token.

    The archive consistently uses spN-H<number> for HealthySpiral and
    spN-P<number> for PatientSpiral. The H/P class marker is discarded; the
    numeric token is retained. Any filename outside this verified grammar is
    reported as ambiguous rather than guessed.
    """
    records=[]; ambiguous=[]
    for name,_,label in image_manifest(spiral_only=True):
        base=name.rsplit('/',1)[-1]; match=SPIRAL_NAME_RE.fullmatch(base)
        folder=next((part for part in name.split('/') if part.endswith('Spiral')), '')
        if not match or folder not in ('HealthySpiral','PatientSpiral'):
            ambiguous.append(name); continue
        records.append((name,match.group(2),label,folder,base))
    return records,ambiguous

def split_subjects(items):
    """60/20/20 subject-stratified split. Test is selected before every fit."""
    y=np.array([x[2] for x in items]);g=np.array([x[1] for x in items]);x=np.zeros(len(y))
    tv,test=next(StratifiedGroupKFold(5,shuffle=True,random_state=SEED).split(x,y,g))
    tr,va=next(StratifiedGroupKFold(4,shuffle=True,random_state=SEED+1).split(x[tv],y[tv],g[tv]));train=tv[tr];val=tv[va]
    sets=[set(g[i]) for i in (train,val,test)]
    if any(sets[i]&sets[j] for i in range(3) for j in range(i+1,3)):raise RuntimeError('Subject leakage in split')
    return train,val,test

def decode(items,size=128):
    data=[]
    with zipfile.ZipFile(ARCHIVE) as z:
        for name,subject,label in items:
            im=ImageOps.grayscale(Image.open(io.BytesIO(z.read(name)))).resize((size,size))
            data.append((np.asarray(im,dtype=np.float32)/255.,subject,label,name))
    return data

def report(y,p):
    q=(np.asarray(p)>=.5).astype(int)
    return {'accuracy':float(accuracy_score(y,q)),'precision':float(precision_score(y,q,zero_division=0)),'recall':float(recall_score(y,q,zero_division=0)),'f1':float(f1_score(y,q,zero_division=0)),'roc_auc':float(roc_auc_score(y,p)),'confusion_matrix':confusion_matrix(y,q).tolist()}
def hv(im):return hog(im,orientations=9,pixels_per_cell=(16,16),cells_per_block=(2,2),block_norm='L2-Hys')
def hog_svm(train,val):
    m=make_pipeline(StandardScaler(),SVC(C=1,kernel='rbf',class_weight='balanced',probability=True,random_state=SEED));m.fit(np.array([hv(s[0]) for s in train]),[s[2] for s in train]);p=m.predict_proba(np.array([hv(s[0]) for s in val]))[:,1];return m,report([s[2] for s in val],p)

def loader(samples,train=False,resnet=False,batch=16):
    import torch
    from torch.utils.data import Dataset,DataLoader
    class D(Dataset):
        def __len__(self):return len(samples)
        def __getitem__(self,i):
            x=torch.tensor(samples[i][0][None],dtype=torch.float32)
            if resnet:
                x=torch.nn.functional.interpolate(x[None],size=(224,224),mode='bilinear',align_corners=False)[0].repeat(3,1,1);x=(x-torch.tensor([.485,.456,.406])[:,None,None])/torch.tensor([.229,.224,.225])[:,None,None]
            if train:
                from torchvision.transforms.functional import affine
                x=affine(x,random.uniform(-5,5),[random.randint(-3,3),random.randint(-3,3)],random.uniform(.95,1.05),[0.,0.])
            return x,torch.tensor(samples[i][2])
    return DataLoader(D(),batch_size=batch,shuffle=train)
def cnn():
    from torch import nn
    return nn.Sequential(nn.Conv2d(1,16,3,padding=1),nn.ReLU(),nn.MaxPool2d(2),nn.Conv2d(16,32,3,padding=1),nn.ReLU(),nn.AdaptiveAvgPool2d(1),nn.Flatten(),nn.Dropout(.3),nn.Linear(32,2))
def resnet():
    from torchvision.models import resnet18,ResNet18_Weights
    from torch import nn
    m=resnet18(weights=ResNet18_Weights.DEFAULT)
    for p in m.parameters():p.requires_grad=False
    m.fc=nn.Sequential(nn.Dropout(.4),nn.Linear(m.fc.in_features,2));return m
def eval_torch(m,data,resnet_mode=False):
    import torch
    m.eval();y=[];p=[]
    with torch.no_grad():
        for x,t in loader(data,resnet=resnet_mode,batch=32):p.extend(torch.softmax(m(x),1)[:,1].numpy());y.extend(t.numpy())
    return report(y,p),np.array(y),np.array(p)
def fit(m,train,val,resnet_mode=False,epochs=20,patience=5,lr=.001):
    import torch
    from torch import nn
    opt=torch.optim.AdamW(filter(lambda p:p.requires_grad,m.parameters()),lr=lr,weight_decay=1e-4);sched=torch.optim.lr_scheduler.ReduceLROnPlateau(opt,mode='max',patience=2,factor=.3);loss=nn.CrossEntropyLoss();best=(-1,None);hist=[];stale=0
    for n in range(epochs):
        m.train();correct=total=0;losses=[]
        for x,y in loader(train,True,resnet_mode):
            opt.zero_grad();o=m(x);l=loss(o,y);l.backward();opt.step();losses.append(l.item());correct+=(o.argmax(1)==y).sum().item();total+=len(y)
        vm,_,_=eval_torch(m,val,resnet_mode);sched.step(vm['roc_auc']);hist.append({'epoch':n+1,'train_loss':float(np.mean(losses)),'train_accuracy':correct/total,'validation_accuracy':vm['accuracy'],'validation_f1':vm['f1'],'validation_roc_auc':vm['roc_auc']})
        if vm['roc_auc']>best[0]:best=(vm['roc_auc'],{k:v.cpu().clone() for k,v in m.state_dict().items()});stale=0
        else:stale+=1
        if stale>=patience:break
    m.load_state_dict(best[1]);return m,hist,eval_torch(m,val,resnet_mode)[0]
def plots(y,p,hist):
    import matplotlib.pyplot as plt
    d=RESULTS/'plots';d.mkdir(parents=True,exist_ok=True);q=np.array(p)>=.5
    fig,ax=plt.subplots();ConfusionMatrixDisplay(confusion_matrix(y,q),display_labels=['Healthy','Patient']).plot(ax=ax);fig.savefig(d/'spiral_confusion_matrix.png',bbox_inches='tight');plt.close(fig)
    f,t,_=roc_curve(y,p);fig,ax=plt.subplots();ax.plot(f,t);ax.plot([0,1],[0,1],'--');ax.set(xlabel='False positive rate',ylabel='True positive rate');fig.savefig(d/'spiral_roc_curve.png',bbox_inches='tight');plt.close(fig)
    fig,ax=plt.subplots()
    if hist:
        ax.plot([v['epoch'] for v in hist],[v['train_accuracy'] for v in hist],label='train');ax.plot([v['epoch'] for v in hist],[v['validation_accuracy'] for v in hist],label='validation');ax.legend();ax.set(xlabel='Epoch',ylabel='Accuracy')
    else: ax.text(.5,.5,'HOG + SVM has no epoch-based training curve',ha='center',va='center');ax.set_axis_off()
    fig.savefig(d/'spiral_training_curve.png',bbox_inches='tight');plt.close(fig)
def train():
    import torch,joblib
    random.seed(SEED);np.random.seed(SEED);torch.manual_seed(SEED)
    records,ambiguous=conservative_manifest()
    print('Representative filenames and conservative grouping IDs:')
    for name,group,label,folder,base in records[:6]: print(f'  {name} -> {group} ({folder}, class={label})')
    print(f'Unique grouping IDs: {len({r[1] for r in records})}')
    both={g for g in {r[1] for r in records} if {r[3] for r in records if r[1]==g}=={'HealthySpiral','PatientSpiral'}}
    print(f'Grouping IDs appearing across both classes: {len(both)} ({sorted(both)})')
    print(f'Ambiguous/unmappable filenames: {len(ambiguous)}')
    if ambiguous: print('Ambiguous filenames:',ambiguous)
    if not records or ambiguous: raise ValueError('Conservative filename grouping cannot proceed while filenames are ambiguous.')
    raw=[(r[0],r[1],r[2]) for r in records];tr,va,te=split_subjects(raw);all_data=decode(raw);train_set=[all_data[i] for i in tr];val_set=[all_data[i] for i in va];test_set=[all_data[i] for i in te]
    groups=np.array([r[1] for r in raw]); split_groups=[set(groups[i]) for i in (tr,va,te)]; leakage=sum(len(split_groups[i]&split_groups[j]) for i in range(3) for j in range(i+1,3));print(f'Train groups: {len(split_groups[0])}');print(f'Validation groups: {len(split_groups[1])}');print(f'Test groups: {len(split_groups[2])}');print(f'Train images: {len(train_set)}');print(f'Validation images: {len(val_set)}');print(f'Test images: {len(test_set)}');print(f'Cross-split group leakage: {leakage}')
    pack=lambda s:{'subjects':len({x[1] for x in s}),'images':len(s),'class_distribution':dict(Counter(x[2] for x in s))};split={'train':pack(train_set),'validation':pack(val_set),'test':pack(test_set)}
    hog_model,hog_val=hog_svm(train_set,val_set);c, ch, cv=fit(cnn(),train_set,val_set,epochs=25,patience=6);r,rh,rv=fit(resnet(),train_set,val_set,True,epochs=15,patience=4)
    values={'hog_svm':hog_val,'compact_cnn':cv,'resnet18_transfer':rv};chosen=max(values,key=lambda k:(values[k]['roc_auc'],values[k]['f1']));OUT.mkdir(parents=True,exist_ok=True)
    if chosen=='hog_svm':
        p=hog_model.predict_proba(np.array([hv(s[0]) for s in test_set]))[:,1];y=np.array([s[2] for s in test_set]);joblib.dump(hog_model,OUT/'best_spiral_model.pkl');history=[]
    else:
        m,h,mode=(c,ch,False) if chosen=='compact_cnn' else (r,rh,True);_,y,p=eval_torch(m,test_set,mode);torch.save({'state_dict':m.state_dict(),'architecture':chosen,'classes':['Healthy','Patient']},OUT/'best_spiral_model.pt');history=h
    final=report(y,p);plots(y,p,history)
    pre={'source_folders':['HealthySpiral','PatientSpiral'],'format':'JPEG → grayscale','input_size':[128,128],'normalization':'pixel / 255','augmentation':'train-only rotation ≤5°, translation ≤3px, scale 0.95–1.05; no horizontal flip','resnet':'grayscale replicated into 3 channels, ImageNet normalized','test_used_for_model_selection':False};(OUT/'spiral_preprocessing.json').write_text(json.dumps(pre,indent=2));(OUT/'spiral_hog_config.json').write_text(json.dumps({'orientations':9,'pixels_per_cell':[16,16],'cells_per_block':[2,2],'block_norm':'L2-Hys','classifier':'RBF SVM, C=1, balanced classes'},indent=2))
    audit={'readme_found':False,'source_archive':str(ARCHIVE),'total_images':len(raw),'total_grouping_ids':len({r[1] for r in raw}),'class_distribution':dict(Counter(x[2] for x in raw)),'filename_rule':'^sp\\d+-([HP])(\\d+)\\.(jpg|jpeg|png)$; discard H/P class marker and group on numeric token','cross_class_grouping_ids':len(both),'ambiguous_or_unmappable_filenames':len(ambiguous),'subject_leakage_detected':leakage!=0,'identity_caveat':'Filename grouping is conservative fallback, not verified real-person identity.'}
    previous={'split':'class-scoped IDs (potentially optimistic)','test_accuracy':0.7857142857142857,'test_precision':0.7,'test_recall':1.0,'test_f1':0.8235294117647058,'test_roc_auc':0.9170918367346939,'note':'Retained for comparison only; not combined with this evaluation.'}
    result={'audit':audit,'split':split,'validation_results':values,'selected_by_validation':chosen,'final_untouched_test':final,'training_history':history,'previous_result_potentially_optimistic':previous,'conservative_result_note':'Current final metrics use only the corrected unscoped filename grouping and untouched test split.'};(RESULTS/'spiral_results.json').write_text(json.dumps(result,indent=2));print(json.dumps(result,indent=2));return result
if __name__=='__main__':train()
