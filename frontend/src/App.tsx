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
import SequentialAssessment from "./pages/SequentialAssessment";
import History from "./pages/History";
import Reports from "./pages/Reports";
import Research from "./pages/Research";
import Settings from "./pages/Settings";
import RemoteCapture from "./pages/RemoteCapture";
import MobileCapture from "./pages/MobileCapture";
import MobileCompanion from "./pages/MobileCompanion";
import AutoLogin from "./pages/AutoLogin";
import "./App.css";

function Sidebar({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {
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
        <span className="sidebar-nav-label">Workspace</span>
        <Link to="/dashboard" className={`sidebar-link ${isActive('/dashboard') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </Link>
        <Link to="/assessment" className={`sidebar-link ${isActive('/assessment') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Assessment
        </Link>
        <Link to="/history" className={`sidebar-link ${isActive('/history') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          History
        </Link>
        <Link to="/reports" className={`sidebar-link ${isActive('/reports') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="15" x2="15" y2="15"></line></svg>
          Reports
        </Link>
        <Link to="/research" className={`sidebar-link ${isActive('/research') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21h6"></path><path d="M12 15v6"></path><path d="M15.4 7A6.4 6.4 0 0 0 9 1.5C5 2.5 3 6 3 9.5a7 7 0 0 0 2 5.5l1.6 1.8a2 2 0 0 1 .5 1.2v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2a2 2 0 0 1 .5-1.2l1.6-1.8A7 7 0 0 0 21 9.5C21 6 19 2.5 15 1.5A6.4 6.4 0 0 0 15.4 7z"></path></svg>
          Research
        </Link>
        <Link to="/settings" className={`sidebar-link ${isActive('/settings') ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          Settings
        </Link>
      </nav>
      <div className="sidebar-footer">
        <button
          className="btn sidebar-sign-out"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--panel-border)' }}
          onClick={() => setIsAuthenticated(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>

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
      <Sidebar setIsAuthenticated={setIsAuthenticated} />
      <div className="app-main">
        
        <div className="app-container">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assessment" element={<ComprehensiveAssessment />} />
            <Route path="/sequential" element={<SequentialAssessment />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/research" element={<Research />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/module/:id" element={<ModuleCapture />} />
            <Route path="/comprehensive" element={<Navigate to="/assessment" replace />} />
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
