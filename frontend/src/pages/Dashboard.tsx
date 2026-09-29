import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "../utils/i18n";
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
  },
  {
    id: "mouse_balabit",
    name: "Mouse Tracking (Balabit)",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>,
    longDesc: "Evaluate rapid point-and-click control, cursor precision, and response patterns during an interactive target task."
  },
  {
    id: "facial",
    name: "Facial Expression",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
    longDesc: "Measure facial movement consistency, blink timing, and expression-related motion using a guided camera capture."
  },
  {
    id: "reaction",
    name: "Reaction Time",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    longDesc: "Measure response latency during a visual cue task to assess cognitive and motor reaction timing."
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const radarData = [
    { subject: "Typing", current: 85, previous: 90 },
    { subject: "Mouse (DFL)", current: 75, previous: 80 },
    { subject: "Mouse (Balabit)", current: 78, previous: 76 },
    { subject: "Spiral", current: 80, previous: 75 },
    { subject: "Voice", current: 70, previous: 75 },
    { subject: "Gait", current: 82, previous: 85 },
    { subject: "Facial", current: 88, previous: 82 },
    { subject: "Reaction", current: 90, previous: 88 },
  ];

  const [latestScore, setLatestScore] = useState(78);
  const [completedModalities, setCompletedModalities] = useState(5);

  useEffect(() => {
    import("../utils/history").then(({ getAssessmentHistory }) => {
      const history = getAssessmentHistory();
      if (history && history.length > 0) {
        const lastSession = history[history.length - 1];
        setLatestScore(lastSession.score);
        setCompletedModalities(lastSession.modalities);
      }
    });
  }, []);

  return (
    <div className="dashboard-page fade-in">
      {/* Header Section */}
      <div className="dashboard-page-header">
        <div>
          <h1 className="dashboard-page-title">
            {t("Motor Consistency Overview")}
          </h1>
          <p className="dashboard-page-subtitle">
            {t("Track your current assessment, personal baseline, and longitudinal trends.")}
          </p>
        </div>
        <div className="dashboard-page-actions">
          <button
            className="btn dashboard-secondary-action"
            onClick={() => navigate("/sequential")}

          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            {t("Sequential Mode")}
          </button>
          <button
            className="btn btn-primary dashboard-primary-action"
            onClick={() => navigate("/assessment")}

          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
            {t("Start Assessment")}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="dashboard-stats-grid">
        <div className="module-card dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("Motor Consistency Profile")}
          </div>
          <div>
            <div className="dashboard-stat-value">
              {latestScore} <span>/ 100</span>
            </div>
            <div className="dashboard-stat-helper">
              {t("Prototype behavioral score")}
            </div>
          </div>
        </div>

        <div className="module-card dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("Assessment Quality")}
          </div>
          <div>
            <div className="dashboard-stat-value dashboard-stat-value-success">
              91%
            </div>
            <div className="dashboard-stat-helper dashboard-stat-helper-success">
              {t("High-quality assessment")}
            </div>
          </div>
        </div>

        <div className="module-card dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("Baseline Change")}
          </div>
          <div>
            <div className="dashboard-stat-value">
              -4.2%
            </div>
            <div className="dashboard-stat-helper">
              {t("Compared with previous session")}
            </div>
          </div>
        </div>

        <div className="module-card dashboard-stat-card">
          <div className="dashboard-stat-label">
            {t("Completed Modalities")}
          </div>
          <div>
            <div className="dashboard-stat-value">
              {completedModalities} <span>/ 5</span>
            </div>
            <div className="dashboard-stat-helper">
              {t("All modalities assessed")}
            </div>
          </div>
        </div>
      </div>

      {/* Main Panels */}
      <div className="dashboard-insights-grid">

        {/* Radar Chart Panel */}
        <div className="module-card dashboard-insight-card dashboard-radar-card">
          <div className="dashboard-card-heading">
            <h3>{t("Motor Profile Visualization")}</h3>
            <p>{t("Current session vs. previous session")}</p>
          </div>
          <div className="dashboard-radar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="var(--panel-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--text-muted)", fontSize: 12 }} />
                <Radar name={t("Current Session")} dataKey="current" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.2} />
                <Radar name={t("Previous Session")} dataKey="previous" stroke="#d946ef" fill="#d946ef" fillOpacity={0.0} strokeDasharray="5 5" />
                <Legend iconType="plainline" wrapperStyle={{ fontSize: "0.85rem", paddingTop: "20px" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Baseline Panel */}
        <div className="module-card dashboard-insight-card dashboard-baseline-card">
          <h3 className="dashboard-baseline-title">{t("Personal Baseline")}</h3>
          <p className="dashboard-baseline-description">
            {t("Your current motor profile compared with your previous assessment.")}
          </p>

          <div className="dashboard-profile-row">
            <span>{t("Current profile")}</span>
            <strong>78 / 100</strong>
          </div>

          <div className="dashboard-progress-track">
            <div className="dashboard-progress-value"></div>
          </div>

          <div className="dashboard-deviation-card">
            <div className="dashboard-deviation-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
              -4.2% {t("baseline deviation")}
            </div>
            <div className="dashboard-deviation-detail">
              {t("Based on 3 previous sessions")}
            </div>
          </div>

          <button
            className="btn btn-outline dashboard-history-action"
            onClick={() => navigate("/history")}

          >
            {t("View full history")}
          </button>
        </div>

      </div>
    </div>
  );
}
