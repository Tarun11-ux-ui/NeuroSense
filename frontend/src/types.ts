export interface KeystrokeEvent {
  key: string;
  press: number;
  release?: number;
  hold?: number;
}

export interface MouseEventLog {
  t: number;
  x: number;
  y: number;
}

export interface AnalysisResult {
  fusion?: {
    motor_consistency_score?: number;
    interpretation?: string;
  };
  modalities?: Record<string, {
    score?: number;
    prediction?: string;
  }>;
}

export const MOCK_VOICE = [{
  "MDVP:Fo(Hz)": 119.992, "MDVP:Fhi(Hz)": 157.302, "MDVP:Flo(Hz)": 74.997,
  "MDVP:Jitter(%)": 0.00784, "MDVP:Jitter(Abs)": 0.00007, "MDVP:RAP": 0.0037,
  "MDVP:PPQ": 0.00554, "Jitter:DDP": 0.01109, "MDVP:Shimmer": 0.04374,
  "MDVP:Shimmer(dB)": 0.426, "Shimmer:APQ3": 0.02182, "Shimmer:APQ5": 0.0313,
  "MDVP:APQ": 0.02971, "Shimmer:DDA": 0.06545, "NHR": 0.02211,
  "HNR": 21.033, "RPDE": 0.414783, "DFA": 0.815285, "spread1": -4.813031,
  "spread2": 0.266482, "D2": 2.301442, "PPE": 0.284654
}];

export const MOCK_GAIT = [{
  "time": 0.01, "acc_x": 0.12, "acc_y": 9.81, "acc_z": 0.05,
  "gyro_x": 0.01, "gyro_y": 0.02, "gyro_z": -0.01
}];

export const MOCK_SPIRAL = {
  "modality": "spiral",
  "prediction": "Atypical (Deviated)",
  "score": 0.65,
  "confidence": 0.88,
  "score_type": "classification_probability",
  "model_version": "CNN",
  "explanation": {
    "pressure_variance": 0.05,
    "drawing_time": 4.5
  }
};
