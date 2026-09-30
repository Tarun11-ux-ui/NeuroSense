<div align="center">
  <img src="https://via.placeholder.com/150x150/8b5cf6/ffffff?text=N" alt="NeuroSense Logo" width="120" />

  <h1>NeuroSense</h1>
  <p><strong>Advanced Digital Motor & Cognitive Assessment Platform</strong></p>

  <p>
    <a href="#overview">Overview</a> •
    <a href="#key-features">Key Features</a> •
    <a href="#clinical-modalities">Clinical Modalities</a> •
    <a href="#system-architecture">System Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#security--privacy">Security</a>
  </p>
</div>

---

## 📌 Overview

**NeuroSense** is a cutting-edge digital biomarker platform engineered to capture, analyze, and evaluate multi-modal neuromotor consistency. Utilizing standard consumer hardware—such as keyboards, mice, microphones, and webcams—NeuroSense provides an accessible, non-invasive solution to monitor subtle digital biomarkers that are frequently associated with early-stage neuromotor and cognitive decline.

Through real-time telemetry processing across eight distinct behavioral modalities, NeuroSense delivers a synthesized, explainable assessment. This empowers healthcare researchers and clinicians with objective, high-fidelity data, facilitating the longitudinal tracking of motor patterns, micro-tremors, and cognitive-motor latency over time.

---

## ✨ Key Features

- **📊 Centralized Analytical Dashboard:** An intuitive and comprehensive user interface featuring aggregated composite risk scores, detailed radar charts for specific modal breakdowns, and robust longitudinal history tracking to monitor disease progression or therapeutic efficacy.
- **🔄 Multi-Modal Assessments:** Eight carefully tuned cognitive and motor modules designed to capture unique kinematic profiles, ranging from fine motor skills to gross motor coordination.
- **📈 Sequential Assessment Flow:** A streamlined, guided step-by-step evaluation mode that walks users through all assessment modalities seamlessly, ensuring consistent data capture without disrupting the user experience.
- **📋 Professional Clinical Reports:** High-quality, exportable reports (available in PDF and JSON formats) that summarize data quality, clinical interpretations, and precise deviations from established baselines.
- **🧠 Explainable AI (XAI) Engine:** Sophisticated fusion algorithms that combine telemetry from multiple asynchronous inputs to provide clear, actionable insights into motor anomalies. Unlike black-box models, NeuroSense clearly attributes risk scores to specific biomechanical irregularities.

---

## 🔬 Clinical Modalities

NeuroSense features eight evidence-based data capture modalities, each targeting specific neuromotor phenotypes:

1. ⌨️ **Keystroke Dynamics:** Analyzes typing rhythm, dwell times, and flight patterns to assess fine motor consistency and early signs of digital bradykinesia.
2. 🖱️ **Mouse Tracking (DFL):** Evaluates continuous cursor control, acceleration curves, and targeting to measure gross motor coordination and essential tremors.
3. 🎯 **Mouse Tracking (Balabit):** Assesses rapid point-and-click precision and spatial awareness during interactive, high-frequency targeting tasks.
4. 🌀 **Spiral Drawing:** Analyzes digital canvas input to detect kinematic micro-tremors, dysmetria, and measure continuous hand stability.
5. 🎙️ **Voice Analysis:** Records and analyzes phonation parameters, speech stability, and vocal jitter/shimmer using acoustic models (requires a standard microphone).
6. 🚶 **Gait Pattern:** Evaluates balance, stride timing, and walking rhythm using advanced spatial video pose estimation (requires a webcam).
7. 👁️ **Facial Expression:** Measures facial movement consistency, blink latency (detecting bradykinesia), and masked facies using facial landmark tracking.
8. ⏱️ **Reaction Time:** Quantifies pure cognitive-to-motor reaction delay through visual cue stimulation.

---

## 🏗️ System Architecture

The project is structured as a highly scalable, decoupled web application:

- **Frontend (`/frontend`):** Built with React, TypeScript, and Vite. It implements the interactive UI, local data capture engines (mouse tracking, canvas drawing, keystroke logging), and routing. It is optimized for Single-Page Application (SPA) deployment on platforms like Vercel.
- **Backend (`/backend`):** A high-performance Python FastAPI server. It provides the REST API endpoints (`/api/predict`), handles PostgreSQL database connections (via Supabase), and executes the data fusion pipelines.
- **Machine Learning (`/ml`):** Advanced Python modules containing feature extraction logic (`ml.features`) and heuristic/predictive models (`ml.models`). These utilize libraries such as `torch`, `xgboost`, `lightgbm`, and `scikit-learn` to score incoming telemetry arrays.

---

## 🚀 Getting Started

Follow these instructions to set up and run NeuroSense locally for development or demonstration purposes.

### Prerequisites
- **Node.js** (v16.0+ recommended)
- **Python** (3.9+ recommended)
- **PostgreSQL Database** (e.g., Supabase)

### 1. Backend Setup

Navigate to the project root and install the required dependencies:

```bash
# 1. Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# 2. Install backend and ML dependencies
pip install -r backend/requirements.txt

# 3. Configure Environment Variables
# Create a .env file in the backend directory with your Supabase credentials:
# DATABASE_URL=postgresql://user:password@host:port/postgres

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
*The web interface will be available at `http://localhost:5173`.*

---

## 🛡️ Security & Privacy

NeuroSense is architected to handle sensitive clinical telemetry with the utmost responsibility:
- **Local Feature Extraction:** Identifiable raw media (e.g., video feeds, audio recordings) is processed locally on the client-side where possible to extract mathematical features (movement speed, jitter, timings), prioritizing data minimization before transmission.
- **Secure Storage:** All patient assessments and results are securely stored in PostgreSQL, utilizing modern cryptographic hashing for authentication.
- **FHIR Interoperability:** Telemetry can be exported using the HL7 FHIR standard for secure integration with existing Electronic Health Record (EHR) systems.
