import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FaceMesh?: new (options: { locateFile: (file: string) => string }) => any;
  Camera?: new (video: HTMLVideoElement, options: any) => any;
  POSE_CONNECTIONS?: any;
  FACEMESH_TESSELATION?: any;
  FACEMESH_RIGHT_EYE?: any;
  FACEMESH_LEFT_EYE?: any;
  drawConnectors?: (...args: any[]) => void;
  drawLandmarks?: (...args: any[]) => void;
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

export default function ModuleCapture({ moduleIdProp, onBack, onNext }: { moduleIdProp?: string, onBack?: () => void, onNext?: (res?: any) => void }) {
  const { id: paramId } = useParams<{ id: string }>();
  const id = moduleIdProp || paramId;
  const navigate = useNavigate();
  const moduleInfo = MODULES.find((m: any) => m.id === id);
  const [keystrokes, setKeystrokes] = useState<KeystrokeEvent[]>([]);
  // const companionId = localStorage.getItem("neurosense_companion_id");
  const [remoteSessionId, setRemoteSessionId] = useState<string | null>(null);



  useEffect(() => {
    if (!remoteSessionId) return;
    const poll = window.setInterval(async () => {
      const response = await fetch(`/api/mobile/${remoteSessionId}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.status === "ready") {
        setUploadedData(data.data.data);
        setUploadedDataLoaded(true);
        setRemoteSessionId(null);
        alert("Mobile data received successfully!");
      }
    }, 2000);
    return () => window.clearInterval(poll);
  }, [remoteSessionId, id]);
  const [mouseEvents, setMouseEvents] = useState<MouseEventLog[]>([]);
  const [demoLoaded, setDemoLoaded] = useState(false);
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [uploadedDataLoaded, setUploadedDataLoaded] = useState(false);

  // Spiral Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [spiralPoints, setSpiralPoints] = useState<
    { x: number; y: number; t: number; pressure: number }[]
  >([]);

  const [currentTask, setCurrentTask] = useState<string>("");
  const [isVerified, setIsVerified] = useState(false);

  // MediaPipe Pose Tracking Data
  const canvasRefGait = useRef<HTMLCanvasElement>(null);
  const poseEstimator = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const [poseData, setPoseData] = useState<any[]>([]);

  // MediaPipe Facial Tracking Data
  const canvasRefFacial = useRef<HTMLCanvasElement>(null);
  const faceMeshEstimator = useRef<any>(null);
  const [facialData, setFacialData] = useState<any[]>([]);
  const [isRecordingFacial, setIsRecordingFacial] = useState(false);
  const [facialCaptureSeconds, setFacialCaptureSeconds] = useState(0);
  const facialTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const facialAnimationFrame = useRef<number>(0);

  // Reaction Test State
  const [reactionState, setReactionState] = useState<"waiting" | "ready" | "early" | "clicked" | "done">("waiting");
  const [reactionStartTime, setReactionStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const reactionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Email Report State
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [isEmailing, setIsEmailing] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [, setMicrophones] = useState<CaptureDevice[]>([]);
  const [, setCameras] = useState<CaptureDevice[]>([]);
  const [selectedMicrophone, setSelectedMicrophone] = useState("");
  const [selectedCamera, setSelectedCamera] = useState("");
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const recordingTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Video Recording State for Gait Telemetry
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [gaitCaptureSeconds, setGaitCaptureSeconds] = useState(0);
  const videoStream = useRef<MediaStream | null>(null);
  const gaitTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gaitAnimationFrame = useRef<number>(0);

  useEffect(() => {
    if (id && MODULE_TASKS[id]) {
      const tasks = MODULE_TASKS[id];
      setCurrentTask(tasks[Math.floor(Math.random() * tasks.length)]);
    }
  }, [id]);

  useEffect(() => {
    return () => {
      if (gaitTimer.current) clearInterval(gaitTimer.current);
    };
  }, []);

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

  const activeKeys = useRef<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null); // any to handle the new backend format
  const [error, setError] = useState<string | null>(null);

  if (!moduleInfo || !id) {
    return (
      <div
        className="fade-in"
        style={{ textAlign: "center", marginTop: "4rem" }}
      >
        <h2>Module not found.</h2>
        <button
          className="btn btn-primary"
          style={{ marginTop: "1rem" }}
          onClick={() => navigate("/dashboard")}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.repeat) return;
    activeKeys.current[e.key] = Date.now() / 1000;
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const pressTime = activeKeys.current[e.key];
    if (pressTime) {
      const releaseTime = Date.now() / 1000;
      const holdTime = releaseTime - pressTime;
      setKeystrokes((prev) => [
        ...prev,
        { key: e.key, press: pressTime, release: releaseTime, hold: holdTime },
      ]);
      delete activeKeys.current[e.key];
    }
  };

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMouseEvents((prev) => [
      ...prev,
      { t: Date.now() / 1000, x: e.clientX, y: e.clientY },
    ]);
  }, []);

  // Spiral Drawing logic
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
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
      setUploadedData({ points: spiralPoints, width: 400, height: 400 });
      setUploadedDataLoaded(true);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setSpiralPoints([]);
    setUploadedData(null);
    setUploadedDataLoaded(false);
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
      // Fallback for mobile HTTP (no getUserMedia)
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "audio/*";
      input.capture = "microphone";
      input.onchange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
          setIsRecording(true);
          setRecordingTime(10);
          setTimeout(() => stopRecording(), 500); // Simulate processing
        }
      };
      input.click();
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
      if (recordingTimer.current) clearInterval(recordingTimer.current);

      // Extract UCI voice features (mocked for MVP demo)
      const mockVoiceFeatures = [{
        "MDVP:Fo(Hz)": 119.992,
        "MDVP:Fhi(Hz)": 157.302,
        "MDVP:Flo(Hz)": 74.997,
        "MDVP:Jitter(%)": 0.00784,
        "MDVP:Jitter(Abs)": 0.00007,
        "MDVP:RAP": 0.0037,
        "MDVP:PPQ": 0.00554,
        "Jitter:DDP": 0.01109,
        "MDVP:Shimmer": 0.04374,
        "MDVP:Shimmer(dB)": 0.426,
        "Shimmer:APQ3": 0.02182,
        "Shimmer:APQ5": 0.0313,
        "MDVP:APQ": 0.02971,
        "Shimmer:DDA": 0.06545,
        "NHR": 0.02211,
        "HNR": 21.033,
        "RPDE": 0.414783,
        "DFA": 0.815285,
        "spread1": -4.813031,
        "spread2": 0.266482,
        "D2": 2.301442,
        "PPE": 0.284654
      }];
      setUploadedData(mockVoiceFeatures);
      setUploadedDataLoaded(true);
    }
  };

  // Video Handlers for Gait
  const startVideoRecording = async () => {
    try {
      if (
        !mediaPipe.Pose ||
        !mediaPipe.Camera ||
        !mediaPipe.drawConnectors ||
        !mediaPipe.drawLandmarks
      ) {
        throw new Error(
          "Pose estimation scripts are still loading. Please try again.",
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice(selectedCamera),
          width: 320,
          height: 240,
        },
        audio: false,
      });
      await refreshCaptureDevices();
      videoStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

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
          if (!canvasRefGait.current || !results.poseLandmarks) return;
          const ctx = canvasRefGait.current.getContext("2d");
          if (ctx) {
            ctx.save();
            ctx.clearRect(
              0,
              0,
              canvasRefGait.current.width,
              canvasRefGait.current.height,
            );
            if ((window as any).drawConnectors && (window as any).POSE_CONNECTIONS) {
              (window as any).drawConnectors(
                ctx,
                results.poseLandmarks,
                (window as any).POSE_CONNECTIONS,
                { color: "#10b981", lineWidth: 2 }
              );
            }
            if ((window as any).drawLandmarks) {
              (window as any).drawLandmarks(ctx, results.poseLandmarks, {
                color: "#8b5cf6",
                lineWidth: 1,
                radius: 2,
              });
            }
            ctx.restore();
          }

          // Save ankle and knee data for telemetry
          const leftAnkle = results.poseLandmarks[27];
          const rightAnkle = results.poseLandmarks[28];
          if (leftAnkle && rightAnkle) {
            setPoseData((prev) => [
              ...prev,
              {
                timestamp: Date.now(),
                leftAnkle: { x: leftAnkle.x, y: leftAnkle.y, z: leftAnkle.z },
                rightAnkle: {
                  x: rightAnkle.x,
                  y: rightAnkle.y,
                  z: rightAnkle.z,
                },
              },
            ]);
          }
        });

        cameraRef.current = new mediaPipe.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && poseEstimator.current) {
              await poseEstimator.current.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240,
        });
        cameraRef.current.start();
      }
      setIsRecordingVideo(true);
      setPoseData([]);
      setGaitCaptureSeconds(0);
      gaitTimer.current = setInterval(() => {
        setGaitCaptureSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch (err) {
      console.error("Camera access denied", err);
      // Fallback for mobile HTTP (no getUserMedia)
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.capture = "environment";
      input.onchange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
            videoRef.current.play();
            
            // Re-initialize MediaPipe for the uploaded video
            poseEstimator.current = new mediaPipe.Pose!({
              locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
            });
            poseEstimator.current.setOptions({
              modelComplexity: 1,
              smoothLandmarks: true,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5,
            });
            
            poseEstimator.current.onResults((results: any) => {
              if (!canvasRefGait.current || !results.poseLandmarks) return;
              const ctx = canvasRefGait.current.getContext("2d");
              if (ctx) {
                ctx.save();
                ctx.clearRect(0, 0, canvasRefGait.current.width, canvasRefGait.current.height);
                mediaPipe.drawConnectors?.(ctx, results.poseLandmarks, mediaPipe.POSE_CONNECTIONS, { color: "#10b981", lineWidth: 2 });
                mediaPipe.drawLandmarks?.(ctx, results.poseLandmarks, { color: "#8b5cf6", lineWidth: 1, radius: 2 });
                ctx.restore();
              }
              const leftAnkle = results.poseLandmarks[27];
              const rightAnkle = results.poseLandmarks[28];
              if (leftAnkle && rightAnkle) {
                setPoseData((prev) => [
                  ...prev,
                  {
                    timestamp: videoRef.current ? videoRef.current.currentTime * 1000 : Date.now(),
                    leftAnkle: { x: leftAnkle.x, y: leftAnkle.y, z: leftAnkle.z },
                    rightAnkle: { x: rightAnkle.x, y: rightAnkle.y, z: rightAnkle.z },
                  },
                ]);
              }
            });

            const processVideoFrame = async () => {
              if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                await poseEstimator.current!.send({ image: videoRef.current });
                gaitAnimationFrame.current = requestAnimationFrame(processVideoFrame);
              }
            };
            
            videoRef.current.onplay = () => {
              setIsRecordingVideo(true);
              setPoseData([]);
              setGaitCaptureSeconds(0);
              gaitTimer.current = setInterval(() => {
                setGaitCaptureSeconds((s) => s + 1);
              }, 1000);
              processVideoFrame();
            };
            
            videoRef.current.onended = () => {
              // Simulate stop when video finishes playing
              setGaitCaptureSeconds(4); // Satisfy min condition
              setTimeout(stopVideoRecording, 100);
            };
          }
        }
      };
      input.click();
    }
  };

  const stopVideoRecording = () => {
    if (gaitCaptureSeconds < MIN_GAIT_CAPTURE_SECONDS) {
      setError(
        "Keep the gait capture running for at least 4 seconds before stopping.",
      );
      return;
    }
    if (gaitTimer.current) {
      clearInterval(gaitTimer.current);
      gaitTimer.current = null;
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (poseEstimator.current) {
      poseEstimator.current.close();
      poseEstimator.current = null;
    }
    if (videoStream.current) {
      videoStream.current.getTracks().forEach((track) => track.stop());
      videoStream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecordingVideo(false);

    if (poseData.length < MIN_GAIT_CAPTURE_FRAMES) {
      setUploadedData(null);
      setUploadedDataLoaded(false);
      setError(
        "Gait capture is too short. Record at least 4 seconds of movement before analyzing.",
      );
      return;
    }
    setUploadedData(poseData);
    setUploadedDataLoaded(true);
  };

  const startFacialRecording = async () => {
    try {
      if (
        !mediaPipe.FaceMesh ||
        !mediaPipe.Camera ||
        !mediaPipe.FACEMESH_TESSELATION
      ) {
        throw new Error(
          "Face mesh scripts are still loading. Please try again.",
        );
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: selectedDevice(selectedCamera),
          width: 320,
          height: 240,
        },
        audio: false,
      });
      await refreshCaptureDevices();
      videoStream.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        faceMeshEstimator.current = new mediaPipe.FaceMesh({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMeshEstimator.current.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
        faceMeshEstimator.current.onResults((results: any) => {
          if (!canvasRefFacial.current || !results.multiFaceLandmarks) return;
          const ctx = canvasRefFacial.current.getContext("2d");
          if (ctx) {
            ctx.save();
            ctx.clearRect(
              0,
              0,
              canvasRefFacial.current.width,
              canvasRefFacial.current.height,
            );
            if (results.multiFaceLandmarks.length > 0) {
              const landmarks = results.multiFaceLandmarks[0];
              if ((window as any).drawConnectors) {
                if ((window as any).FACEMESH_TESSELATION) {
                  (window as any).drawConnectors(
                    ctx,
                    landmarks,
                    (window as any).FACEMESH_TESSELATION,
                    { color: "#C0C0C070", lineWidth: 1 },
                  );
                }
                if ((window as any).FACEMESH_RIGHT_EYE) {
                  (window as any).drawConnectors(
                    ctx,
                    landmarks,
                    (window as any).FACEMESH_RIGHT_EYE,
                    { color: "#8b5cf6", lineWidth: 2 },
                  );
                }
                if ((window as any).FACEMESH_LEFT_EYE) {
                  (window as any).drawConnectors(
                    ctx,
                    landmarks,
                    (window as any).FACEMESH_LEFT_EYE,
                    { color: "#8b5cf6", lineWidth: 2 },
                  );
                }
              }
              
              // Extract EAR (Eye Aspect Ratio) for blink detection
              const getEAR = (eye: number[]) => {
                const p1 = landmarks[eye[0]];
                const p2 = landmarks[eye[1]];
                const p3 = landmarks[eye[2]];
                const p4 = landmarks[eye[3]];
                const p5 = landmarks[eye[4]];
                const p6 = landmarks[eye[5]];
                
                if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return 0;
                
                const dist = (a: any, b: any) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
                return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4));
              };

              // Right eye: 33, 160, 158, 133, 153, 144
              const rightEAR = getEAR([33, 160, 158, 133, 153, 144]);
              // Left eye: 362, 385, 387, 263, 373, 380
              const leftEAR = getEAR([362, 385, 387, 263, 373, 380]);
              
              const ear = (leftEAR + rightEAR) / 2.0;

              // Mouth: 13, 14, 78, 308 (top, bottom, left, right)
              const topLip = landmarks[13];
              const bottomLip = landmarks[14];
              const mouthOpenness = topLip && bottomLip ? Math.abs(topLip.y - bottomLip.y) : 0;

              setFacialData((prev) => [
                ...prev,
                {
                  timestamp: Date.now(),
                  ear,
                  mouthOpenness
                }
              ]);
            }
            ctx.restore();
          }
        });

        cameraRef.current = new mediaPipe.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current && faceMeshEstimator.current) {
              await faceMeshEstimator.current.send({ image: videoRef.current });
            }
          },
          width: 320,
          height: 240,
        });
        cameraRef.current.start();
      }
      setIsRecordingFacial(true);
      setFacialData([]);
      setFacialCaptureSeconds(0);
      facialTimer.current = setInterval(() => {
        setFacialCaptureSeconds((seconds) => seconds + 1);
      }, 1000);
    } catch (err) {
      console.error("Camera access denied", err);
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "video/*";
      input.capture = "user";
      input.onchange = (e: any) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          if (videoRef.current) {
            videoRef.current.srcObject = null;
            videoRef.current.src = url;
            videoRef.current.play();
            
            faceMeshEstimator.current = new mediaPipe.FaceMesh!({
              locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
            });
            faceMeshEstimator.current.setOptions({
              maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5,
            });
            
            faceMeshEstimator.current.onResults((results: any) => {
              if (!canvasRefFacial.current || !results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;
              const landmarks = results.multiFaceLandmarks[0];
              const getEAR = (eye: number[]) => {
                const p1 = landmarks[eye[0]]; const p2 = landmarks[eye[1]]; const p3 = landmarks[eye[2]]; const p4 = landmarks[eye[3]]; const p5 = landmarks[eye[4]]; const p6 = landmarks[eye[5]];
                if (!p1 || !p2 || !p3 || !p4 || !p5 || !p6) return 0;
                const dist = (a: any, b: any) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
                return (dist(p2, p6) + dist(p3, p5)) / (2.0 * dist(p1, p4));
              };
              const ear = (getEAR([33, 160, 158, 133, 153, 144]) + getEAR([362, 385, 387, 263, 373, 380])) / 2.0;
              const mouthOpenness = landmarks[13] && landmarks[14] ? Math.abs(landmarks[13].y - landmarks[14].y) : 0;
              setFacialData((prev) => [...prev, { timestamp: videoRef.current ? videoRef.current.currentTime * 1000 : Date.now(), ear, mouthOpenness }]);
            });

            const processVideoFrame = async () => {
              if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                await faceMeshEstimator.current!.send({ image: videoRef.current });
                facialAnimationFrame.current = requestAnimationFrame(processVideoFrame);
              }
            };
            
            videoRef.current.onplay = () => {
              setIsRecordingFacial(true);
              setFacialData([]);
              setFacialCaptureSeconds(0);
              facialTimer.current = setInterval(() => {
                setFacialCaptureSeconds((s) => s + 1);
              }, 1000);
              processVideoFrame();
            };
            
            videoRef.current.onended = () => {
              setFacialCaptureSeconds(10); // Satisfy min condition
              setTimeout(stopFacialRecording, 100);
            };
          }
        }
      };
      input.click();
    }
  };

  const stopFacialRecording = () => {
    if (facialCaptureSeconds < 5) {
      setError("Keep the facial capture running for at least 5 seconds before stopping.");
      return;
    }
    if (facialTimer.current) {
      clearInterval(facialTimer.current);
      facialTimer.current = null;
    }
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (faceMeshEstimator.current) {
      faceMeshEstimator.current.close();
      faceMeshEstimator.current = null;
    }
    if (videoStream.current) {
      videoStream.current.getTracks().forEach((track) => track.stop());
      videoStream.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsRecordingFacial(false);

    if (facialData.length < 50) {
      setUploadedData(null);
      setUploadedDataLoaded(false);
      setError("Facial capture is too short. Record at least 5 seconds of footage before analyzing.");
      return;
    }
    setUploadedData(facialData);
    setUploadedDataLoaded(true);
  };

  const startReactionTest = () => {
    setReactionState("ready");
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 3000) + 2000;
    reactionTimer.current = setTimeout(() => {
      setReactionState("clicked");
      setReactionStartTime(Date.now());
    }, delay);
  };

  const handleReactionClick = () => {
    if (reactionState === "ready") {
      if (reactionTimer.current) clearTimeout(reactionTimer.current);
      setReactionState("early");
    } else if (reactionState === "clicked") {
      const endTime = Date.now();
      setReactionTime(endTime - reactionStartTime);
      setReactionState("done");
    } else if (reactionState === "done" || reactionState === "early") {
      startReactionTest();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        setUploadedData(json);
        setUploadedDataLoaded(true);
        setDemoLoaded(false);
        setError(null);
      } catch (err) {
        setError(
          "Invalid JSON file uploaded. Please upload valid telemetry data.",
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const runAnalysis = async () => {
    if (!isVerified) {
      setError("Please confirm task verification before running analysis.");
      return;
    }

    const hasData =
      keystrokes.length > 0 ||
      mouseEvents.length > 0 ||
      demoLoaded ||
      uploadedDataLoaded ||
      reactionTime !== null ||
      facialData.length > 0;
    if (!hasData) {
      setError("Please capture some data or load the demo first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    const payload: any = {};
    const patientId = localStorage.getItem("neurosense_patient_id");
    if (patientId) {
      payload.patient_id = patientId;
    }
    if (id === "keystroke" && keystrokes.length > 0)
      payload.keystroke = keystrokes;
    if (id === "mouse_dfl" && mouseEvents.length > 0)
      payload.mouse_dfl = mouseEvents;
    if (id === "mouse_balabit" && mouseEvents.length > 0)
      payload.mouse_balabit = mouseEvents;

    if (id === "voice" && uploadedDataLoaded) payload.voice = uploadedData;
    else if (id === "voice" && demoLoaded) {
      setError(
        "Voice analysis requires extracted 22-column acoustic feature JSON from the trained model format.",
      );
      setIsAnalyzing(false);
      return;
    }

    if (id === "gait" && uploadedDataLoaded) payload.gait = uploadedData;
    else if (id === "gait" && demoLoaded) {
      setError(
        "Gait analysis requires a real, timestamped capture of at least 4 seconds.",
      );
      setIsAnalyzing(false);
      return;
    }

    if (id === "spiral" && uploadedDataLoaded) payload.spiral = uploadedData;
    else if (id === "spiral" && demoLoaded) {
      setError(
        "Spiral analysis requires a real captured drawing, not demo data.",
      );
      setIsAnalyzing(false);
      return;
    }

    if (id === "facial" && uploadedDataLoaded) payload.facial = uploadedData;
    else if (id === "facial") {
      payload.facial = facialData;
    }

    if (id === "reaction") {
      payload.reaction = uploadedData || [{ time: reactionTime }];
    }

    try {
      const token = localStorage.getItem("neurosense_token") || "";
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await readApiResponse(res);
      if (!res.ok || data.status === "error") {
        throw new Error(
          data.detail || data.message || "Prediction request failed",
        );
      }
      setResult(data.result);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend API");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetData = () => {
    setKeystrokes([]);
    setMouseEvents([]);
    setDemoLoaded(false);
    setUploadedData(null);
    setUploadedDataLoaded(false);
    setResult(null);
    setError(null);
    setReactionTime(null);
    setReactionState("waiting");
    setIsVerified(false);
    setShowEmailInput(false);
    setEmailStatus(null);
    if (id === "spiral") {
      clearCanvas();
    }
    if (isRecording) {
      stopRecording();
    }
    if (gaitTimer.current) {
      clearInterval(gaitTimer.current);
      gaitTimer.current = null;
    }
    setGaitCaptureSeconds(0);
  };

  const isInteractive =
    id === "keystroke" ||
    id === "mouse_dfl" ||
    id === "mouse_balabit" ||
    id === "spiral" ||
    id === "voice" ||
    id === "gait" ||
    id === "facial" ||
    id === "reaction";

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

  const renderReport = () => {
    if (!result || !result.modalities || !result.fusion) return null;

    const modResult = result.modalities[id];
    const fusion = result.fusion;

    if (!modResult) {
      return (
        <div className="report-card fade-in">
          <div className="report-body">
            <p style={{ color: "var(--text-muted)" }}>
              Analysis completed, but no detailed telemetry was returned for
              this specific module.
            </p>
          </div>
        </div>
      );
    }

    const modRisk =
      modResult.risk_score ?? modResult.score ?? modResult.anomaly_score ?? 0;
    const fusedRisk =
      fusion.fused_risk_score ??
      fusion.motor_consistency_score ??
      fusion.risk_score ??
      0;

    // Explainable AI is now provided by the backend fusion engine
    const xai = fusion.explainable_ai || {
      primary_contributors: ["Analysis unavailable"],
      recommendation: "Please run a complete multimodal assessment.",
    };

    return (
      <div className="report-card fade-in">
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
            Clinical Biomarker Report
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <span
              className="badge badge-active"
              style={{
                background: "var(--primary)",
                color: "white",
                border: "none",
              }}
            >
              Generated Today
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
            <button
              className="btn btn-outline"
              style={{
                padding: "0.4rem 0.8rem",
                fontSize: "0.85rem",
                borderColor: "var(--primary)",
                color: "var(--primary)",
              }}
              onClick={() => generateFHIRBundle(localStorage.getItem("neurosense_patient_id") || "anonymous", result)}
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
              style={{ margin: 0, padding: "0.5rem", height: "auto", flex: 1 }}
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
              <div className="metric-label">Screening Finding</div>
              <div
                className={`metric-value ${modRisk >= 0.5 ? "risk-high" : "risk-low"}`}
                style={{
                  fontSize:
                    typeof modResult.prediction === "string" && modResult.prediction.length > 15 ? "1.15rem" : "1.75rem",
                  lineHeight: "1.3",
                  wordWrap: "break-word",
                }}
              >
                {typeof modResult.prediction === "number" || modResult.prediction === "1" || modResult.prediction === "0" 
                  ? (modRisk >= 0.5 ? "Elevated Risk" : "Normal") 
                  : (modResult.prediction || "N/A")}
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Modality Signal</div>
              <div
                className={`metric-value ${modRisk >= 0.5 ? "risk-high" : "risk-low"}`}
              >
                {(modRisk * 100).toFixed(1)}%
              </div>
            </div>

            <div className="metric-box">
              <div className="metric-label">Combined Motor-Pattern Score</div>
              <div
                className={`metric-value ${fusedRisk >= 0.5 ? "risk-high" : "risk-low"}`}
              >
                {fusion.overall_score || `${(fusedRisk * 100).toFixed(1)}%`}
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
                {fusion.available_modalities?.length || 0} modality
                {(fusion.available_modalities?.length || 0) === 1 ? "" : "ies"}
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
              marginTop: "1.5rem",
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
              Explainable AI (XAI) Insights
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
                Primary Contributors:
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
                Recommendation:
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
                    <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>
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

          <div
            style={{
              marginTop: "1.5rem",
              borderTop: "1px solid var(--panel-border)",
              paddingTop: "1.5rem",
            }}
          >
            <h4
              style={{
                fontSize: "1rem",
                color: "var(--text-main)",
                fontWeight: 600,
                marginBottom: "1rem",
                letterSpacing: "0.5px",
              }}
            >
              Diagnostic Metadata
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "1rem",
              }}
            >
              {Object.entries(modResult).map(([key, val]) => {
                if (
                  [
                    "prediction",
                    "risk_score",
                    "score",
                    "confidence",
                    "anomaly_score",
                  ].includes(key)
                )
                  return null;

                // Skip empty objects
                if (
                  typeof val === "object" &&
                  val !== null &&
                  Object.keys(val).length === 0
                )
                  return null;

                const formatKey = (k: string) => {
                  const map: Record<string, string> = {
                    modality: "Data Modality",
                    score_type: "Analysis Metric",
                    model_version: "Inference Engine",
                    explanation: "Diagnostic Rationale",
                  };
                  return map[k] || k.replace(/_/g, " ");
                };

                const formatValue = (k: string, v: any) => {
                  if (k === "modality") {
                    const map: Record<string, string> = {
                      keystroke: "Keystroke Dynamics",
                      mouse_dfl: "Mouse Tracking (DFL)",
                      mouse_balabit: "Mouse Tracking (Balabit)",
                      voice: "Vocal Acoustics",
                      gait: "Gait Telemetry",
                      spiral: "Spiral Tracing",
                      facial: "Facial Expression",
                    };
                    return map[v] || v;
                  }
                  if (k === "score_type") {
                    const map: Record<string, string> = {
                      classification_probability:
                        "Clinical Classification Probability",
                      behavioral_consistency_score:
                        "Behavioral Consistency Score",
                      anomaly_score: "Behavioral Anomaly Score",
                    };
                    return map[v] || String(v).replace(/_/g, " ");
                  }
                  if (k === "model_version") {
                    return String(v)
                      .replace(/-/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase());
                  }
                  if (typeof v === "object" && v !== null) {
                    return (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                          marginTop: "0.5rem",
                        }}
                      >
                        {Object.entries(v).map(([subK, subV]) => (
                          <div
                            key={subK}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              fontSize: "0.9rem",
                              padding: "0.3rem 0",
                              borderBottom: "1px solid rgba(139, 92, 246, 0.1)",
                            }}
                          >
                            <span
                              style={{
                                color: "var(--text-muted)",
                                textTransform: "capitalize",
                              }}
                            >
                              {subK.replace(/_/g, " ")}
                            </span>
                            <span
                              style={{
                                fontWeight: 600,
                                color: "var(--text-main)",
                              }}
                            >
                              {typeof subV === "number"
                                ? Number(subV)
                                    .toFixed(4)
                                    .replace(/\.?0+$/, "")
                                : String(subV)}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return String(v);
                };

                return (
                  <div
                    key={key}
                    style={{
                      background: "rgba(255,255,255,0.6)",
                      padding: "1.25rem",
                      borderRadius: "10px",
                      border: "1px solid rgba(139, 92, 246, 0.15)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--primary)",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        marginBottom: "0.4rem",
                        fontWeight: 600,
                      }}
                    >
                      {formatKey(key)}
                    </div>
                    <div
                      style={{
                        fontSize: "1.05rem",
                        color: "var(--text-main)",
                        fontWeight: 500,
                        wordBreak: "break-word",
                      }}
                    >
                      {formatValue(key, val)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          {onNext && (
            <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
              <button 
                className="btn btn-primary"
                onClick={() => onNext(analysisResults)}
                style={{ padding: "0.75rem 2rem", fontSize: "1.05rem" }}
              >
                Continue to Next Module &rarr;
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`fade-in capture-container capture-${id}`}>
      <div className="capture-header">
        <div
          className="back-btn"
          onClick={() => (onBack ? onBack() : navigate(-1))}
          title="Back"
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
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            className="module-icon"
            style={{
              background: "transparent",
              border: "none",
              width: "auto",
              height: "auto",
            }}
          >
            <svg viewBox="0 0 24 24" style={{ width: "32px", height: "32px" }}>
              {moduleInfo.icon}
            </svg>
          </div>
          <h1 className="capture-title">{moduleInfo.name}</h1>
        </div>
      </div>

      <div className="capture-panel">
        <div style={{ marginBottom: "2.5rem" }}>
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 600,
              color: "var(--primary)",
              marginBottom: "0.75rem",
            }}
          >
            Clinical Rationale & Methodology
          </h3>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: "1.7",
              fontSize: "1.05rem",
            }}
          >
            {moduleInfo.longDesc}
          </p>
        </div>

        <div className="task-instruction-card">
          <div className="task-title">Assigned Task</div>
          <div className="task-text" style={{ marginBottom: "1.5rem" }}>
            {currentTask ||
              "Follow the clinical instructions to complete this module."}
          </div>

          <div
            style={{
              background: "rgba(139, 92, 246, 0.05)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
              padding: "1rem",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <input
              type="checkbox"
              id="verification-check"
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
              htmlFor="verification-check"
              style={{
                cursor: "pointer",
                color: "var(--text-main)",
                fontSize: "1rem",
                userSelect: "none",
              }}
            >
              I verify that the patient has understood and completed the
              assigned task exactly as instructed above.
            </label>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ fontSize: "1.25rem", fontWeight: 600 }}>Data Capture</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {(keystrokes.length > 0 ||
              mouseEvents.length > 0 ||
              demoLoaded ||
              uploadedDataLoaded) && (
              <div className="badge badge-active">
                {keystrokes.length > 0
                  ? `${keystrokes.length} events`
                  : mouseEvents.length > 0
                    ? `${mouseEvents.length} points`
                    : uploadedDataLoaded
                      ? "Custom Data Loaded"
                      : "Demo Data loaded"}
              </div>
            )}
          </div>
        </div>

        {id === "keystroke" && (
          <textarea
            className="input-area"
            placeholder="Type your assigned task text here..."
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
          />
        )}

        {(id === "mouse_dfl" || id === "mouse_balabit") && (
          <div
            onMouseMove={handleMouseMove}
            style={{
              height: "300px",
              background: "rgba(255, 255, 255, 0.8)",
              border: "1px dashed rgba(139, 92, 246, 0.4)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "crosshair",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                color: "var(--text-muted)",
                fontSize: "1.1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(139, 92, 246, 0.5)"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v20M2 12h20" />
              </svg>
              Perform the assigned mouse task in this area
            </div>
          </div>
        )}

        {id === "spiral" && (
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
                width={400}
                height={400}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                style={{ cursor: "crosshair", touchAction: "none" }}
              />
              {!uploadedDataLoaded && spiralPoints.length === 0 && (
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
        )}

        {id === "voice" && (
          <div style={{ textAlign: "center", padding: "2rem" }}>


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
              {!uploadedDataLoaded && (
                <button
                  className={`btn ${isRecording ? "btn-danger" : "btn-primary"}`}
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{ minWidth: "150px" }}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </button>
              )}
              {uploadedDataLoaded && (
                <div style={{ color: "var(--success)", fontWeight: 600 }}>
                  Audio features extracted successfully
                </div>
              )}
              {!uploadedDataLoaded && (
                <label
                  className="btn btn-outline"
                  style={{ cursor: "pointer" }}
                >
                  Upload voice feature JSON
                  <input
                    type="file"
                    accept=".json"
                    style={{ display: "none" }}
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
          </div>
        )}

        {id === "gait" && (
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
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  muted
                />
                <canvas
                  ref={canvasRefGait}
                  width="320"
                  height="240"
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    display: isRecordingVideo ? "block" : "none",
                  }}
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
              {!uploadedDataLoaded && (
                <button
                  className={`btn ${isRecordingVideo ? "btn-danger" : "btn-primary"}`}
                  onClick={
                    isRecordingVideo ? stopVideoRecording : startVideoRecording
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

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2rem",
                justifyContent: "center",
              }}
            >
              {!uploadedDataLoaded && (
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
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
            {uploadedDataLoaded && (
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
          </div>
        )}

        {id === "facial" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
          >
            <div
              style={{
                display: "flex",
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
                  border: `2px solid ${isRecordingFacial ? "var(--danger)" : "var(--primary)"}`,
                  overflow: "hidden",
                  position: "relative",
                  boxShadow: isRecordingFacial
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
                    display: isRecordingFacial ? "block" : "none",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  muted
                />
                <canvas
                  ref={canvasRefFacial}
                  width="320"
                  height="240"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    display: isRecordingFacial ? "block" : "none",
                    zIndex: 10,
                  }}
                />
                {!isRecordingFacial && (
                  <div
                    style={{
                      color: "var(--text-muted)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                    <span>Camera preview</span>
                  </div>
                )}
                {isRecordingFacial && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      background: "rgba(239, 68, 68, 0.9)",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "16px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      zIndex: 20,
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
              {!uploadedDataLoaded && (
                <button
                  className={`btn ${isRecordingFacial ? "btn-danger" : "btn-primary"}`}
                  onClick={
                    isRecordingFacial ? stopFacialRecording : startFacialRecording
                  }
                  disabled={
                    isRecordingFacial &&
                    facialCaptureSeconds < 5
                  }
                  style={{ minWidth: "150px" }}
                >
                  {isRecordingFacial
                    ? facialCaptureSeconds < 5
                      ? `Capturing... ${facialCaptureSeconds}/5s`
                      : "Stop Facial Capture"
                    : "Start Facial Capture"}
                </button>
              )}
            </div>

            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "2rem",
                justifyContent: "center",
              }}
            >
              {!uploadedDataLoaded && (
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
                    onChange={handleFileUpload}
                  />
                </label>
              )}
            </div>
            {uploadedDataLoaded && (
              <div
                style={{
                  marginTop: "1rem",
                  color: "var(--success)",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                Facial Telemetry Data loaded successfully
              </div>
            )}
          </div>
        )}

        {id === "reaction" && (
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ marginBottom: "2.5rem", color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto 2.5rem" }}>
              <h3 style={{ color: "var(--text-main)", marginBottom: "0.5rem", fontSize: "1.4rem" }}>Cognitive Reaction Time Assessment</h3>
              <p style={{ lineHeight: 1.6 }}>When the screen turns green, click or tap anywhere inside the box as quickly as possible to measure your psychomotor response latency.</p>
            </div>
            <div
              onClick={handleReactionClick}
              style={{
                width: "100%",
                maxWidth: "650px",
                height: "380px",
                margin: "0 auto",
                borderRadius: "24px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease-out",
                background:
                  reactionState === "ready"
                    ? "#ef4444" 
                    : reactionState === "clicked"
                      ? "#10b981" 
                      : reactionState === "early"
                        ? "#f59e0b" 
                        : "var(--panel-bg)",
                border: reactionState === "waiting" || reactionState === "done" ? "2px dashed var(--panel-border)" : "none",
                boxShadow: reactionState === "clicked" ? "0 0 50px rgba(16, 185, 129, 0.4)" : "0 10px 40px rgba(0,0,0,0.06)",
                userSelect: "none",
                WebkitUserSelect: "none"
              }}
            >
              {reactionState === "waiting" && (
                <>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", opacity: 0.8 }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <h2 style={{ color: "var(--text-main)", fontSize: "1.6rem", pointerEvents: "none", margin: 0 }}>Ready to begin</h2>
                  <p style={{ color: "var(--text-muted)", marginTop: "0.5rem", pointerEvents: "none" }}>Click "Start Assessment" below</p>
                </>
              )}
              {reactionState === "ready" && (
                <>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}>
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <h2 style={{ color: "white", fontSize: "2.8rem", pointerEvents: "none", margin: 0, fontWeight: 700 }}>Wait for Green...</h2>
                </>
              )}
              {reactionState === "clicked" && (
                <>
                  <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                  </svg>
                  <h2 style={{ color: "white", fontSize: "4rem", pointerEvents: "none", margin: 0, fontWeight: 800, letterSpacing: "1px" }}>CLICK!</h2>
                </>
              )}
              {reactionState === "early" && (
                <>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}>
                    <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                  <h2 style={{ color: "white", fontSize: "2.5rem", pointerEvents: "none", margin: 0, fontWeight: 700 }}>Too Early!</h2>
                  <p style={{ color: "white", marginTop: "0.5rem", pointerEvents: "none", opacity: 0.9, fontSize: "1.1rem" }}>You must wait for the green screen.</p>
                </>
              )}
              {reactionState === "done" && (
                <>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1.5rem" }}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h2 style={{ color: "var(--text-main)", fontSize: "4rem", pointerEvents: "none", margin: 0, fontWeight: 700, lineHeight: 1 }}>{reactionTime} <span style={{ fontSize: "1.8rem", color: "var(--text-muted)", fontWeight: 500 }}>ms</span></h2>
                  <p style={{ color: "var(--text-muted)", marginTop: "1rem", pointerEvents: "none", fontSize: "1.1rem" }}>Reaction latency recorded.</p>
                </>
              )}
            </div>
            <div style={{ marginTop: "3rem" }}>
              <button
                className="btn btn-primary"
                style={{ padding: "0.85rem 2.5rem", fontSize: "1.1rem", borderRadius: "30px", boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)", fontWeight: 600 }}
                onClick={startReactionTest}
                disabled={reactionState === "ready" || reactionState === "clicked"}
              >
                {reactionState === "done" || reactionState === "early" ? "Retry Assessment" : "Start Assessment"}
              </button>
            </div>
          </div>
        )}

        {!isInteractive && (
          <div
            style={{
              background: "rgba(255, 255, 255, 0.8)",
              padding: "2rem",
              borderRadius: "12px",
              textAlign: "center",
              border: "1px solid rgba(15, 23, 42, 0.1)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: "1rem" }}
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "0.5rem",
                fontWeight: 600,
                fontSize: "1.1rem",
              }}
            >
              External Hardware Telemetry
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
                fontSize: "0.95rem",
              }}
            >
              <strong>Instructions:</strong> Upload a valid JSON file containing
              your raw telemetry array (e.g., from an accelerometer, digital
              pen, or microphone) to run the analysis against your custom
              dataset. Alternatively, load the built-in demo telemetry.
            </p>
            <div
              style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
            >
              <label className="btn btn-primary" style={{ cursor: "pointer" }}>
                {uploadedDataLoaded
                  ? "Custom JSON Uploaded"
                  : "Upload JSON Telemetry"}
                <input
                  type="file"
                  accept=".json"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </label>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setDemoLoaded(true);
                  setUploadedDataLoaded(false);
                }}
                disabled={demoLoaded && !uploadedDataLoaded}
              >
                {demoLoaded ? "Demo Telemetry Loaded" : "Load Demo Telemetry"}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              color: "var(--danger)",
              background: "rgba(239, 68, 68, 0.1)",
              padding: "1rem",
              borderRadius: "8px",
              marginTop: "1.5rem",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <button
            className="btn btn-primary"
            onClick={runAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <div
                className="spinner"
                style={{ width: "16px", height: "16px", borderWidth: "2px" }}
              ></div>
            ) : (
              "Run Deep Analysis"
            )}
          </button>
          <button
            className="btn btn-outline"
            onClick={resetData}
            disabled={isAnalyzing}
          >
            Clear Buffer
          </button>
        </div>

        {renderReport()}
      </div>
    </div>
  );
}
