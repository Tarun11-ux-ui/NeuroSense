import { useState } from 'react';

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const reports = [
    { id: "NS-2026-0927-001", date: "September 27, 2026", title: "Motor Consistency Assessment", quality: 91 },
    { id: "NS-2026-0920-001", date: "September 20, 2026", title: "Motor Consistency Assessment", quality: 89 },
    { id: "NS-2026-0913-001", date: "September 13, 2026", title: "Motor Consistency Assessment", quality: 87 },
    { id: "NS-2026-0906-001", date: "September 6, 2026", title: "Motor Consistency Assessment", quality: 92 },
  ];

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "3rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>
          Reports
        </h1>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>
          Download and export your motor assessment records.
        </p>
      </div>

      <div style={{ padding: "1.5rem 2rem", marginBottom: "2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
        <div>
          <h3 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", margin: "0 0 0.25rem 0", fontFamily: "'Inter', sans-serif" }}>Bulk Export</h3>
          <p style={{ color: "#64748b", margin: 0, fontSize: "0.85rem" }}>Export all sessions in a single file.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={() => {
              const blob = new Blob([JSON.stringify(reports, null, 2)], { type: 'application/json' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `NeuroSense-All-Reports.json`;
              a.click();
            }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", padding: "0.6rem 1.2rem", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#475569" }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Export JSON
          </button>
          <button 
            onClick={() => {
              const csvContent = "data:text/csv;charset=utf-8," + "ID,Date,Title,Quality\n" + reports.map(r => `${r.id},${r.date},${r.title},${r.quality}`).join("\n");
              const encodedUri = encodeURI(csvContent);
              const link = document.createElement("a");
              link.setAttribute("href", encodedUri);
              link.setAttribute("download", "NeuroSense-All-Reports.csv");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", padding: "0.6rem 1.2rem", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#475569" }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b" }}>
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
                <button 
                  onClick={() => setSelectedReport(report)}
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  View
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([`Report ID: ${report.id}\nTitle: ${report.title}\nDate: ${report.date}\nQuality: ${report.quality}%`], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${report.id}-Report.pdf`;
                    a.click();
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  PDF
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${report.id}-Report.json`;
                    a.click();
                  }}
                  style={{ display: "flex", alignItems: "center", gap: "0.25rem", padding: "0.4rem 0.6rem", border: "none", background: "transparent", color: "#64748b", fontSize: "0.8rem", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.color = "#1e293b"} onMouseLeave={(e) => e.currentTarget.style.color = "#64748b"}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                  JSON
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedReport && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            width: '100%',
            maxWidth: '800px',
            maxHeight: '90vh',
            borderRadius: '16px',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Header */}
            <div style={{ padding: '2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: '#f8fafc' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '44px', height: '44px', background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px' }}>Clinical Motor Assessment</h2>
                    <div style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>NeuroSense Official Report</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', color: '#475569', fontSize: '0.9rem', background: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Patient ID</span>
                      <strong style={{ color: '#0f172a' }}>P-883492</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Report ID</span>
                      <strong style={{ color: '#0f172a' }}>{selectedReport.id}</strong>
                    </div>
                  </div>
                  <div>
                    <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Date</span>
                      <strong style={{ color: '#0f172a' }}>{selectedReport.date}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748b' }}>Physician</span>
                      <strong style={{ color: '#0f172a' }}>Dr. A. Reynolds</strong>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#64748b', cursor: 'pointer', padding: '0.5rem', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#0f172a'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#64748b'; }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            {/* Body */}
            <div style={{ padding: '2.5rem', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                <div style={{ background: 'linear-gradient(145deg, #ffffff, #f8fafc)', border: '1px solid rgba(139, 92, 246, 0.15)', padding: '2rem', borderRadius: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', boxShadow: '0 10px 30px rgba(139, 92, 246, 0.05)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '1.5rem' }}>Composite Score</div>
                  <div style={{ position: 'relative', width: '160px', height: '160px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: `conic-gradient(#10b981 ${selectedReport.quality}%, #e2e8f0 ${selectedReport.quality}%)` }}>
                    <div style={{ width: '140px', height: '140px', background: 'white', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{selectedReport.quality}</div>
                      <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: 500, marginTop: '0.25rem' }}>/ 100</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    Normal Range
                  </div>
                </div>
                
                <div>
                  <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    Diagnostic Summary
                  </h3>
                  <p style={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem', background: '#f8fafc', padding: '1.25rem', borderRadius: '10px', borderLeft: '4px solid var(--primary)' }}>
                    The patient demonstrates high motor consistency across all evaluated modalities. 
                    Keystroke dynamics and mouse tracking show no significant deviations from baseline models.
                    Gait and facial symmetry metrics remain well within the 95th percentile of healthy control groups, indicating no signs of early motor degradation.
                  </p>
                  
                  <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                     {['Keystroke Dynamics', 'Mouse Tracking', 'Voice Analysis', 'Gait Pattern'].map((metric, i) => {
                        const score = 85 + Math.floor(Math.random() * 12);
                        return (
                          <div key={metric}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                              <span style={{ color: '#334155', fontWeight: 600 }}>{metric}</span>
                              <span style={{ color: '#10b981', fontWeight: 600 }}>{score}%</span>
                            </div>
                            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                               <div style={{ height: '100%', width: `${score}%`, background: '#10b981', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        );
                     })}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div style={{ padding: '1.5rem 2.5rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Securely generated by NeuroSense Core
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  onClick={() => setSelectedReport(null)}
                  style={{ padding: '0.6rem 1.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f1f5f9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; }}
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    const blob = new Blob([`Report ID: ${selectedReport.id}\nTitle: ${selectedReport.title}\nDate: ${selectedReport.date}\nQuality: ${selectedReport.quality}%`], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${selectedReport.id}-Report.pdf`;
                    a.click();
                  }}
                  style={{ padding: '0.6rem 1.5rem', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
