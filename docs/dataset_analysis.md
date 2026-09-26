# Dataset analysis

This audit was performed from the files shipped in `datasets/`; archives are read in place and are never modified or extracted over the source data.

## neuroQWERTY MIT-CSXPD

The archive contains MIT-CS1PD and MIT-CS2PD ground-truth CSVs and event CSVs. Ground truth fields are `pID`, Boolean `gt`, clinical motor measures, typing measures, and one or two recording filenames (CS2 has one). The supplied loader defines each event as key identifier, hold time, release time, and press time; it filters mouse and modifier events. Filenames encode timestamp, participant ID, repetition, and experiment. `gt` is a clinical PD/control label, so PD/control analysis is valid. The pipeline retains timing only, not typed content, and group-splits on `pID`.

## Balabit Mouse Dynamics Challenge

README states this is a behavioral-biometric authentication challenge. Session fields are record timestamp, client timestamp, button, state, x, and y. Test labels distinguish legal versus artificially mixed illegal account use; they are not medical labels. Therefore it is not used for Parkinson classification. The loader can support account-session anomaly evaluation only.

## DFL Mouse Dynamics

The supplied directory is made of `UserN.zip` archives containing timestamped CSV sessions, one archive per user. No clinical documentation or clinical endpoint is present in the supplied files. It is used only for population behavioral atypicality/consistency features, never a disease label. Sessions from one user must remain grouped in any supervised authentication evaluation.

## NewHandPD

The archive contains JPEGs under folders whose names explicitly distinguish `Healthy...` and Parkinson groups, including Circle and Meander tasks. Filename suffixes identify participants/repetitions; the pipeline groups by filename identifier (with the class prefix to avoid accidental cross-class same-number collisions). Images support PD/control image classification, but do not provide temporal pen trajectory or velocity. No separate README was present in the archive, so folder-name labels are the only label interpretation used and this assumption is explicit.

## Parkinson Speech Dataset (UCI)

`parkinsons.names` documents 195 recordings from 31 people (23 PD), CSV acoustic measures, no missing values, and `status` (`0` healthy, `1` PD). `name` contains the speaker and recording number; the loader removes the last suffix to form a subject group. This is a valid clinical PD/control task, with subject-level splitting. It provides precomputed acoustic features; no raw audio/MFCC processing is performed.

## Daphnet Freezing of Gait

README identifies lab accelerometer recordings from people with Parkinson disease, intended to recognize freezing-of-gait events. Files are `SxxRyy.txt`; subject is `Sxx`, recording is `Ryy`. The dataset supports window-level freezing-event detection, not PD/control detection, because all participants have PD. Windows are grouped by subject to prevent leakage. The bundled documentation is the authority for sampling/column/annotation meanings; the pipeline does not flatten recordings.

## Split policy

For all clinical tasks, `GroupShuffleSplit` holds out subjects and never individual samples. NeuroQWERTY participant IDs are cohort-local, so its grouping key is `MIT-CS cohort:pID`. Grouped cross-validation can be added for model selection once a larger subject count permits stable folds. The final held-out subject test partition is never used for hyperparameter selection.
