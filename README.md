# NeuroSense

NeuroSense is a secure digital motor assessment platform designed to capture, analyze, and evaluate multimodal neuromotor consistency. By leveraging standard hardware (keyboard, mouse, microphone, and camera), NeuroSense provides an accessible way to monitor digital biomarkers associated with neuromotor functions.

## Features

NeuroSense evaluates clinical biomarkers through a comprehensive suite of 8 distinct assessment modules:

*   **Keystroke Dynamics:** Analyzes typing rhythm and patterns to assess fine motor consistency.
*   **Mouse Tracking (DFL & Balabit):** Evaluates cursor control, rapid point-and-click precision, and interactive targeting to measure continuous motor coordination.
*   **Spiral Drawing:** Uses canvas-based input to detect micro-tremors and measure hand stability.
*   **Voice Analysis:** Records and analyzes phonation and speech stability (requires microphone).
*   **Gait Pattern:** Evaluates balance and walking rhythm through video pose estimation (requires camera).
*   **Facial Expression:** Measures facial movement consistency and blink timing (requires camera).
*   **Reaction Time:** Measures cognitive and motor reaction delay using visual cues.

### User Interface

*   **Dashboard:** A comprehensive overview of past assessments, aggregated consistency scores, and individual module performance radar charts.
*   **Sequential Assessment Flow:** A guided, step-by-step evaluation mode that walks users through all 8 modalities seamlessly.
*   **Clinical Reports:** Generates professional, printable clinical records summarizing data quality, interpretations, and longitudinal baseline comparisons.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **Backend:** Python, FastAPI
*   **Machine Learning / Data Processing:** Pandas, NumPy, and custom heuristic algorithms in the `ml` module.

## Getting Started

### Prerequisites

*   **Node.js** (v16 or higher recommended)
*   **Python** (3.9 or higher recommended)

### Backend Setup

1. Navigate to the project root directory.
2. It's recommended to create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the required Python dependencies:
   ```bash
   pip install -r requirements-ml.txt
   ```
4. Start the FastAPI backend server (assuming the main application is in `backend/main.py`):
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (typically `http://localhost:3000` or `http://localhost:5173`).

## Project Structure

*   `frontend/`: Contains the React UI, including the Dashboard, Sequential Assessment flows, and Clinical Reporting views.
*   `backend/`: Contains the FastAPI server and endpoints (e.g., `/api/predict`).
*   `ml/`: Contains the machine learning models and feature extraction logic for processing telemetry data from the various assessment modules.
*   `datasets/`: Used for storing or referencing training/validation data.
*   `results/`: Directory for outputting analysis results or model artifacts.

## Data Privacy & Security

NeuroSense is designed to handle sensitive biomarker telemetry. All local processing focuses on extracting metadata (like movement speed, jitter, and timings) rather than storing raw identifiable media where possible. Clinical reports are generated locally in the browser and can be exported by the user.

## License

*(Add License Information Here)*
