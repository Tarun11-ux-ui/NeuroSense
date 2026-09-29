import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "../utils/i18n";

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
        <div><p className="reports-kicker">{t("Clinical records")}</p><h1>{t("Assessment reports")}</h1><p>{t("Review, share, and export completed motor-consistency assessments.")}</p></div>
        <button className="btn btn-outline reports-export" onClick={() => { const blob = new Blob([JSON.stringify(reports, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = "NeuroSense-reports.json"; link.click(); URL.revokeObjectURL(url); }}>{t("Export records")}</button>
      </header>

      <section className="reports-list" aria-label="Available reports">
        {reports.map((report) => <article key={report.id} className="report-list-item">
          <div className="report-list-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h6"/></svg></div>
          <div className="report-list-copy"><h2>{report.title}</h2><p>{report.id} <span>•</span> {report.date}</p></div>
          <div className="report-list-quality"><span>{t("Data quality")}</span><strong className={report.quality >= 90 ? "quality-good" : ""}>{report.quality}%</strong></div>
          <button className="btn btn-outline report-open-action" onClick={() => openReport(report)}>{t("View report")} <span aria-hidden="true">→</span></button>
        </article>)}
      </section>

      {selectedReport && <div className="report-modal-backdrop" role="presentation" onMouseDown={closeReport}>
        <section className="clinical-report" role="dialog" aria-modal="true" aria-labelledby="clinical-report-title" onMouseDown={(event) => event.stopPropagation()}>
          <header className="clinical-report-topbar">
            <div className="clinical-brand"><div className="clinical-brand-mark">N</div><div><strong>NeuroSense</strong><span>{t("Secure digital motor assessment platform")}</span></div></div>
            <button className="clinical-close" onClick={closeReport} aria-label="Close report">×</button>
          </header>
          <div className="clinical-report-body">
            <div className="clinical-report-title-row"><div><p>{t("Clinical assessment record")}</p><h1 id="clinical-report-title">{t("Motor Consistency Report")}</h1></div><div className="clinical-report-number"><span>{t("Report number")}</span><strong>{selectedReport.id}</strong><span>{t("Issued")} {selectedReport.date}</span><b>{t("Confidential assessment record")}</b></div></div>

            <section className="clinical-details-grid">
              <div><h2>{t("Patient details")}</h2><dl><div><dt>{t("Patient name")}</dt><dd>{t("Not specified")}</dd></div><div><dt>{t("Patient ID")}</dt><dd>P-883492</dd></div><div><dt>{t("Report purpose")}</dt><dd>{t("Longitudinal motor assessment")}</dd></div></dl></div>
              <div><h2>{t("Session details")}</h2><dl><div><dt>{t("Session ID")}</dt><dd>{selectedReport.id}</dd></div><div><dt>{t("Date completed")}</dt><dd>{selectedReport.date}</dd></div><div><dt>{t("Modalities completed")}</dt><dd>8 {t("of")} 8</dd></div></dl></div>
            </section>

            <section className="clinical-results"><div className="clinical-section-heading"><div><p>{t("Assessment results")}</p><h2>{t("Summary by modality")}</h2></div><div className="clinical-score"><span>{t("Composite profile")}</span><strong>{selectedReport.score}<small>/ 100</small></strong><em>{t("Baseline")} {selectedReport.baseline}</em></div></div>
              <div className="clinical-table-wrap"><table><thead><tr><th>{t("Modality")}</th><th>{t("Result")}</th><th>{t("Interpretation")}</th><th>{t("Data quality")}</th></tr></thead><tbody>{metrics.map(([name, result, interpretation, quality]) => <tr key={name}><td><strong>{name}</strong></td><td>{result}</td><td><span className={interpretation.startsWith("Monitor") ? "clinical-status monitor" : "clinical-status"}>{interpretation}</span></td><td>{quality}</td></tr>)}</tbody></table></div>
            </section>

            <section className="clinical-interpretation"><div className="clinical-note-icon">i</div><div><h2>{t("Clinical interpretation")}</h2><p>{t("This assessment shows a motor consistency profile of")} {selectedReport.score}/100 {t("with")} {selectedReport.quality}% {t("data quality. Results are intended to support longitudinal comparison and should be interpreted alongside clinical findings, personal history, and repeat assessments.")}</p></div></section>
            <section className="clinical-notes"><h2>{t("Report notes")}</h2><ul><li>{t("Results describe digital motor measurements and are not a standalone diagnosis.")}</li><li>{t("Compare future sessions using the same assessment conditions where possible.")}</li><li>{t("Discuss any persistent changes or symptoms with a qualified clinician.")}</li></ul></section><section className="clinical-method"><h2>{t("Method and limitations")}</h2><p>{t("Measurements are derived from completed digital typing, mouse, spiral, voice, and gait tasks. Results reflect the quality of data captured during this session and should be reviewed in the context of repeat assessments and clinical judgement.")}</p></section>
          </div>
          <footer className="clinical-report-footer"><div><span>{t("Generated by")}</span><strong>{t("NeuroSense assessment platform")}</strong></div><div><span>{t("Report status")}</span><strong className="clinical-approved">{t("Complete")}</strong></div><button className="btn btn-primary" onClick={() => window.print()}>{t("Print / save PDF")}</button></footer>
        </section>
      </div>}
    </div>
  );
}
