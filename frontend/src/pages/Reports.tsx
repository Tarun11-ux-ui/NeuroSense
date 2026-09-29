import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Report = { id: string; date: string; title: string; quality: number; score: number; baseline: string };

const reports: Report[] = [
  { id: "NS-2026-0927-001", date: "September 27, 2026", title: "Motor Consistency Assessment", quality: 91, score: 78, baseline: "-4.2%" },
  { id: "NS-2026-0920-001", date: "September 20, 2026", title: "Motor Consistency Assessment", quality: 89, score: 83, baseline: "+2.0%" },
  { id: "NS-2026-0913-001", date: "September 13, 2026", title: "Motor Consistency Assessment", quality: 87, score: 81, baseline: "-5.0%" },
  { id: "NS-2026-0906-001", date: "September 6, 2026", title: "Motor Consistency Assessment", quality: 92, score: 86, baseline: "+1.0%" },
];

const metrics = [
  ["Typing dynamics", "82 / 100", "Within personal range", "Sufficient data"],
  ["Mouse control (DFL)", "76 / 100", "Within personal range", "Sufficient data"],
  ["Mouse tracking (Balabit)", "78 / 100", "Within personal range", "Sufficient data"],
  ["Spiral drawing", "80 / 100", "Within personal range", "Sufficient data"],
  ["Voice analysis", "70 / 100", "Monitor over time", "Sufficient data"],
  ["Gait pattern", "82 / 100", "Within personal range", "Sufficient data"],
  ["Facial expression", "88 / 100", "Within personal range", "Sufficient data"],
  ["Reaction time", "90 / 100", "Within personal range", "Sufficient data"],
];

export default function Reports() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    const reportId = new URLSearchParams(location.search).get("report");
    setSelectedReport(reports.find((report) => report.id === reportId) ?? null);
  }, [location.search]);

  const openReport = (report: Report) => navigate(`/reports?report=${report.id}`);
  const closeReport = () => navigate("/reports");

  return (
    <div className="reports-page fade-in">
      <header className="reports-header">
        <div><p className="reports-kicker">Clinical records</p><h1>Assessment reports</h1><p>Review, share, and export completed motor-consistency assessments.</p></div>
        <button className="btn btn-outline reports-export" onClick={() => { const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "NeuroSense-reports.json"; link.click(); URL.revokeObjectURL(url); }}>Export records</button>
      </header>

      <section className="reports-list" aria-label="Available reports">
        {reports.map((report) => <article key={report.id} className="report-list-item">
          <div className="report-list-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg></div>
          <div className="report-list-copy"><h2>{report.title}</h2><p>{report.id} <span>•</span> {report.date}</p></div>
          <div className="report-list-quality"><span>Data quality</span><strong className={report.quality >= 90 ? "quality-good" : ""}>{report.quality}%</strong></div>
          <button className="btn btn-outline report-open-action" onClick={() => openReport(report)}>View report <span aria-hidden="true">→</span></button>
        </article>)}
      </section>

      {selectedReport && <div className="report-modal-backdrop" role="presentation" onMouseDown={closeReport}>
        <section className="clinical-report" role="dialog" aria-modal="true" aria-labelledby="clinical-report-title" onMouseDown={(event) => event.stopPropagation()}>
          <header className="clinical-report-topbar">
            <div className="clinical-brand"><div className="clinical-brand-mark">N</div><div><strong>NeuroSense</strong><span>Secure digital motor assessment platform</span></div></div>
            <button className="clinical-close" onClick={closeReport} aria-label="Close report">×</button>
          </header>
          <div className="clinical-report-body">
            <div className="clinical-report-title-row"><div><p>Clinical assessment record</p><h1 id="clinical-report-title">Motor Consistency Report</h1></div><div className="clinical-report-number"><span>Report number</span><strong>{selectedReport.id}</strong><span>Issued {selectedReport.date}</span><b>Confidential assessment record</b></div></div>

            <section className="clinical-details-grid">
              <div><h2>Patient details</h2><dl><div><dt>Patient name</dt><dd>Not specified</dd></div><div><dt>Patient ID</dt><dd>P-883492</dd></div><div><dt>Report purpose</dt><dd>Longitudinal motor assessment</dd></div></dl></div>
              <div><h2>Session details</h2><dl><div><dt>Session ID</dt><dd>{selectedReport.id}</dd></div><div><dt>Date completed</dt><dd>{selectedReport.date}</dd></div><div><dt>Modalities completed</dt><dd>8 of 8</dd></div></dl></div>
            </section>

            <section className="clinical-results"><div className="clinical-section-heading"><div><p>Assessment results</p><h2>Summary by modality</h2></div><div className="clinical-score"><span>Composite profile</span><strong>{selectedReport.score}<small>/ 100</small></strong><em>Baseline {selectedReport.baseline}</em></div></div>
              <div className="clinical-table-wrap"><table><thead><tr><th>Modality</th><th>Result</th><th>Interpretation</th><th>Data quality</th></tr></thead><tbody>{metrics.map(([name, result, interpretation, quality]) => <tr key={name}><td><strong>{name}</strong></td><td>{result}</td><td><span className={interpretation.startsWith("Monitor") ? "clinical-status monitor" : "clinical-status"}>{interpretation}</span></td><td>{quality}</td></tr>)}</tbody></table></div>
            </section>

            <section className="clinical-interpretation"><div className="clinical-note-icon">i</div><div><h2>Clinical interpretation</h2><p>This assessment shows a motor consistency profile of {selectedReport.score}/100 with {selectedReport.quality}% data quality. Results are intended to support longitudinal comparison and should be interpreted alongside clinical findings, personal history, and repeat assessments.</p></div></section>
            <section className="clinical-notes"><h2>Report notes</h2><ul><li>Results describe digital motor measurements and are not a standalone diagnosis.</li><li>Compare future sessions using the same assessment conditions where possible.</li><li>Discuss any persistent changes or symptoms with a qualified clinician.</li></ul></section><section className="clinical-method"><h2>Method and limitations</h2><p>Measurements are derived from completed digital typing, mouse, spiral, voice, and gait tasks. Results reflect the quality of data captured during this session and should be reviewed in the context of repeat assessments and clinical judgement.</p></section>
          </div>
          <footer className="clinical-report-footer"><div><span>Generated by</span><strong>NeuroSense assessment platform</strong></div><div><span>Report status</span><strong className="clinical-approved">Complete</strong></div><button className="btn btn-primary" onClick={() => window.print()}>Print / save PDF</button></footer>
        </section>
      </div>}
    </div>
  );
}
