import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const mediaPipe = globalThis as typeof globalThis & {
  Pose?: new (options: { locateFile: (file: string) => string }) => any;
  Camera?: new (video: HTMLVideoElement, options: any) => any;
};

export default function RemoteCapture() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const audioRecorderRef = useRef<MediaRecorder | null>(null);
  const telemetryRef = useRef<any[]>([]);
  const [recording, setRecording] = useState(false);
  const [audioRecording, setAudioRecording] = useState(false);
  const [message, setMessage] = useState(
    "Ready to connect to the desktop assessment.",
  );

  useEffect(
    () => () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
      streamRef.current?.getTracks().forEach((track) => track.stop());
    },
    [],
  );

  const startCapture = async () => {
    if (!sessionId || !mediaPipe.Pose || !mediaPipe.Camera) {
      setMessage("This browser cannot start the remote camera capture.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      telemetryRef.current = [];
      poseRef.current = new mediaPipe.Pose({
        locateFile: (file) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
      });
      poseRef.current.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      poseRef.current.onResults((results: any) => {
        const left = results.poseLandmarks?.[27];
        const right = results.poseLandmarks?.[28];
        if (left && right) {
          telemetryRef.current.push({
            timestamp: Date.now(),
            leftAnkle: { x: left.x, y: left.y, z: left.z },
            rightAnkle: { x: right.x, y: right.y, z: right.z },
          });
        }
      });
      cameraRef.current = new mediaPipe.Camera(videoRef.current, {
        onFrame: async () => poseRef.current?.send({ image: videoRef.current }),
        width: 640,
        height: 480,
      });
      cameraRef.current.start();
      setRecording(true);
      setMessage(
        "Capturing from your phone. Keep moving for at least 4 seconds.",
      );
    } catch {
      setMessage("Camera and microphone permission was denied or unavailable.");
    }
  };

  const stopCapture = async () => {
    cameraRef.current?.stop();
    poseRef.current?.close();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setRecording(false);
    setMessage("Sending phone telemetry to the desktop...");
    await fetch(`/api/remote-sessions/${sessionId}/telemetry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ telemetry: telemetryRef.current }),
    });
    setMessage(`Telemetry sent: ${telemetryRef.current.length} pose frames.`);
  };

  const startAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (event) => chunks.push(event.data);
      recorder.onstop = async () => {
        const audio = new Blob(chunks, {
          type: recorder.mimeType || "audio/webm",
        });
        const form = new FormData();
        form.append("audio", audio, "phone-recording.webm");
        await fetch(`/api/remote-sessions/${sessionId}/audio`, {
          method: "POST",
          body: form,
        });
        stream.getTracks().forEach((track) => track.stop());
        setMessage("Phone audio transferred to the desktop.");
      };
      recorder.start();
      audioRecorderRef.current = recorder;
      setAudioRecording(true);
      setMessage("Recording phone audio...");
    } catch {
      setMessage("Microphone permission was denied or unavailable.");
    }
  };

  const stopAudio = () => {
    audioRecorderRef.current?.stop();
    audioRecorderRef.current = null;
    setAudioRecording(false);
  };

  return (
    <main className="remote-capture-page">
      <div className="remote-capture-card">
        <span className="section-kicker">NeuroSense remote capture</span>
        <h1>Use this phone as the sensor</h1>
        <p>{message}</p>
        <video ref={videoRef} muted playsInline className="remote-video" />
        <div className="remote-capture-actions">
          <button
            className="btn btn-primary"
            onClick={recording ? stopCapture : startCapture}
          >
            {recording ? "Send camera telemetry" : "Start phone camera"}
          </button>
          <button
            className="btn btn-outline"
            onClick={audioRecording ? stopAudio : startAudio}
          >
            {audioRecording ? "Send phone audio" : "Record phone audio"}
          </button>
        </div>
        <small>
          Keep this page open while the desktop assessment is running.
        </small>
      </div>
    </main>
  );
}
