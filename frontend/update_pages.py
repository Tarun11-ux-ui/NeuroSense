import os

history_path = r'd:\NeuroSense\frontend\src\pages\History.tsx'
assessment_path = r'd:\NeuroSense\frontend\src\pages\ComprehensiveAssessment.tsx'

history_code = """import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function History() {
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    // Mock data to match Figma exactly
    setPatientHistory([
      { id: "NS-2026-0906-001", date: "W1", fullDate: "September 6, 2026", score: 86, quality: 93, modalities: 5, baseline: "+1.0%", status: "High quality" },
      { id: "NS-2026-0913-001", date: "W2", fullDate: "September 13, 2026", score: 81, quality: 88, modalities: 5, baseline: "-5.0%", status: "Good quality" },
      { id: "NS-2026-0920-001", date: "W3", fullDate: "September 20, 2026", score: 83, quality: 90, modalities: 5, baseline: "+2.0%", status: "High quality" },
      { id: "NS-2026-0927-001", date: "W4", fullDate: "September 27, 2026", score: 78, quality: 91, modalities: 5, baseline: "-4.2%", status: "High quality" },
    ]);
  }, []);

  const filters = ["All", "Typing", "Mouse", "Spiral", "Voice", "Gait"];

  // Sort history descending for the list
  const sortedList = [...patientHistory].reverse();

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 500, color: "#0f172a", margin: "0 0 0.5rem 0", fontFamily: "'Inter', sans-serif" }}>
          Assessment History
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Longitudinal motor consistency trends and previous session records.
        </p>
      </div>

      <div className="module-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.5rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "#1e293b", margin: 0, fontFamily: "'Inter', sans-serif" }}>
            Motor Consistency Trend
          </h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {filters.map(f => (
              <button 
                key={f}
                onClick={() => setActiveFilter(f)}
                style={{
                  padding: "0.4rem 1.2rem",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: activeFilter === f ? "white" : "#64748b",
                  background: activeFilter === f ? "#8b5cf6" : "transparent",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ height: "300px", width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={patientHistory} margin={{ top: 10, right: 20, bottom: 5, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#94a3b8", fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: "0.85rem", paddingTop: "20px" }} />
              <Line name="Input Quality" type="monotone" dataKey="quality" stroke="#d946ef" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 4, fill: "#d946ef", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line name="Profile Score" type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", marginBottom: "1.25rem", fontFamily: "'Inter', sans-serif" }}>
        Sessions
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {sortedList.map((session) => (
          <div key={session.id} style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "1rem 1.5rem", 
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "1" }}>
              <div style={{ width: "36px", height: "36px", background: "rgba(139, 92, 246, 0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{session.id}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{session.fullDate}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "2.5rem", flex: "2", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>Profile</div>
                <div style={{ fontWeight: 600, color: "#8b5cf6", fontSize: "0.9rem" }}>{session.score} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}>/ 100</span></div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>Quality</div>
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{session.quality}%</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>Modalities</div>
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{session.modalities} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}>/ 5</span></div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>Baseline</div>
                <div style={{ fontWeight: 600, color: session.baseline.startsWith('-') ? "#8b5cf6" : "#1e293b", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  {session.baseline.startsWith('-') && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  )}
                  {session.baseline}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: "0.5", justifyContent: "flex-end" }}>
              <span style={{ 
                color: session.status === "High quality" ? "#10b981" : "#f59e0b", 
                fontSize: "0.8rem", 
                fontWeight: 600, 
              }}>
                {session.status}
              </span>
              <span style={{ color: "#94a3b8", fontWeight: 500, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem", cursor: "pointer" }}>
                View
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
"""

with open(history_path, 'w') as f:
    f.write(history_code)


