import { useState } from "react";
import ModuleCapture from "./ModuleCapture";
import { t } from "../utils/i18n";

export default function ComprehensiveAssessment() {
  const [activeModule, setActiveModule] = useState<string | null>(null);

  const stepConfig = [
    { id: "keystroke", title: t("Typing Test"), desc: t("Analyze keystroke dynamics and rhythm patterns."), time: t("Est. 60-90 seconds"), req: t("Physical keyboard required"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, btnText: t("Start Typing Test"), instruction: t("Type the displayed passage naturally and continuously, without deliberate corrections.") },
    { id: "mouse_dfl", title: t("Mouse (DFL)"), desc: t("Analyze cursor movement and precision."), time: t("Est. 45-60 seconds"), req: t("Standard mouse or trackpad"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>, btnText: t("Start Mouse Test"), instruction: t("Follow the targets on screen as quickly and accurately as possible.") },
    { id: "mouse_balabit", title: t("Mouse (Balabit)"), desc: t("Analyze point-and-click rapid interactions."), time: t("Est. 30-45 seconds"), req: t("Standard mouse or trackpad"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>, btnText: t("Start Balabit Test"), instruction: t("Click rapidly between the generated on-screen targets.") },
    { id: "spiral", title: t("Spiral Test"), desc: t("Analyze hand tremors through drawing tasks."), time: t("Est. 30-60 seconds"), req: t("Mouse, stylus or touchscreen"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z"></path><path d="M12 18a6 6 0 110-12 6 6 0 010 12zm0-2a4 4 0 100-8 4 4 0 000 8z"></path></svg>, btnText: t("Start Spiral Test"), instruction: t("Draw the spiral shown on screen, trying to stay within the lines.") },
    { id: "voice", title: t("Voice Test"), desc: t("Assess phonation and speech stability."), time: t("Est. 20-40 seconds"), req: t("Microphone required"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>, btnText: t("Start Voice Test"), instruction: t("Read the displayed sentence out loud clearly at a normal pace.") },
    { id: "gait", title: t("Gait Test"), desc: t("Evaluate balance and walking rhythm."), time: t("Est. 1-2 minutes"), req: t("Camera and clear space required"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 16v-2.38C4 11.5 5.28 10 7 10h1a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h1.33c1.72 0 3.23 1.09 3.82 2.7l1.55 4.14"></path><path d="M13 14l-2 3"></path><path d="M16 16l2-3"></path></svg>, btnText: t("Start Gait Test"), instruction: t("Ensure your full body is visible to the camera, walk straight away, then turn around and walk back.") },
    { id: "facial", title: t("Facial Test"), desc: t("Analyze micro-expressions and blink rates."), time: t("Est. 30-45 seconds"), req: t("Camera required"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>, btnText: t("Start Facial Test"), instruction: t("Look into the camera and follow the reading prompt.") },
    { id: "reaction", title: t("Reaction Test"), desc: t("Measure cognitive and motor reaction delay."), time: t("Est. 30-60 seconds"), req: t("Mouse or touchscreen"), icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>, btnText: t("Start Reaction Test"), instruction: t("Click or tap the screen exactly when the color changes.") }
  ];

  if (activeModule) {
    return <ModuleCapture moduleIdProp={activeModule} onBack={() => setActiveModule(null)} />;
  }

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem", width: "100%" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
          {t("Multimodal Assessment")}
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>
          {t("Select and complete any of the available clinical motor assessments below.")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {stepConfig.map((config) => (
          <div key={config.id} className="module-card" style={{ background: "#ffffff", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--panel-border)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <div style={{ background: "rgba(139, 92, 246, 0.1)", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                  {config.icon}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 600, color: "var(--text-main)" }}>{config.title}</h3>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "var(--text-muted)" }}>{config.time}</p>
                </div>
              </div>
              
              <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
                {config.desc}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem", background: "var(--bg-main)", padding: "0.5rem 0.75rem", borderRadius: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {config.req}
              </div>
            </div>

            <button 
              onClick={() => setActiveModule(config.id)}
              className="btn btn-primary"
              style={{ width: "100%" }}
            >
              {config.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
