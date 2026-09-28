export default function Research() {
  const registry = [
    { mod: "Typing", name: "Logistic Regression", ver: "1.0", task: "Keystroke dynamics behavioral consistency", inf: 18, color: "var(--primary)", bg: "rgba(139, 92, 246, 0.1)" },
    { mod: "Mouse", name: "Random Forest", ver: "1.0", task: "Mouse movement pattern analysis", inf: 11, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { mod: "Spiral", name: "ResNet18", ver: "1.0", task: "Spiral drawing trajectory assessment", inf: 84, color: "#d946ef", bg: "rgba(217, 70, 239, 0.1)" },
    { mod: "Voice", name: "Random Forest", ver: "1.0", task: "Voice signal feature extraction", inf: 23, color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
    { mod: "Gait", name: "HistGradientBoosting", ver: "1.0", task: "Gait rhythm and consistency analysis", inf: 17, color: "#f59e0b", bg: "rgba(245, 158, 11, 0.1)" },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "3rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        <div style={{ color: "var(--primary)", marginTop: "0.25rem" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3v2M15 3v2M5 8h14M5 13h14M5 18h14M3 21h18M3 8v13M21 8v13"></path>
            <path d="M10 2v7.31M14 2v7.31M8.5 2h7M14 9.31a2 2 0 0 1 .46 1.34l.87 5.24a4 4 0 0 1-3.95 4.67h-2.76a4 4 0 0 1-3.95-4.67l.87-5.24a2 2 0 0 1 .46-1.34M7 21h10"></path>
          </svg>
        </div>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
            Research Mode
          </h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>
            Technical Information for researchers and hackathon judges. All models are independent behavioral assessment modules.
          </p>
        </div>
      </div>

      <div className="module-card" style={{ overflow: "hidden", marginBottom: "2rem" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--panel-border)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Model Registry</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 2.5fr 1fr", padding: "1rem 2rem", background: "rgba(15, 23, 42, 0.02)", borderBottom: "1px solid var(--panel-border)", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          <div>Modality</div>
          <div>Model</div>
          <div>Version</div>
          <div>Task</div>
          <div style={{ textAlign: "right" }}>Inference</div>
        </div>
        
        {registry.map((row, i) => (
          <div key={row.mod} style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 2.5fr 1fr", padding: "1.5rem 2rem", borderBottom: i === registry.length - 1 ? "none" : "1px solid var(--panel-border)", alignItems: "center", fontSize: "0.95rem" }}>
            <div style={{ fontWeight: 600, color: "var(--text-main)" }}>{row.mod}</div>
            <div>
              <span style={{ background: row.bg, color: row.color, padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: 600 }}>
                {row.name}
              </span>
            </div>
            <div style={{ color: "var(--text-muted)", fontWeight: 500 }}>v{row.ver}</div>
            <div style={{ color: "var(--text-muted)" }}>{row.task}</div>
            <div style={{ textAlign: "right", fontWeight: 600, color: "var(--text-main)" }}>{row.inf} ms</div>
          </div>
        ))}
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Inference Performance */}
        <div className="module-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Inference Performance</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {registry.map(row => (
              <div key={row.mod} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: "60px", fontSize: "0.9rem", color: "var(--text-main)", fontWeight: 500 }}>{row.mod}</div>
                <div style={{ flex: 1, height: "8px", background: "var(--panel-border)", borderRadius: "4px" }}>
                  <div style={{ width: `${Math.min(100, (row.inf / 100) * 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "4px" }}></div>
                </div>
                <div style={{ width: "50px", textAlign: "right", fontSize: "0.9rem", color: "var(--text-muted)", fontWeight: 500 }}>{row.inf} ms</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dataset References */}
        <div className="module-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--text-main)", margin: 0 }}>Dataset References</h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ borderBottom: "1px solid var(--panel-border)", paddingBottom: "1rem" }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>Typing</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>CMU Keystroke Dynamics</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Keystroke dynamics behavioral consistency</div>
            </div>
            {/* Mocking others lightly */}
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-main)" }}>Mouse</div>
              <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>Balabit Mouse Dynamics Challenge</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Mouse movement pattern analysis</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
