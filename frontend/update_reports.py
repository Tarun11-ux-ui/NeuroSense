import os

reports_path = r'd:\NeuroSense\frontend\src\pages\Reports.tsx'

reports_code = """export default function Reports() {
  const reports = [
    { id: "NS-2026-0927-001", date: "September 27, 2026", title: "Motor Consistency Assessment", quality: 91 },
    { id: "NS-2026-0920-001", date: "September 20, 2026", title: "Motor Consistency Assessment", quality: 89 },
    { id: "NS-2026-0913-001", date: "September 13, 2026", title: "Motor Consistency Assessment", quality: 87 },
    { id: "NS-2026-0906-001", date: "September 6, 2026", title: "Motor Consistency Assessment", quality: 92 },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 500, color: "#0f172a", margin: "0 0 0.5rem 0", fontFamily: "'Inter', sans-serif" }}>
          Reports
        </h1>
        <p style={{ color: "#64748b", margin: 0, fontSize: "0.95rem" }}>
          Download and export your motor assessment records.
        </p>
      </div>

      <div style={{ padding: "1.5rem 2rem", marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.25rem 0", fontFamily: "'Inter', sans-serif" }}>Bulk Export</h3>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.85rem" }}>Export all sessions in a single file.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", padding: "0.6rem 1.2rem", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#475569" }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export JSON
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", padding: "0.6rem 1.2rem", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#475569" }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {reports.map((report) => (
          <div key={report.id} style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "1.25rem 1.5rem", 
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flex: "1" }}>
              <div style={{ width: "38px", height: "38px", background: "rgba(139, 92, 246, 0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b5cf6" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1e293b", margin: "0" }}>{report.title}</h3>
                <div style={{ color: "#64748b", fontSize: "0.8rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <span>{report.date}</span>
                  <span style={{ width: "4px", height: "4px", background: "#cbd5e1", borderRadius: "50%" }}></span>
                  <span>{report.id}</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flex: "1", justifyContent: "flex-end" }}>
              <span style={{ 
                color: report.quality >= 90 ? "#10b981" : "#f59e0b",
                background: report.quality >= 90 ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                padding: "0.25rem 0.75rem",
                borderRadius: "20px",
                fontSize: "0.75rem",
                fontWeight: 600,
              }}>
                Quality {report.quality}%
              </span>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  View
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  PDF
                </button>
                <button style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  JSON
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

with open(reports_path, 'w') as f:
    f.write(reports_code)

print("Reports updated successfully.")