assessment_code = """import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ComprehensiveAssessment() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = ["Typing", "Mouse", "Spiral", "Voice", "Gait"];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "#1e293b" }}>Typing Assessment</h3>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Analyze keystroke dynamics and rhythm patterns.</p>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>Pending</span>
              </div>
              
              <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "1rem", display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" style={{ flexShrink: 0, marginTop: "2px" }}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#334155", lineHeight: "1.4" }}>
                  Type the displayed passage naturally and continuously, without deliberate corrections.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.75rem", color: "#64748b", marginBottom: "1.5rem" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  Est. 60-90 seconds
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <div style={{ width: "4px", height: "4px", background: "#cbd5e1", borderRadius: "50%" }}></div>
                  Physical keyboard required
                </span>
              </div>

              <button 
                onClick={() => navigate("/module/keystroke")}
                style={{ background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: 500, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer", transition: "0.2s" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Start Typing Test
              </button>
            </div>

            <div style={{ background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "#64748b", maxWidth: "200px" }}>Quality results will appear here after the test.</p>
            </div>
          </div>
        );
      case 1:
        return (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginTop: "2rem" }}>
            <div style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect></svg>
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "#1e293b" }}>Mouse Tracking</h3>
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>Analyze cursor movement and precision.</p>
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>Pending</span>
              </div>
              <button 
                onClick={() => navigate("/module/mouse")}
                style={{ background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", padding: "0.75rem 1.5rem", fontSize: "0.9rem", fontWeight: 500, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer", transition: "0.2s" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                Start Mouse Test
              </button>
            </div>
          </div>
        );
      default:
        return <p>Select a module to continue.</p>;
    }
  };

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem", maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 500, color: "#0f172a", margin: "0 0 0.5rem 0", fontFamily: "'Inter', sans-serif" }}>
          Multimodal Assessment
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Complete the available motor assessments. You can repeat individual tests if input quality is insufficient.
        </p>
      </div>

      <div style={{ background: "#ffffff", padding: "2rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.03)" }}>
        
        {/* Stepper Header */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#64748b", fontWeight: 500, marginBottom: "1.5rem" }}>
          <span>{step} of 5 modalities completed</span>
          <span>{step * 20}%</span>
        </div>

        {/* Stepper Component */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", marginBottom: "1rem" }}>
          <div style={{ position: "absolute", top: "16px", left: "0", right: "0", height: "1px", background: "#e2e8f0", zIndex: 0 }}></div>
          
          {steps.map((label, index) => {
            const isActive = step === index;
            const isCompleted = index < step;
            return (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, gap: "0.75rem", background: "#ffffff", padding: "0 10px" }}>
                <div 
                  style={{ 
                    width: "32px", height: "32px", borderRadius: "50%", 
                    display: "flex", alignItems: "center", justifyContent: "center", 
                    fontSize: "0.85rem", fontWeight: 600,
                    background: isActive ? "#8b5cf6" : (isCompleted ? "#10b981" : "#ffffff"),
                    color: (isActive || isCompleted) ? "white" : "#94a3b8",
                    border: (isActive || isCompleted) ? "none" : "1px solid #cbd5e1"
                  }}
                >
                  {isCompleted ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg> : index + 1}
                </div>
                <span style={{ fontSize: "0.8rem", fontWeight: isActive ? 600 : 500, color: isActive ? "#8b5cf6" : "#64748b" }}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Render Active Step */}
        {renderStep()}

        {/* Footer Navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
          <button 
            disabled={step === 0} 
            onClick={() => setStep(step - 1)}
            style={{ background: "transparent", border: "none", color: step === 0 ? "#cbd5e1" : "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", cursor: step === 0 ? "default" : "pointer", fontSize: "0.85rem", fontWeight: 500 }}
          >
            &larr; Previous
          </button>
          <button 
            disabled={step === steps.length - 1} 
            onClick={() => setStep(step + 1)}
            style={{ background: "transparent", border: "none", color: step === steps.length - 1 ? "#cbd5e1" : "#64748b", display: "flex", alignItems: "center", gap: "0.5rem", cursor: step === steps.length - 1 ? "default" : "pointer", fontSize: "0.85rem", fontWeight: 500 }}
          >
            Next &rarr;
          </button>
        </div>

      </div>
    </div>
  );
}
"""

with open(assessment_path, 'w') as f:
    f.write(assessment_code)

print("Assessment and History updated successfully.")
