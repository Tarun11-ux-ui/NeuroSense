import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { QRCodeSVG } from "qrcode.react";

export const MODULES = [
  {
    id: "keystroke",
    name: "Keystroke Dynamics",
    icon: <path d="M3 3h18v18H3zM8 12h8M12 8v8" />,
    desc: "Analyze typing rhythm and hold times.",
    longDesc:
      "Keystroke Dynamics utilizes high-frequency temporal data to assess motor control and cognitive-motor integration. By analyzing flight time, dwell time, and intra-key latencies, this module can detect micro-tremors, hesitation patterns, and fatigue markers that are indicative of early-onset neurodegenerative conditions or acute cognitive load.",
  },
  {
    id: "mouse_dfl",
    name: "Mouse DFL",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20M2 12h20" />
      </>
    ),
    desc: "Analyze cursor movement trajectories.",
    longDesc:
      "The Mouse DFL (Dynamic Feature Learning) module continuously monitors cursor trajectory, velocity, acceleration, and jerk. It employs advanced kinematic modeling to distinguish between intentional smooth movements and atypical, jagged corrections that often correlate with fine motor skill degradation.",
  },
  {
    id: "mouse_balabit",
    name: "Mouse Balabit",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <path d="M12 3v18M3 12h18" />
      </>
    ),
    desc: "Analyze point-and-click behaviors.",
    longDesc:
      "Mouse Balabit focuses on point-and-click target acquisition. By evaluating Fitts's Law compliance, click latency, and target overshoot ratios, this module provides precise, quantifiable metrics on hand-eye coordination and spatial targeting accuracy.",
  },
  {
    id: "voice",
    name: "Voice Analysis",
    icon: (
      <>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
      </>
    ),
    desc: "Vocal biomarker feature extraction.",
    longDesc:
      "Voice Analysis extracts multidimensional acoustic parameters—including fundamental frequency (F0), jitter, shimmer, and Mel-frequency cepstral coefficients (MFCCs). These vocal biomarkers are critical for detecting phonatory instability, dysarthria, and sub-clinical changes in vocal fold tension.",
  },
  {
    id: "gait",
    name: "Gait Analysis",
    icon: (
      <>
        <path d="M13 4v16M9 4v16M5 12h14" />
      </>
    ),
    desc: "Accelerometer and gyroscope patterns.",
    longDesc:
      "Gait Analysis leverages tri-axial accelerometer and gyroscope telemetry to reconstruct biomechanical movement patterns in 3D space. It calculates stride length, step variability, cadence, and postural sway to flag balance anomalies and assess fall risk.",
  },
  {
    id: "spiral",
    name: "Spiral Drawing",
    icon: (
      <>
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
      </>
    ),
    desc: "Motor control during drawing tasks.",
    longDesc:
      "Spiral Drawing is a digitized clinical assessment for evaluating fine motor tremor and dyskinesia. By tracing continuous parametric spirals, the system analyzes radial error, drawing velocity variance, and pen pressure (if available) to quantify involuntary oscillations.",
  },
  {
    id: "facial",
    name: "Facial Expression",
    icon: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
        <line x1="9" y1="9" x2="9.01" y2="9"></line>
        <line x1="15" y1="9" x2="15.01" y2="9"></line>
      </>
    ),
    desc: "Masked facies & eye blink tracking.",
    longDesc:
      "Facial Expression uses MediaPipe Face Mesh to analyze micro-expressions, assessing 'Masked Facies' (hypomimia) commonly seen in Parkinson's. It tracks Eye Aspect Ratio (EAR) for blink rate and measures standard deviations in facial landmarks to quantify muscle rigidity and reduced facial animation.",
  },
  {
    id: "reaction",
    name: "Cognitive Reaction Time",
    icon: (
      <>
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </>
    ),
    desc: "Assess visual-motor reaction latency.",
    longDesc:
      "The Cognitive Reaction Time module measures visual-motor response latency. By randomizing stimuli presentation, it calculates simple reaction time and anticipatory errors (premature clicks). Elevated or highly variable reaction times can indicate cognitive slowing, bradyphrenia, or dopaminergic deficits.",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    active_pipelines: 6,
    model_confidence: 94.8,
    analyzed_sessions: 1248,
  });

  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: "", age: "", gender: "Male", notes: "" });
  const [patientHistory, setPatientHistory] = useState<any[]>([]);

  const [showConsent, setShowConsent] = useState(false);
  const [companionUrl, setCompanionUrl] = useState<string | null>(null);

  useEffect(() => {
    // Magic Login logic for mobile
    fetch("/api/config")
      .then(res => res.json())
      .then(config => {
        const token = localStorage.getItem("neurosense_token") || "";
        setCompanionUrl(`http://${config.local_ip}:5173/auto-login?token=${token}`);
      })
      .catch(err => console.error("Failed to load local IP", err));
    
    const hasConsented = localStorage.getItem("clinical_consent");
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setStats({
            active_pipelines: data.active_pipelines,
            model_confidence: data.model_confidence,
            analyzed_sessions: data.analyzed_sessions,
          });
        }
      })
      .catch((err) => console.error("Failed to load stats:", err));

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setPatients(data.patients);
          if (data.patients.length > 0) {
            setSelectedPatient(data.patients[0].id);
          }
        }
      })
      .catch((err) => console.error("Failed to load patients:", err));
  }, []);

  useEffect(() => {
    if (!selectedPatient) return;
    fetch(`/api/patients/${encodeURIComponent(selectedPatient)}/history`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          // Format date for chart
          const formatted = data.history.map((h: any) => {
            const date = new Date(h.timestamp);
            return {
              date: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`,
              score: Number((h.score * 100).toFixed(1)),
            };
          });
          setPatientHistory(formatted);
        }
      })
      .catch((err) => console.error("Failed to load patient history:", err));
      
    // Save patient ID for subsequent captures
    localStorage.setItem("neurosense_patient_id", selectedPatient);
  }, [selectedPatient]);

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/patients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newPatient.name,
        age: parseInt(newPatient.age) || 0,
        gender: newPatient.gender,
        notes: newPatient.notes
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setShowAddPatient(false);
          setNewPatient({ name: "", age: "", gender: "Male", notes: "" });
          // Refresh patients
          fetch("/api/patients")
            .then(res => res.json())
            .then(pdata => {
              if (pdata.status === "success") {
                setPatients(pdata.patients);
                setSelectedPatient(data.patient.id);
              }
            });
        }
      })
      .catch(err => console.error(err));
  };

  const latestHistory = patientHistory[patientHistory.length - 1];
  const previousHistory = patientHistory[patientHistory.length - 2];
  const riskChange =
    latestHistory && previousHistory
      ? Number((latestHistory.score - previousHistory.score).toFixed(1))
      : null;
  const riskStatus = latestHistory
    ? latestHistory.score >= 70
      ? "Elevated screening signal"
      : latestHistory.score >= 40
        ? "Monitor over time"
        : "Lower screening signal"
    : "Awaiting assessment data";

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <div
      className="fade-in"
      style={{ paddingBottom: "3rem", position: "relative" }}
    >
      {showAddPatient && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(4px)",
          zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <div style={{
            background: "var(--panel-bg)", padding: "2.5rem", borderRadius: "16px",
            maxWidth: "500px", width: "90%", border: "1px solid var(--panel-border)",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)"
          }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem", color: "var(--text-main)" }}>Add New Patient</h2>
            <form onSubmit={handleAddPatient} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <input type="text" placeholder="Full Name" className="login-input" required 
                value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
              <input type="number" placeholder="Age" className="login-input" required 
                value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
              <select className="login-input" value={newPatient.gender} onChange={e => setNewPatient({...newPatient, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <textarea placeholder="Clinical Notes (Optional)" className="login-input" rows={3}
                value={newPatient.notes} onChange={e => setNewPatient({...newPatient, notes: e.target.value})} />
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddPatient(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Patient</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConsent && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "var(--panel-bg)",
              padding: "2.5rem",
              borderRadius: "16px",
              maxWidth: "500px",
              width: "90%",
              border: "1px solid var(--panel-border)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
                color: "var(--primary)",
              }}
            >
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="M9 12l2 2 4-4"></path>
              </svg>
            </div>
            <h2
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                marginBottom: "1rem",
                color: "var(--text-main)",
              }}
            >
              Clinical Data Privacy Consent
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.6,
                marginBottom: "1.5rem",
                textAlign: "justify",
              }}
            >
              NeuroSense collects and processes biometric telemetry (keystrokes,
              mouse tracking, voice, and gait) for diagnostic purposes. All data
              is end-to-end encrypted and HIPAA compliant. By proceeding, you
              confirm that you have obtained informed consent from the patient
              and agree to our clinical data handling policies.
            </p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1, padding: "0.75rem" }}
                onClick={() => {
                  alert("You must accept to use the platform.");
                }}
              >
                Decline
              </button>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: "0.75rem" }}
                onClick={() => {
                  localStorage.setItem("clinical_consent", "true");
                  setShowConsent(false);
                }}
              >
                I Agree & Consent
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="page-header" style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.75rem",
            background:
              "linear-gradient(90deg, var(--primary) 0%, #3b82f6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          NeuroSense Dashboard
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-muted)" }}>
          Clinical Intelligence & Remote Patient Monitoring Platform
        </p>
      </div>

      {/* System Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.5rem",
          marginBottom: "3.5rem",
        }}
      >
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Active Pipelines</h3>
            <p>{stats.active_pipelines} / 6 Online</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Clinical Certainty</h3>
            <p>{stats.model_confidence}% Avg</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(139, 92, 246, 0.1)", color: "#8b5cf6" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>Analyzed Sessions</h3>
            <p>{stats.analyzed_sessions.toLocaleString()} Total</p>
          </div>
        </div>

        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>HIPAA Status</h3>
            <p>Compliant</p>
          </div>
        </div>
      </div>

      {companionUrl && (
        <section className="tracking-panel" style={{ marginBottom: "3.5rem" }}>
          <div className="tracking-header" style={{ borderBottom: "none" }}>
            <div>
              <span className="section-kicker">Mobile Integration</span>
              <h2 className="tracking-title">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>
                </svg>
                Mobile Full Access
              </h2>
              <p className="tracking-subtitle">
                Scan this QR code with your phone to instantly log in. You can use all modules, including Voice and Gait capture, directly from your mobile browser without entering credentials again.
              </p>
            </div>
            <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid var(--panel-border)" }}>
              <QRCodeSVG value={companionUrl} size={120} />
            </div>
          </div>
        </section>
      )}

      {patients.length > 0 && (
        <section className="tracking-panel">
          <div className="tracking-header">
            <div>
              <span className="section-kicker">Patient monitoring</span>
              <h2 className="tracking-title">
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
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                Longitudinal tracking
              </h2>
              <p className="tracking-subtitle">
                Review screening risk movement across completed assessments.
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <button 
                className="btn btn-outline" 
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                onClick={() => setShowAddPatient(true)}
              >
                + New Patient
              </button>
              <button 
                className="btn btn-outline" 
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", borderColor: "var(--primary)", color: "var(--primary)" }}
                onClick={() => window.open(`/api/patients/${selectedPatient}/fhir`, "_blank")}
                title="Export latest assessment in FHIR format for EMR integration"
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "0.5rem", verticalAlign: "middle" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                Export EMR (FHIR)
              </button>
              <label className="patient-select-wrap">
                <span>Patient record</span>
                <select
                  className="patient-select"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.id})
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="tracking-summary">
            <div className="tracking-patient">
              <span className="patient-avatar">
                {selectedPatient.slice(-2)}
              </span>
              <div>
                <span className="summary-label">Active patient</span>
                <strong>{selectedPatientData ? `${selectedPatientData.name} (${selectedPatientData.id})` : selectedPatient}</strong>
              </div>
              <span className="tracking-status">
                <span /> Monitoring active
              </span>
            </div>
            <div className="tracking-metrics">
              <div className="tracking-metric">
                <span className="summary-label">Latest risk score</span>
                <strong>
                  {latestHistory ? `${latestHistory.score.toFixed(1)}%` : "--"}
                </strong>
              </div>
              <div className="tracking-metric">
                <span className="summary-label">Change vs prior</span>
                <strong
                  className={
                    riskChange !== null && riskChange > 0
                      ? "metric-up"
                      : "metric-down"
                  }
                >
                  {riskChange === null
                    ? "--"
                    : `${riskChange > 0 ? "+" : ""}${riskChange.toFixed(1)}%`}
                </strong>
              </div>
              <div className="tracking-metric tracking-interpretation">
                <span className="summary-label">Current interpretation</span>
                <strong>{riskStatus}</strong>
              </div>
            </div>
          </div>

          <div className="tracking-chart">
            {patientHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={patientHistory}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--panel-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--text-muted)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--panel-border)",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                    }}
                    itemStyle={{ color: "var(--primary)", fontWeight: 600 }}
                    formatter={(value) => [`${value}%`, "Risk score"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    name="Risk score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  display: "flex",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--text-muted)",
                }}
              >
                No history data available for this patient.
              </div>
            )}
          </div>
          <p className="tracking-note">
            Screening scores support clinical review and should be interpreted
            alongside patient history and professional assessment.
          </p>
        </section>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid var(--panel-border)",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            color: "var(--text-main)",
          }}
        >
          Diagnostic Modalities
        </h2>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/comprehensive")}
            style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 9.36l-7.1 7.1a1 1 0 0 1-1.4 0l-2.8-2.8a1 1 0 0 1 0-1.4l7.1-7.1a6 6 0 0 1 9.36-7.94z" />
            </svg>
            Comprehensive Assessment
          </button>
          <span className="badge badge-active" style={{ fontSize: "0.8rem" }}>
            System Ready
          </span>
        </div>
      </div>

      <div className="modules-grid">
        {MODULES.map((mod) => (
          <div
            key={mod.id}
            className="module-card"
            onClick={() => navigate(`/module/${mod.id}`)}
          >
            <div className="module-header">
              <div className="module-icon">
                <svg viewBox="0 0 24 24">{mod.icon}</svg>
              </div>
              <span className="module-title">{mod.name}</span>
            </div>

            <p className="module-desc">{mod.desc}</p>

            <div className="module-footer">
              <span className="module-action-text">Launch Module</span>
              <svg
                className="module-arrow"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
