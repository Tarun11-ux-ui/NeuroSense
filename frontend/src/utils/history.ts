export interface HistorySession {
  id: string;
  date: string;
  fullDate: string;
  score: number;
  quality: number;
  modalities: number;
  baseline: string;
  status: string;
  sessionType?: "single" | "sequential";
  moduleName?: string;
}

export function saveAssessmentToHistory(
  _sessionType: "single" | "sequential",
  score: number,
  modalitiesCount: number,
  moduleName?: string
) {
  const existingStr = localStorage.getItem("neurosense_assessment_history");
  let history: HistorySession[] = [];
  
  if (existingStr) {
    try {
      history = JSON.parse(existingStr);
    } catch (e) {
      console.error("Failed to parse history", e);
    }
  }

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  
  const newSession: HistorySession = {
    id: `NS-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
    date: `W${Math.ceil(now.getDate() / 7)}`,
    fullDate: dateStr,
    score: score,
    quality: Math.floor(Math.random() * 10) + 85, // Mock quality between 85-95
    modalities: modalitiesCount,
    baseline: (Math.random() > 0.5 ? "+" : "-") + (Math.random() * 5).toFixed(1) + "%", // Mock baseline change
    status: score > 80 ? "High quality" : "Good quality",
    sessionType: _sessionType,
    moduleName: moduleName
  };

  history.push(newSession);
  localStorage.setItem("neurosense_assessment_history", JSON.stringify(history));
  return newSession;
}

export function getAssessmentHistory(): HistorySession[] {
  const existingStr = localStorage.getItem("neurosense_assessment_history");
  if (!existingStr) return [];
  try {
    return JSON.parse(existingStr);
  } catch (e) {
    return [];
  }
}
