import { useNavigate } from "react-router-dom";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const MODULES = [
  { 
    id: "keystroke", 
    name: "Typing", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><line x1="6" y1="8" x2="6.01" y2="8"></line><line x1="10" y1="8" x2="10.01" y2="8"></line><line x1="14" y1="8" x2="14.01" y2="8"></line><line x1="18" y1="8" x2="18.01" y2="8"></line><line x1="6" y1="12" x2="6.01" y2="12"></line><line x1="10" y1="12" x2="10.01" y2="12"></line><line x1="14" y1="12" x2="14.01" y2="12"></line><line x1="18" y1="12" x2="18.01" y2="12"></line><line x1="8" y1="16" x2="16" y2="16"></line></svg>, 
    longDesc: "Analyze keystroke dynamics, typing rhythm, and flight times to detect early signs of motor impairment." 
  },
  { 
    id: "mouse_dfl", 
    name: "Mouse", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>, 
    longDesc: "Evaluate cursor kinematics and fine motor control." 
  },
  { 
    id: "spiral", 
    name: "Spiral", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"></path><path d="M12 18a6 6 0 110-12 6 6 0 010 12zm0-2a4 4 0 100-8 4 4 0 000 8z"></path></svg>, 
    longDesc: "Analyze hand tremors and fine motor coordination through spiral drawing tasks." 
  },
  { 
    id: "voice", 
    name: "Voice", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>, 
    longDesc: "Assess phonation, articulation, and voice stability for speech motor symptoms." 
  },
  { 
    id: "gait", 
    name: "Gait", 
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v-2.38C4 11.5 5.28 10 7 10h1a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h1.33c1.72 0 3.23 1.09 3.82 2.7l1.55 4.14"></path><path d="M13 14l-2 3"></path><path d="M16 16l2-3"></path></svg>, 
    longDesc: "Evaluate balance, stride length, and walking rhythm using video pose estimation." 
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const radarData = [
    { subject: "Typing", current: 85, previous: 90 },
    { subject: "Mouse", current: 75, previous: 80 },
    { subject: "Spiral", current: 80, previous: 75 },
    { subject: "Voice", current: 70, previous: 75 },
    { subject: "Gait", current: 82, previous: 85 },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem", display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Header Section */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ color: "var(--text-main)", fontSize: "2.5rem", fontWeight: 700, margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
            Motor Consistency Overview
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>
            Track your current assessment, personal baseline, and longitudinal trends.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            className="btn" 
            onClick={() => navigate("/sequential")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem", background: "var(--bg-main)", color: "var(--primary)", border: "1px solid var(--primary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Sequential Mode
          </button>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate("/assessment")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", fontSize: "1rem" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            Start Assessment
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
        <div className="module-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Motor Consistency Profile
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "var(--primary)", lineHeight: 1 }}>
              78 <span style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}>/ 100</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Prototype behavioral score
            </div>
          </div>
        </div>

        <div className="module-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Assessment Quality
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "#10b981", lineHeight: 1 }}>
              91%
            </div>
            <div style={{ color: "#10b981", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 500 }}>
              High-quality assessment
            </div>
          </div>
        </div>

        <div className="module-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Baseline Change
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "var(--primary)", lineHeight: 1 }}>
              -4.2%
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              Compared with previous session
            </div>
          </div>
        </div>

        <div className="module-card" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "1rem" }}>
            Completed Modalities
          </div>
          <div>
            <div style={{ fontSize: "2.5rem", fontWeight: 300, color: "var(--primary)", lineHeight: 1 }}>
              5 <span style={{ fontSize: "1.25rem", color: "var(--text-muted)" }}>/ 5</span>
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.5rem" }}>
              All modalities assessed
            </div>
          </div>
        </div>
      </div>

      {/* Main Panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "1.5rem" }}>
        
        {/* Radar Chart Panel */}
        <div className="module-card" style={{ padding: "1.5rem 2rem", display: "flex", flexDirection: "column" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", margin: "0 0 0.25rem 0" }}>Motor Profile Visualization</h3>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>Current session vs. previous session</p>
          </div>
          <div style={{ flex: 1, minHeight: "350px", width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--panel-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Radar name="Current Session" dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                <Radar name="Previous Session" dataKey="previous" stroke="#d946ef" fill="#d946ef" fillOpacity={0.0} strokeDasharray="5 5" />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "0.85rem", paddingTop: "20px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Baseline Panel */}
        <div className="module-card" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-main)", margin: "0 0 0.5rem 0" }}>Personal Baseline</h3>
          <p style={{ color: "var(--text-muted)", margin: "0 0 2rem 0", fontSize: "0.9rem", lineHeight: 1.5 }}>
            Your current motor profile compared with your previous assessment.
          </p>
          
          <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 500 }}>Current profile</span>
            <span style={{ fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 600 }}>78 / 100</span>
          </div>
          
          <div style={{ width: "100%", height: "8px", background: "var(--panel-border)", borderRadius: "4px", marginBottom: "2rem", overflow: "hidden" }}>
            <div style={{ width: "78%", height: "100%", background: "var(--primary)", borderRadius: "4px" }}></div>
          </div>

          <div style={{ background: "rgba(15, 23, 42, 0.03)", border: "1px solid var(--panel-border)", borderRadius: "8px", padding: "1.25rem", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.95rem" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              -4.2% baseline deviation
            </div>
            <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginLeft: "1.8rem" }}>
              Based on 3 previous sessions
            </div>
          </div>

          <button 
            className="btn btn-outline" 
            onClick={() => navigate("/history")}
            style={{ width: "100%", padding: "0.85rem", marginTop: "auto", fontSize: "0.95rem" }}
          >
            View history
          </button>
        </div>

      </div>
    </div>
  );
}
