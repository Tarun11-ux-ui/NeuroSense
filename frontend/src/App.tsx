import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ModuleCapture from "./pages/ModuleCapture";
import ComprehensiveAssessment from "./pages/ComprehensiveAssessment";
import RemoteCapture from "./pages/RemoteCapture";
import MobileCapture from "./pages/MobileCapture";
import MobileCompanion from "./pages/MobileCompanion";
import AutoLogin from "./pages/AutoLogin";
import "./App.css";

function MainLayout({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  return (
    <div className="app-container">
      <header className="app-navbar fade-in">
        <div
          className="nav-brand"
          style={{ cursor: "pointer" }}
          onClick={() => (window.location.href = "/dashboard")}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          NeuroSense
        </div>
        <div className="nav-actions">
          <button
            className="btn btn-outline"
            onClick={() => setIsAuthenticated(false)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Sign Out
          </button>
        </div>
      </header>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/module/:id" element={<ModuleCapture />} />
        <Route path="/comprehensive" element={<ComprehensiveAssessment />} />
        <Route path="/mobile-capture/:module/:sessionId" element={<MobileCapture />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("neurosense_token")),
  );

  const handleAuthenticationChange = (value: boolean) => {
    if (!value) {
      localStorage.removeItem("neurosense_token");
    }
    setIsAuthenticated(value);
  };

  return (
    <Router>
      <Routes>
        <Route path="/remote/:sessionId" element={<RemoteCapture />} />
        <Route path="/companion/:sessionId" element={<MobileCompanion />} />
        <Route path="/auto-login" element={<AutoLogin onLogin={() => handleAuthenticationChange(true)} />} />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={() => handleAuthenticationChange(true)} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <MainLayout setIsAuthenticated={handleAuthenticationChange} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
