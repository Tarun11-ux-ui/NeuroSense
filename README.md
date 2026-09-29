<div align="center">
  <img src="https://via.placeholder.com/150x150/8b5cf6/ffffff?text=N" alt="NeuroSense Logo" width="120" />

  <h1>NeuroSense</h1>
  <p><strong>Secure Digital Motor & Cognitive Assessment Platform</strong></p>

  <p>
    <a href="#features">Features</a> •
    <a href="#clinical-modalities">Modalities</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#privacy">Privacy</a>
  </p>
</div>

---

## 📌 Overview

**NeuroSense** is a comprehensive digital biomarker platform designed to capture, analyze, and evaluate multimodal neuromotor consistency. Utilizing standard consumer hardware (keyboard, mouse, microphone, and camera), NeuroSense provides an accessible, non-invasive method to monitor subtle digital biomarkers often associated with neuromotor and cognitive functions.

By capturing real-time telemetry data across eight distinct modalities, NeuroSense delivers a synthesized, explainable assessment—supporting longitudinal tracking of motor patterns, micro-tremors, and behavioral latency.

---

## ✨ Features

- **📊 Centralized Dashboard:** A comprehensive UI featuring aggregated composite scores, radar charts for modal breakdown, and longitudinal history tracking.
- **🔄 Multi-Modal Assessments:** Eight specific cognitive and motor modules carefully tuned to capture unique kinematic profiles.
- **📈 Sequential Flow:** A guided step-by-step evaluation mode that walks users through all assessment modalities seamlessly without disruption.
- **📋 Clinical Reports:** Professional, exportable reports (PDF/JSON) summarizing data quality, interpretations, and deviations from baselines.
- **🧠 Explainable AI Engine:** Fusion algorithms combine telemetry from multiple inputs to provide clear, actionable insights into motor anomalies rather than black-box scores.

---

## 🔬 Clinical Modalities

NeuroSense features eight evidence-based data capture modalities:

1. ⌨️ **Keystroke Dynamics:** Analyzes typing rhythm, dwell times, and flight patterns to assess fine motor consistency.
2. 🖱️ **Mouse Tracking (DFL):** Evaluates continuous cursor control, acceleration curves, and targeting to measure gross motor coordination.
3. 🎯 **Mouse Tracking (Balabit):** Evaluates rapid point-and-click precision and spatial awareness during interactive targeting tasks.
4. 🌀 **Spiral Drawing:** Analyzes digital canvas input to detect kinematic micro-tremors and measure continuous hand stability.
5. 🎙️ **Voice Analysis:** Records and analyzes phonation parameters, speech stability, and vocal jitter (requires microphone).
6. 🚶 **Gait Pattern:** Evaluates balance, stride timing, and walking rhythm using spatial video pose estimation (requires camera).
7. 👁️ **Facial Expression:** Measures facial movement consistency, blink latency (bradykinesia detection), and expression (requires camera).
8. ⏱️ **Reaction Time:** Measures pure cognitive-to-motor reaction delay through visual cue stimulation.

---

## 🏗️ Architecture

The project is structured as a decoupled web application:

- **Frontend (`/frontend`):** Built with React, TypeScript, and Vite. Implements the interactive UI, local data capture engines (mouse tracking, canvas drawing, keystroke logging), and routing.
- **Backend (`/backend`):** A high-performance Python FastAPI server. It provides the REST API endpoints (`/api/predict`) that consume telemetry and return aggregated scoring.
- **Machine Learning (`/ml`):** Python modules containing feature extraction logic (`ml.features`) and heuristic/predictive models (`ml.models`) for scoring the incoming telemetry arrays.

---

## 🚀 Getting Started

Follow these steps to set up and run NeuroSense locally for development or demonstration.

### Prerequisites
- **Node.js** (v16.0+ recommended)
- **Python** (3.9+ recommended)

### 1. Backend Setup

Navigate to the project root and install the required machine learning and server dependencies:

```bash
# 1. Create a virtual environment
python -m venv venv

# 2. Activate the virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements-ml.txt

# 4. Start the FastAPI server
cd backend
uvicorn main:app --reload
```
*The backend server will start at `http://localhost:8000`.*

### 2. Frontend Setup

In a new terminal window, navigate to the frontend directory:

```bash
# 1. Navigate to the frontend
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start the Vite development server
npm run dev
```
*The web interface will typically be available at `http://localhost:3000` or `http://localhost:5173`. Check your terminal output for the exact local address.*

---

## 📂 Project Structure

```text
NeuroSense/
├── backend/                  # FastAPI server and API endpoints
│   ├── main.py               # Application entry point
│   └── clinical_knowledge.json
├── frontend/                 # React UI application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Core views (Dashboard, SequentialAssessment, Reports)
│   │   └── App.tsx           # Router configuration
│   └── package.json
├── ml/                       # Machine Learning & Telemetry Processing
│   ├── features/             # Feature extraction functions
│   ├── inference/            # Prediction endpoints
│   └── models/               # Heuristic scoring and analysis models
├── datasets/                 # Pre-recorded baseline data for testing
├── results/                  # Analytics output logs
└── README.md                 # Project documentation
```

---

## 🛡️ Data Privacy & Security

NeuroSense is designed to handle sensitive clinical telemetry responsibly:
- **Local Processing:** The frontend collects continuous spatial and temporal data. Identifiable raw media (e.g., video feeds, audio recordings) is processed to extract mathematical features (like movement speed, jitter, and timings) locally where possible, prioritizing data minimization.
- **Client-Side Export:** Assessment records and reports can be exported and downloaded entirely within the user's browser for secure local archiving.

---

## 📄 License

*This project is proprietary. Ensure you have the appropriate permissions before deploying or modifying the source code.*
