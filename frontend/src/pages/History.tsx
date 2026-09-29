import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../utils/i18n";
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
  const navigate = useNavigate();

  useEffect(() => {
    import("../utils/history").then(({ getAssessmentHistory }) => {
      const localHistory = getAssessmentHistory();
      
      // Mock data to match Figma exactly
      const mockHistory = [
        { id: "NS-2026-0906-001", date: "W1", fullDate: "September 6, 2026", score: 86, quality: 93, modalities: 5, baseline: "+1.0%", status: "High quality" },
        { id: "NS-2026-0913-001", date: "W2", fullDate: "September 13, 2026", score: 81, quality: 88, modalities: 5, baseline: "-5.0%", status: "Good quality" },
        { id: "NS-2026-0920-001", date: "W3", fullDate: "September 20, 2026", score: 83, quality: 90, modalities: 5, baseline: "+2.0%", status: "High quality" },
        { id: "NS-2026-0927-001", date: "W4", fullDate: "September 27, 2026", score: 78, quality: 91, modalities: 5, baseline: "-4.2%", status: "High quality" },
      ];

      setPatientHistory([...mockHistory, ...localHistory]);
    });
  }, []);

  const filters = ["All", "Sequential", "Typing", "Mouse", "Spiral", "Voice", "Gait"];

  // Sort history descending and filter
  const sortedList = [...patientHistory]
    .filter(session => {
      if (activeFilter === "All") return true;
      if (activeFilter === "Sequential" && session.sessionType === "sequential") return true;
      if (session.sessionType === "single" && session.moduleName && session.moduleName.toLowerCase().includes(activeFilter.toLowerCase())) return true;
      return false;
    })
    .reverse();

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
          {t("Assessment History")}
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>
          {t("Longitudinal motor consistency trends and previous session records.")}
        </p>
      </div>

      <div className="module-card" style={{ padding: "1.5rem 2rem", marginBottom: "2.5rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 500, color: "#1e293b", margin: 0, fontFamily: "'Inter', sans-serif" }}>
            {t("Motor Consistency Trend")}
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
                {t(f)}
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
              <Line name={t("Input Quality")} type="monotone" dataKey="quality" stroke="#d946ef" strokeWidth={1.5} strokeDasharray="4 4" dot={{ r: 4, fill: "#d946ef", strokeWidth: 0 }} activeDot={{ r: 6 }} />
              <Line name={t("Profile Score")} type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={1.5} dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 0 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", marginBottom: "1.25rem", fontFamily: "'Inter', sans-serif" }}>
        {t("Sessions")}
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
                <div style={{ fontSize: "0.75rem", color: "#8b5cf6", fontWeight: 600, marginBottom: "0.15rem", textTransform: "uppercase" }}>
                  {session.sessionType === "single" 
                    ? (session.moduleName ? session.moduleName.charAt(0).toUpperCase() + session.moduleName.slice(1) + " Assessment" : "Single Assessment") 
                    : session.sessionType === "sequential" ? "Sequential Assessment" : "Assessment"}
                </div>
                <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b" }}>{session.id}</div>
                <div style={{ fontSize: "0.8rem", color: "#64748b" }}>{session.fullDate}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "2.5rem", flex: "2", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>{t("Profile")}</div>
                <div style={{ fontWeight: 600, color: "#8b5cf6", fontSize: "0.9rem" }}>{session.score} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}>/ 100</span></div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>{t("Quality")}</div>
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{session.quality}%</div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>{t("Modalities")}</div>
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{session.modalities} <span style={{ color: "#94a3b8", fontWeight: 400, fontSize: "0.8rem" }}>/ 5</span></div>
              </div>
              <div>
                <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.15rem" }}>{t("Baseline")}</div>
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
                {t(session.status)}
              </span>
              <button type="button" onClick={() => navigate(`/reports?report=${session.id}`)} style={{ color: "#64748b", fontWeight: 600, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.35rem", cursor: "pointer", border: "none", background: "transparent", padding: "0.45rem", borderRadius: "8px" }}>
                {t("View")}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
