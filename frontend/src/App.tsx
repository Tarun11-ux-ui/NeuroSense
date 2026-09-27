import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation
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

function Sidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
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
      <nav className="sidebar-nav">
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </Link>

      </nav>
    </aside>
  );
}

function MainLayout({
  setIsAuthenticated,
}: {
  setIsAuthenticated: (val: boolean) => void;
}) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <header className="app-navbar fade-in">
          <div className="nav-spacer"></div>
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
        <div className="app-container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/module/:id" element={<ModuleCapture />} />
            <Route path="/comprehensive" element={<ComprehensiveAssessment />} />
            <Route path="/mobile-capture/:module/:sessionId" element={<MobileCapture />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Clear token on start to enforce login every time
    localStorage.removeItem("neurosense_token");
  }, []);

  const handleAuthenticationChange = (value: boolean) => {
    if (!value) {
      localStorage.removeItem("neurosense_token");
    } else {
      // Token is already set by Login.tsx or AutoLogin.tsx
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
