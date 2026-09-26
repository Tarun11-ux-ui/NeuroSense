import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES } from "./Dashboard";
import type { KeystrokeEvent, MouseEventLog } from "../types";
import { MODULE_TASKS } from "../utils/tasks";
import {
  listCaptureDevices,
  selectedDevice,
  type CaptureDevice,
} from "../utils/mediaDevices";
import { generateFHIRBundle } from "../utils/fhir";

const mediaPipe = globalThis as typeof globalThis & {
  Pose?: new (options: { locateFile: (file: string) => string }) => any;
  Camera?: new (video: HTMLVideoElement, options: any) => any;
};
const MIN_GAIT_CAPTURE_FRAMES = 120;
const MIN_GAIT_CAPTURE_SECONDS = 4;

async function readApiResponse(response: Response): Promise<any> {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : {};
  } catch {
    return { detail: body || `Request failed with status ${response.status}` };
  }
}

export default function ComprehensiveAssessment() {
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>(
    "Initializing Analysis...",
  );
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string>("");
  const [medicationState, setMedicationState] = useState<"ON" | "OFF" | "UNKNOWN">("UNKNOWN");

  const [tasks, setTasks] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const modules = [
      "keystroke",
      "mouse_dfl",
      "mouse_balabit",
      "voice",
      "gait",
      "spiral",
    ];
    const randomTasks = modules.map((mod) => {
      const opts = MODULE_TASKS[mod] || [];
      return (
        opts[Math.floor(Math.random() * opts.length)] || "Follow instructions"
      );
    });
    setTasks(randomTasks);

    // Accessibility: Voice Navigation
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase();
        if (
          transcript.includes("next step") ||
          transcript.includes("next module")
        ) {
          // Find a way to trigger goToNextStep
          const nextBtn = document.getElementById("next-step-btn");
          if (nextBtn && !nextBtn.hasAttribute("disabled")) {
            nextBtn.click();
          }
        }
      };
      recognition.start();
      return () => recognition.stop();
    }
  }, []);

  // States for all modules
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  const activeKeys = useRef<Record<string, number>>({});

  const [mouseDfl, setMouseDfl] = useState<MouseEventLog[]>([]);
  const [mouseBalabit, setMouseBalabit] = useState<MouseEventLog[]>([]);

  const [voiceData, setVoiceData] = useState<any>(null);
  const [gaitData, setGaitData] = useState<any>(null);
  const [spiralData, setSpiralData] = useState<any>(null);

  // Spiral Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spiralPoints, setSpiralPoints] = useState<
    { x: number; y: number; t: number; pressure: number }[]
  >([]);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [microphones, setMicrophones] = useState<CaptureDevice[]>([]);
  const [cameras, setCameras] = useState<CaptureDevice[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Video Recording State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const videoStream = useRef<MediaStream | null>(null);
  const poseEstimator = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const poseData = useRef<any[]>([]);
  const [gaitCaptureSeconds, setGaitCaptureSeconds] = useState(0);
  const gaitTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Email Report State
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const refreshCaptureDevices = async () => {
    try {
      const devices = await listCaptureDevices();
      setMicrophones(devices.microphones);
      setCameras(devices.cameras);
      if (!selectedMicrophone && devices.microphones[0])
        setSelectedMicrophone(devices.microphones[0].deviceId);
      if (!selectedCamera && devices.cameras[0])
        setSelectedCamera(devices.cameras[0].deviceId);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to list capture devices.",
      );
    }
  };

  useEffect(() => {
    return () => {
      gaitTimer.current && clearInterval(gaitTimer.current);
      cameraRef.current?.stop();
      poseEstimator.current?.close();
      videoStream.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.repeat) return;
    activeKeys.current[e.key] = Date.now() / 1000;
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pressTime = activeKeys.current[e.key];
    if (pressTime) {
      const releaseTime = Date.now() / 1000;
      setKeystrokes((prev) => [
        ...prev,
        {
          key: e.key,
          press: pressTime,
          release: releaseTime,
          hold: releaseTime - pressTime,
        },
      ]);
      delete activeKeys.current[e.key];
    }
  };

  const handleMouseDflMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setMouseDfl((prev) => [
        ...prev,
        { t: Date.now() / 1000, x: e.clientX, y: e.clientY },
      ]);
    },
    [],
  );

  const handleMouseBalabitMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setMouseBalabit((prev) => [
        ...prev,
        { t: Date.now() / 1000, x: e.clientX, y: e.clientY },
      ]);
    },
    [],
  );

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: any,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setter(json);
      } catch (err) {
        alert("Invalid JSON file uploaded.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Spiral Drawing logic
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    // For touch devices, sometimes browser prevents default pointer events if touch-action is not none, which we have.
    canvas.setPointerCapture(e.pointerId);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure || 0.5;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineWidth = pressure > 0 ? pressure * 4 : 2;
      ctx.lineCap = "round";
      ctx.strokeStyle = "var(--primary)";
    }
    setSpiralPoints([{ x, y, t: Date.now(), pressure }]);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pressure = e.pressure || 0.5;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineWidth = pressure > 0 ? pressure * 4 : 2;
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setSpiralPoints((prev) => [...prev, { x, y, t: Date.now(), pressure }]);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (spiralPoints.length > 50) {
      setSpiralData({ points: spiralPoints, width: 400, height: 400 });
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSpiralPoints([]);
    setSpiralData(null);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedDevice(selectedMicrophone) },
      });
      await refreshCaptureDevices();
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingTimer.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 9) {
            stopRecording();
            return 10;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      alert("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordingTimer.current) clearInterval(recordingTimer.current);

      setError(
        "Audio was recorded, but this model requires extracted UCI voice features. Upload the 22-column feature JSON to analyze it.",
      );
    }
  };

  // Video Handlers
  const startVideoRecording = async () => {
    try {
      if (!mediaPipe.Pose || !mediaPipe.Camera) {
        throw new Error(
          "Pose estimation scripts are still loading. Please try again.",
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedDevice(selectedCamera) },
        audio: false,
      });
      await refreshCaptureDevices();
      videoStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        poseEstimator.current = new mediaPipe.Pose({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        poseEstimator.current.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        poseEstimator.current.onResults((results: any) => {
          const leftAnkle = results.poseLandmarks?.[27];
          const rightAnkle = results.poseLandmarks?.[28];
          if (leftAnkle && rightAnkle) {
            poseData.current.push({
              timestamp: Date.now(),
              leftAnkle: { x: leftAnkle.x, y: leftAnkle.y, z: leftAnkle.z },
              rightAnkle: { x: rightAnkle.x, y: rightAnkle.y, z: rightAnkle.z },
            });
          }
        });
        cameraRef.current = new mediaPipe.Camera(videoRef.current, {
          onFrame: async () =>
            poseEstimator.current?.send({ image: videoRef.current }),
          width: 320,
          height: 240,
        });
        cameraRef.current.start();
      }
      poseData.current = [];
      setIsRecordingVideo(true);
      setGaitCaptureSeconds(0);
      gaitTimer.current = setInterval(
        () => setGaitCaptureSeconds((seconds) => seconds + 1),
        1000,
      );
    } catch (err) {
      console.error("Camera access denied", err);
      setError(
        err instanceof Error
          ? err.message
          : "Camera access is required for gait telemetry.",
      );
    }
  };

  const stopVideoRecording = () => {
    if (gaitCaptureSeconds < MIN_GAIT_CAPTURE_SECONDS) {
      setError(
        "Keep the gait capture running for at least 4 seconds before stopping.",
      );
      return;
    }
    if (gaitTimer.current) clearInterval(gaitTimer.current);
    cameraRef.current?.stop();
    poseEstimator.current?.close();
    if (videoStream.current) {
      videoStream.current.getTracks().forEach((track) => track.stop());
      videoStream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecordingVideo(false);
    if (poseData.current.length < MIN_GAIT_CAPTURE_FRAMES) {
      setError(
        "Gait capture did not collect enough pose frames. Please repeat the capture.",
      );
      return;
    }
    setGaitData(poseData.current);
  };

  const sendEmailReport = async () => {
    if (!emailAddress) return;
    setIsEmailing(true);
    setEmailStatus(null);
    try {
      const res = await fetch("/api/share-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailAddress,
          patient_name:
            "Anonymous Patient (ID: " + Math.floor(Math.random() * 10000) + ")",
          report_data: result,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setEmailStatus("Success! Report sent.");
        setTimeout(() => setShowEmailInput(false), 2000);
      } else {
        setEmailStatus("Error: " + data.message);
      }
    } catch (err: any) {
      setEmailStatus("Failed to send email.");
    } finally {
      setIsEmailing(false);
    }
  };

  const goToNextStep = (nextStep: number) => {
    if (!isVerified) {
      setError("Please confirm task verification before proceeding.");
      return;
    }
    setError(null);
    setIsVerified(false);
    setStep(nextStep);
  };

  const runAnalysis = async () => {
    if (!isVerified) {
      setError("Please confirm task verification before proceeding.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisStatus("Analyzing raw telemetry data...");
    setError(null);
    setResult(null);

    const payload: any = { patient_id: patientId || "anonymous" };
    if (keystrokes.length > 0) payload.keystroke = keystrokes;
    if (mouseDfl.length > 0) payload.mouse_dfl = mouseDfl;
    if (mouseBalabit.length > 0) payload.mouse_balabit = mouseBalabit;
    if (voiceData) payload.voice = voiceData;
    if (gaitData) payload.gait = gaitData;
    if (spiralData) payload.spiral = spiralData;

    try {
      const token = localStorage.getItem("neurosense_token") || "";

      // Simulate multi-stage loading while we wait for backend
      let progressInterval = setInterval(() => {
        setAnalysisStatus((prev) => {
          if (prev === "Analyzing raw telemetry data...")
            return "Fusing multimodal streams...";
          if (prev === "Fusing multimodal streams...")
            return "Generating clinical narrative via Phi-3...";
          return prev;
        });
      }, 5000);

      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      clearInterval(progressInterval);

      const data = await readApiResponse(res);
      if (!res.ok || data.status === "error") {
        throw new Error(
          data.detail || data.message || "Prediction request failed",
        );
      }
      setResult(data.result);
      setStep(6); // Go to report
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend API");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 1: Keystroke Dynamics
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[0]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-0"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-0"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <textarea
              className="input-area"
              placeholder="Start typing here..."
              onKeyDown={handleKeyDown}
              onKeyUp={handleKeyUp}
            />
            <div
              style={{
                marginTop: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Captured {keystrokes.length} keystroke events
            </div>

            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={() => goToNextStep(1)}
              >
                Next: Mouse Tracking
              </button>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 2: Mouse DFL
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[1]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-1"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-1"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <div
              onMouseMove={handleMouseDflMove}
              style={{
                height: "200px",
                background: "rgba(255,255,255,0.8)",
                border: "1px dashed var(--primary)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "crosshair",
              }}
            >
              Move Mouse Here
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Captured {mouseDfl.length} movement points
            </div>

            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => {
                  setError(null);
                  setStep(0);
                }}
              >
                Back
              </button>
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={() => goToNextStep(2)}
              >
                Next: Mouse Balabit
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 3: Mouse Balabit
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[2]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-2"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-2"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <div
              onMouseMove={handleMouseBalabitMove}
              style={{
                height: "200px",
                background: "rgba(255,255,255,0.8)",
                border: "1px dashed var(--primary)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "crosshair",
              }}
            >
              Click and Move Mouse Here
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Captured {mouseBalabit.length} movement points
            </div>

            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => {
                  setError(null);
                  setStep(1);
                }}
              >
                Back
              </button>
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={() => goToNextStep(3)}
              >
                Next: Voice Telemetry
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 4: Voice Analysis
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[3]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-3"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-3"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: isRecording
                      ? "rgba(239, 68, 68, 0.1)"
                      : "var(--panel-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `2px solid ${isRecording ? "var(--danger)" : "var(--primary)"}`,
                    transition: "all 0.3s ease",
                    boxShadow: isRecording
                      ? "0 0 15px rgba(239,68,68,0.4)"
                      : "none",
                  }}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isRecording ? "var(--danger)" : "var(--primary)"}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="22"></line>
                  </svg>
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "var(--text-main)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  00:{(10 - recordingTime).toString().padStart(2, "0")}
                </div>
                {!voiceData && (
                  <button
                    className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
                    onClick={isRecording ? stopRecording : startRecording}
                    style={{ minWidth: "150px" }}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                )}
              </div>
            </div>

            <div className="capture-device-panel">
              <div>
                <strong>Input microphone</strong>
                <span>
                  Connect the phone by USB-C and select it here if Windows
                  exposes it as a microphone.
                </span>
              </div>
              <select
                value={selectedMicrophone}
                onChange={(e) => setSelectedMicrophone(e.target.value)}
              >
                <option value="">System default microphone</option>
                {microphones.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline"
                onClick={refreshCaptureDevices}
              >
                Refresh devices
              </button>
            </div>

            {voiceData && (
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--success)",
                  fontWeight: 600,
                }}
              >
                Audio features extracted successfully
              </div>
            )}
            {!voiceData && (
              <label className="btn btn-outline" style={{ cursor: "pointer" }}>
                Upload voice feature JSON
                <input
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileUpload(e, setVoiceData)}
                />
              </label>
            )}
            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => {
                  setError(null);
                  setStep(2);
                }}
              >
                Back
              </button>
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={() => goToNextStep(4)}
              >
                Next: Gait Telemetry
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 5: Gait Analysis
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[4]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-4"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-4"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <div style={{ textAlign: "center", padding: "1rem" }}>
              <div
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <div
                  style={{
                    width: "320px",
                    height: "240px",
                    borderRadius: "12px",
                    background: "var(--panel-bg)",
                    border: `2px solid ${isRecordingVideo ? "var(--danger)" : "var(--primary)"}`,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: isRecordingVideo
                      ? "0 0 15px rgba(239,68,68,0.4)"
                      : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <video
                    ref={videoRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: isRecordingVideo ? "block" : "none",
                    }}
                    muted
                  />
                  {!isRecordingVideo && (
                    <svg
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ opacity: 0.5 }}
                    >
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect
                        x="1"
                        y="5"
                        width="15"
                        height="14"
                        rx="2"
                        ry="2"
                      ></rect>
                    </svg>
                  )}
                  {isRecordingVideo && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        background: "rgba(239, 68, 68, 0.9)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        animation: "pulse 1.5s infinite",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "white",
                          borderRadius: "50%",
                        }}
                      ></div>
                      REC
                    </div>
                  )}
                </div>
                {!gaitData && (
                  <button
                    className={`btn ${isRecordingVideo ? "btn-danger" : "btn-primary"}`}
                    onClick={
                      isRecordingVideo
                        ? stopVideoRecording
                        : startVideoRecording
                    }
                    disabled={
                      isRecordingVideo &&
                      gaitCaptureSeconds < MIN_GAIT_CAPTURE_SECONDS
                    }
                    style={{ minWidth: "150px" }}
                  >
                    {isRecordingVideo
                      ? gaitCaptureSeconds < MIN_GAIT_CAPTURE_SECONDS
                        ? `Capturing... ${gaitCaptureSeconds}/4s`
                        : "Stop Video Capture"
                      : "Start Video Capture"}
                  </button>
                )}
              </div>
            </div>

            <div className="capture-device-panel">
              <div>
                <strong>Input camera</strong>
                <span>
                  Connect the phone by USB-C and select its camera when
                  available to this browser.
                </span>
              </div>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
              >
                <option value="">System default camera</option>
                {cameras.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline"
                onClick={refreshCaptureDevices}
              >
                Refresh devices
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                justifyContent: "center",
              }}
            >
              {!gaitData && (
                <label
                  className="btn btn-outline"
                  style={{
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    padding: "0.4rem 0.8rem",
                  }}
                >
                  Upload JSON (Fallback)
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={(e) => handleFileUpload(e, setGaitData)}
                  />
                </label>
              )}
            </div>
            {gaitData && (
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--success)",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Telemetry & Video Data loaded successfully
              </div>
            )}

            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => {
                  setError(null);
                  setStep(3);
                }}
              >
                Back
              </button>
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={() => goToNextStep(5)}
              >
                Next: Spiral Tracing
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="fade-in">
            <h3
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                color: "var(--primary)",
              }}
            >
              Step 6: Spiral Tracing
            </h3>
            <p style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>
              {tasks[5]}
            </p>

            <div
              style={{
                background: "rgba(139, 92, 246, 0.05)",
                border: "1px solid rgba(139, 92, 246, 0.2)",
                padding: "1rem",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <input
                type="checkbox"
                id="verify-5"
                checked={isVerified}
                onChange={(e) => setIsVerified(e.target.checked)}
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                  accentColor: "var(--primary)",
                }}
              />
              <label
                htmlFor="verify-5"
                style={{
                  cursor: "pointer",
                  color: "var(--text-main)",
                  fontSize: "0.95rem",
                  userSelect: "none",
                }}
              >
                I verify that the patient has understood and completed the
                assigned task exactly as instructed.
              </label>
            </div>

            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  position: "relative",
                  display: "inline-block",
                  border: "2px solid rgba(139, 92, 246, 0.4)",
                  borderRadius: "12px",
                  overflow: "hidden",
                  background: "#ffffff",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={300}
                  onPointerDown={startDrawing}
                  onPointerMove={draw}
                  onPointerUp={stopDrawing}
                  onPointerCancel={stopDrawing}
                  style={{ cursor: "crosshair", touchAction: "none" }}
                />
                {!spiralData && spiralPoints.length === 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      pointerEvents: "none",
                      color: "var(--text-muted)",
                    }}
                  >
                    Draw your spiral here
                  </div>
                )}
              </div>
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <button className="btn btn-outline" onClick={clearCanvas}>
                  Clear Canvas
                </button>
              </div>
            </div>

            {spiralData && (
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--success)",
                  fontWeight: 600,
                }}
              >
                Spiral pattern captured successfully
              </div>
            )}

            {error && (
              <div
                style={{
                  color: "var(--danger)",
                  padding: "0.75rem",
                  background: "rgba(239,68,68,0.1)",
                  borderRadius: "8px",
                  marginTop: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                className="btn btn-outline"
                onClick={() => {
                  setError(null);
                  setStep(4);
                }}
                disabled={isAnalyzing}
              >
                Back
              </button>
              <button
                id="next-step-btn"
                className="btn btn-primary"
                onClick={runAnalysis}
                disabled={isAnalyzing}
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  boxShadow: "0 4px 14px 0 rgba(16,185,129,0.3)",
                  minWidth: "250px",
                }}
              >
                {isAnalyzing ? (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <svg
                      className="animate-spin"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    {analysisStatus}
                  </span>
                ) : (
                  "Run Global Multimodal Analysis"
                )}
              </button>
            </div>
          </div>
        );
      case 6:
        if (!result) return null;

        const fusion = result.fusion;
        const fusedRisk =
          fusion.fused_risk_score ??
          fusion.motor_consistency_score ??
          fusion.risk_score ??
          0;
        const xai = fusion.explainable_ai || {
          primary_contributors: ["Analysis unavailable"],
          recommendation: "Please run a complete multimodal assessment.",
        };

        return (
          <div className="fade-in">
            <div className="report-card fade-in" style={{ marginTop: 0 }}>
              <div className="report-header">
                <div className="report-title">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Comprehensive Clinical Report
                </div>
                <div
                  style={{ display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <span
                    className="badge badge-active"
                    style={{
                      background: "var(--primary)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    Multimodal Analysis
                  </span>

                  <button
                    className="btn btn-outline"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                    }}
                    onClick={() => setShowEmailInput(!showEmailInput)}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: "0.4rem" }}
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    Email Report
                  </button>

                  <button
                    className="btn btn-outline"
                    style={{
                      padding: "0.4rem 0.8rem",
                      fontSize: "0.85rem",
                      borderColor: "var(--primary)",
                      color: "var(--primary)",
                    }}
                    onClick={() => window.print()}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ marginRight: "0.4rem" }}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download PDF
                  </button>
                </div>
              </div>

              {showEmailInput && (
                <div
                  style={{
                    padding: "1rem 1.5rem",
                    background: "rgba(139, 92, 246, 0.05)",
                    borderBottom: "1px solid var(--panel-border)",
                    display: "flex",
                    gap: "1rem",
                    alignItems: "center",
                  }}
                >
                  <input
                    type="email"
                    placeholder="Doctor's Email Address"
                    className="input-area"
                    style={{
                      margin: 0,
                      padding: "0.5rem",
                      height: "auto",
                      flex: 1,
                    }}
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={sendEmailReport}
                    disabled={isEmailing || !emailAddress}
                  >
                    {isEmailing ? "Sending..." : "Send securely"}
                  </button>
                  {emailStatus && (
                    <span
                      style={{
                        color: emailStatus.includes("Error")
                          ? "var(--danger)"
                          : "var(--success)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      {emailStatus}
                    </span>
                  )}
                </div>
              )}

              <div className="report-body">
                <div className="report-grid">
                  <div className="metric-box">
                    <div className="metric-label">
                      Combined Motor-Pattern Score
                    </div>
                    <div
                      className={`metric-value ${fusedRisk >= 0.5 ? "risk-high" : "risk-low"}`}
                    >
                      {(fusedRisk * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="metric-box">
                    <div className="metric-label">Screening Interpretation</div>
                    <div
                      className={`metric-value ${fusedRisk >= 0.5 ? "risk-high" : "risk-low"}`}
                      style={{ fontSize: "1.4rem" }}
                    >
                      {fusedRisk >= 0.7
                        ? "Elevated signal"
                        : fusedRisk >= 0.4
                          ? "Monitor over time"
                          : "Lower signal"}
                    </div>
                  </div>

                  <div className="metric-box">
                    <div className="metric-label">Assessment Coverage</div>
                    <div
                      className="metric-value"
                      style={{
                        color: "var(--text-main)",
                        fontSize: "1.65rem",
                      }}
                    >
                      {fusion.available_modalities?.length || 0} modalities
                    </div>
                  </div>

                  <div className="metric-box">
                    <div className="metric-label">Medication State</div>
                    <div
                      className="metric-value"
                      style={{
                        color: "var(--text-main)",
                        fontSize: "1.3rem",
                      }}
                    >
                      {medicationState === "ON"
                        ? "ON (Recent Dose)"
                        : medicationState === "OFF"
                          ? "OFF (Wearing Off)"
                          : "Unknown / N/A"}
                    </div>
                  </div>
                </div>

                <div
                  className="predictability-section"
                  style={{
                    background: "var(--panel-bg)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "1px solid var(--panel-border)",
                  }}
                >
                  <div
                    className="predictability-title"
                    style={{
                      color: "var(--text-main)",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      marginBottom: "1rem",
                      fontSize: "1.15rem",
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--primary)"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    Multimodal Explainable AI (XAI)
                  </div>

                  <div style={{ marginBottom: "1.5rem" }}>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.75rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Primary Multimodal Contributors:
                    </h4>
                    <ul
                      style={{
                        listStyleType: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      {xai.primary_contributors.map(
                        (contributor: string, i: number) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              color: "var(--text-main)",
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="var(--primary)"
                              strokeWidth="2"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {contributor}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--text-muted)",
                        marginBottom: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Holistic Recommendation:
                    </h4>
                    <div
                      className="predictability-text"
                      style={{
                        fontStyle: "italic",
                        color: "var(--text-main)",
                        background: "rgba(255,255,255,0.4)",
                        padding: "1rem",
                        borderRadius: "8px",
                        borderLeft: "4px solid var(--primary)",
                      }}
                    >
                      "{xai.recommendation}"
                    </div>
                  </div>

                  {xai.llm_report && (
                    <div style={{ marginTop: "1.5rem" }}>
                      <h4
                        style={{
                          fontSize: "0.95rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.5rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                        </svg>
                        Clinical LLM Narrative (RAG)
                        {xai.rag_status !== "ollama_generated" && (
                          <span
                            style={{ fontSize: "0.75rem", fontWeight: 400 }}
                          >
                            Retrieved context only
                          </span>
                        )}
                      </h4>
                      <div
                        className="predictability-text"
                        style={{
                          color: "var(--text-main)",
                          background: "rgba(255,255,255,0.6)",
                          padding: "1.25rem",
                          borderRadius: "8px",
                          border: "1px solid var(--panel-border)",
                          whiteSpace: "pre-line",
                          lineHeight: "1.7",
                        }}
                      >
                        {xai.llm_report}
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ marginTop: "1.5rem" }}>
                  <h4
                    style={{
                      fontSize: "1rem",
                      color: "var(--text-main)",
                      fontWeight: 600,
                      marginBottom: "1rem",
                    }}
                  >
                    Sub-Module Telemetry Results
                  </h4>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(280px, 1fr))",
                      gap: "1rem",
                    }}
                  >
                    {Object.keys(result.modalities).map((mod) => {
                      const modData = result.modalities[mod];
                      return (
                        <div
                          key={mod}
                          style={{
                            background: "rgba(255,255,255,0.6)",
                            padding: "1.25rem",
                            borderRadius: "10px",
                            border: "1px solid rgba(139, 92, 246, 0.15)",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "var(--primary)",
                              textTransform: "uppercase",
                              fontWeight: 600,
                              marginBottom: "0.5rem",
                            }}
                          >
                            {MODULES.find((m) => m.id === mod)?.name || mod}
                          </div>
                          <div
                            style={{
                              fontSize: "1rem",
                              color: "var(--text-main)",
                              fontWeight: 500,
                              marginBottom: "0.25rem",
                            }}
                          >
                            Result: {modData.prediction || "Completed"}
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            Research screening output; interpret with clinical
                            context.
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "2rem", textAlign: "center", display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button
                className="btn btn-outline"
                style={{
                  borderColor: "var(--primary)",
                  color: "var(--primary)",
                }}
                onClick={() => generateFHIRBundle(patientId || "anonymous", result)}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "0.4rem" }}
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Export EMR (FHIR)
              </button>
              <button
                className="btn btn-outline"
                onClick={() => navigate("/dashboard")}
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fade-in capture-container">
      <div className="capture-header">
        <div
          className="back-btn"
          onClick={() => navigate("/dashboard")}
          title="Back to Dashboard"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <div>
          <h1 className="capture-title">Comprehensive Assessment</h1>
          <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
            Complete all diagnostic modules for a holistic clinical evaluation.
          </p>
          {step < 6 && (
            <div
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--text-main)",
                }}
              >
                Patient ID:
              </span>
              <input
                type="text"
                placeholder="e.g. PT-10024"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "1px solid var(--panel-border)",
                  background: "var(--panel-bg)",
                  color: "var(--text-main)",
                  outline: "none",
                  fontSize: "0.9rem",
                  width: "200px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  color: "#10b981",
                  background: "rgba(16, 185, 129, 0.1)",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                  ></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                HIPAA Compliant
              </div>

              <div style={{ width: "1px", height: "24px", background: "var(--panel-border)", margin: "0 0.5rem" }} />
              
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "var(--text-main)",
                }}
              >
                Medication State:
              </span>
              <select
                value={medicationState}
                onChange={(e: any) => setMedicationState(e.target.value)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "6px",
                  border: "1px solid var(--panel-border)",
                  background: "var(--panel-bg)",
                  color: "var(--text-main)",
                  outline: "none",
                  fontSize: "0.9rem",
                  cursor: "pointer",
                }}
              >
                <option value="UNKNOWN">Unknown / N/A</option>
                <option value="ON">ON (Recent Dose)</option>
                <option value="OFF">OFF (Wearing Off)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="capture-panel">
        {step < 6 && (
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
            {[0, 1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                style={{
                  height: "4px",
                  flex: 1,
                  borderRadius: "2px",
                  background:
                    s <= step ? "var(--primary)" : "var(--panel-border)",
                }}
              />
            ))}
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
}
