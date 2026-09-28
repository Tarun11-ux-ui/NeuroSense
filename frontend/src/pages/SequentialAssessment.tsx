import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCapture from "./ModuleCapture";

export default function SequentialAssessment() {
  const navigate = useNavigate();
  // -1: Welcome/Start screen
  // 0 to length - 1: Module testing
  // length: Final cumulative score
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [results, setResults] = useState<any[]>([]);

  const stepConfig = [
    { id: "keystroke", title: "Typing Assessment", desc: "Analyze keystroke dynamics and rhythm patterns.", time: "Est. 60-90 seconds", req: "Physical keyboard required", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, btnText: "Start Typing Test", instruction: "Type the displayed passage naturally and continuously, without deliberate corrections." },
    { id: "mouse_dfl", title: "Mouse Tracking (DFL)", desc: "Analyze cursor movement and precision.", time: "Est. 45-60 seconds", req: "Standard mouse or trackpad", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>, btnText: "Start Mouse Test", instruction: "Follow the targets on screen as quickly and accurately as possible." },
    { id: "mouse_balabit", title: "Mouse Tracking (Balabit)", desc: "Analyze point-and-click rapid interactions.", time: "Est. 30-45 seconds", req: "Standard mouse or trackpad", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>, btnText: "Start Balabit Test", instruction: "Click rapidly between the generated on-screen targets." },
    { id: "spiral", title: "Spiral Drawing", desc: "Analyze hand tremors through drawing tasks.", time: "Est. 30-60 seconds", req: "Mouse, stylus or touchscreen", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"></path><path d="M12 18a6 6 0 110-12 6 6 0 010 12zm0-2a4 4 0 100-8 4 4 0 000 8z"></path></svg>, btnText: "Start Spiral Test", instruction: "Draw the spiral shown on screen, trying to stay within the lines." },
    { id: "voice", title: "Voice Analysis", desc: "Assess phonation and speech stability.", time: "Est. 20-40 seconds", req: "Microphone required", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>, btnText: "Start Voice Test", instruction: "Read the displayed sentence out loud clearly at a normal pace." },
    { id: "gait", title: "Gait Evaluation", desc: "Evaluate balance and walking rhythm.", time: "Est. 1-2 minutes", req: "Camera and clear space required", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v-2.38C4 11.5 5.28 10 7 10h1a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h1.33c1.72 0 3.23 1.09 3.82 2.7l1.55 4.14"></path><path d="M13 14l-2 3"></path><path d="M16 16l2-3"></path></svg>, btnText: "Start Gait Test", instruction: "Ensure your full body is visible to the camera, walk straight away, then turn around and walk back." },
    { id: "facial", title: "Facial Expression", desc: "Analyze micro-expressions and blink rates.", time: "Est. 30-45 seconds", req: "Camera required", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>, btnText: "Start Facial Test", instruction: "Look into the camera and follow the reading prompt." },
    { id: "reaction", title: "Reaction Time", desc: "Measure cognitive and motor reaction delay.", time: "Est. 30-60 seconds", req: "Mouse or touchscreen", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, btnText: "Start Reaction Test", instruction: "Click or tap the screen exactly when the color changes." }
  ];

  const handleNext = (result: any) => {
    setResults((prev) => [...prev, { moduleId: stepConfig[currentIndex].id, result }]);
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= 0 && currentIndex < stepConfig.length) {
    const activeModule = stepConfig[currentIndex].id;
    return (
      <div className="fade-in">
        <div style={{ background: "#ffffff", padding: "1.5rem 2.5rem", borderBottom: "1px solid var(--panel-border)", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
              {stepConfig[currentIndex].icon}
            </div>
            <div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.25rem" }}>
                Module {currentIndex + 1} of {stepConfig.length}
              </div>
              <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "var(--text-main)" }}>
                {stepConfig[currentIndex].title}
              </h2>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {stepConfig.map((_, i) => (
                <div 
                  key={i} 
                  style={{ 
                    width: "36px", height: "6px", borderRadius: "3px", 
                    background: i < currentIndex ? "#10b981" : (i === currentIndex ? "var(--primary)" : "var(--panel-border)"),
                    transition: "all 0.3s ease"
                  }}
                />
              ))}
            </div>
            <button 
              className="btn"
              onClick={() => setCurrentIndex(-1)}
              style={{ padding: "0.5rem 1rem", fontSize: "0.9rem", color: "var(--text-muted)", border: "1px solid var(--panel-border)", background: "transparent" }}
            >
              Exit Sequence
            </button>
          </div>
        </div>
        <div style={{ height: "calc(100vh - 120px)", overflow: "auto", background: "var(--bg-main)" }}>
          <ModuleCapture 
            moduleIdProp={activeModule} 
            onBack={() => setCurrentIndex(-1)} 
            onNext={handleNext}
          />
        </div>
      </div>
    );
  }

  if (currentIndex === stepConfig.length) {
    const getCumulativeScore = () => 85; // Mock score

    return (
      <div className="fade-in" style={{ paddingBottom: "3rem", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ width: "100px", height: "100px", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "0 0 40px rgba(16, 185, 129, 0.2)" }}>
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--text-main)", margin: "0 0 1rem 0", letterSpacing: "-1px" }}>
            Assessment Complete
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "0 auto", fontSize: "1.2rem", maxWidth: "600px", lineHeight: 1.6 }}>
            You have successfully completed all 8 motor and behavioral modules. Your data has been securely processed and aggregated.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
          {/* Score Card */}
          <div className="module-card" style={{ padding: "3rem", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)", border: "1px solid rgba(139, 92, 246, 0.2)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-50px", right: "-50px", width: "200px", height: "200px", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%" }}></div>
            <h3 style={{ fontSize: "1.1rem", color: "var(--primary)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "1.5rem", fontWeight: 700 }}>
              Composite Motor Score
            </h3>
            <div style={{ position: "relative", width: "220px", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", background: "conic-gradient(var(--primary) 85%, var(--panel-border) 85%)", boxShadow: "0 10px 30px rgba(139, 92, 246, 0.15)" }}>
              <div style={{ width: "190px", height: "190px", background: "white", borderRadius: "50%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "4.5rem", fontWeight: 800, color: "var(--text-main)", lineHeight: 1 }}>{getCumulativeScore()}</span>
                <span style={{ fontSize: "1.2rem", color: "var(--text-muted)", fontWeight: 500, marginTop: "0.25rem" }}>/ 100</span>
              </div>
            </div>
            <p style={{ color: "var(--text-main)", fontSize: "1.05rem", textAlign: "center", marginTop: "2.5rem", lineHeight: 1.6, maxWidth: "350px" }}>
              Your overall behavioral consistency is <strong style={{ color: "#10b981" }}>excellent</strong>. No significant anomalies were detected across the multiple modalities.
            </p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate("/dashboard")}
              style={{ padding: "1rem 2.5rem", fontSize: "1.1rem", marginTop: "2rem", width: "100%" }}
            >
              Return to Dashboard
            </button>
          </div>

          {/* Module Breakdown */}
          <div className="module-card" style={{ padding: "2.5rem", background: "#ffffff" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-main)", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Module Breakdown
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {stepConfig.map((config, i) => {
                const isCompleted = results.some(r => r.moduleId === config.id);
                return (
                  <div key={config.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", borderRadius: "10px", background: isCompleted ? "rgba(16, 185, 129, 0.05)" : "var(--bg-main)", border: `1px solid ${isCompleted ? "rgba(16, 185, 129, 0.2)" : "var(--panel-border)"}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <div style={{ color: isCompleted ? "#10b981" : "var(--text-muted)" }}>
                        {config.icon}
                      </div>
                      <div style={{ fontWeight: 500, color: isCompleted ? "var(--text-main)" : "var(--text-muted)" }}>
                        {config.title}
                      </div>
                    </div>
                    {isCompleted ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981", fontSize: "0.85rem", fontWeight: 600 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Completed
                      </div>
                    ) : (
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Skipped</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Welcome Screen (currentIndex === -1)
  return (
    <div className="fade-in" style={{ paddingBottom: "3rem", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.5rem" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            Sequential Mode
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.5rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
            Comprehensive Motor Sequence
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1.1rem", maxWidth: "700px", lineHeight: 1.6 }}>
            Complete the full suite of motor and behavioral assessments sequentially. This unified approach provides a holistic evaluation of your baseline behavioral consistency and produces a comprehensive aggregate score.
          </p>
        </div>
        <button 
          onClick={() => setCurrentIndex(0)}
          className="btn btn-primary"
          style={{ padding: "1rem 2rem", fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)" }}
        >
          Begin Sequence
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </button>
      </div>

      <div style={{ background: "linear-gradient(145deg, #ffffff, #f8fafc)", padding: "3rem", borderRadius: "20px", border: "1px solid var(--panel-border)", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
        <h3 style={{ margin: "0 0 2rem 0", fontSize: "1.25rem", fontWeight: 600, color: "var(--text-main)" }}>
          Sequence Overview (8 Modules)
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
          {stepConfig.map((config, index) => (
            <div key={config.id} style={{ display: "flex", alignItems: "flex-start", gap: "1.25rem", padding: "1.5rem", background: "white", borderRadius: "12px", border: "1px solid rgba(15, 23, 42, 0.05)", boxShadow: "0 2px 8px rgba(0,0,0,0.02)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "4rem", fontWeight: 900, color: "var(--bg-main)", opacity: 0.5, zIndex: 0, pointerEvents: "none" }}>
                {index + 1}
              </div>
              <div style={{ background: "rgba(139, 92, 246, 0.08)", minWidth: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid rgba(139, 92, 246, 0.1)", zIndex: 1 }}>
                {config.icon}
              </div>
              <div style={{ zIndex: 1 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.25rem" }}>
                  Step {index + 1}
                </div>
                <div style={{ fontWeight: 600, color: "var(--text-main)", fontSize: "1.05rem", marginBottom: "0.25rem" }}>
                  {config.title}
                </div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  {config.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
