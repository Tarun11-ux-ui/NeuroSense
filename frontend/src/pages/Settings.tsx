import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({ email: true, push: false });

  return (
    <div className="fade-in" style={{ paddingBottom: "3rem" }}>
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--text-main)", margin: "0 0 0.75rem 0", fontFamily: "'Inter', sans-serif", letterSpacing: "-0.5px" }}>Settings</h1>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "1rem" }}>Manage your account, preferences, and system configuration.</p>
        </div>
        <div>
          <button style={{ padding: "0.6rem 1.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: "8px", fontWeight: 500, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "#7c3aed"} onMouseLeave={(e) => e.currentTarget.style.background = "#8b5cf6"}>
            Save Changes
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", maxWidth: "800px" }}>
        
        {/* Profile Settings */}
        <section>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9", fontFamily: "'Inter', sans-serif" }}>
            Profile Settings
          </h2>
          <div style={{ background: "#ffffff", padding: "1.5rem 2rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Email Address</div>
              <input type="email" defaultValue="dr.smith@neurosense.ai" style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", outline: "none", fontSize: "0.95rem", transition: "0.2s" }} onFocus={(e) => e.target.style.borderColor = "#8b5cf6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center" }}>
              <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Language</div>
              <select style={{ width: "100%", padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#1e293b", outline: "none", fontSize: "0.95rem", transition: "0.2s" }} onFocus={(e) => e.target.style.borderColor = "#8b5cf6"} onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}>
                <option value="en">English (US)</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
              </select>
            </div>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9", fontFamily: "'Inter', sans-serif" }}>
            Security
          </h2>
          <div style={{ background: "#ffffff", padding: "1.5rem 2rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Password</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Last changed 3 months ago</div>
              </div>
              <div>
                <button style={{ padding: "0.5rem 1rem", background: "transparent", color: "#475569", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 500, cursor: "pointer", transition: "0.2s" }} onMouseEnter={(e) => e.currentTarget.style.borderColor = "#cbd5e1"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}>
                  Change Password
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Two-Factor Auth</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Protect your clinical data</div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" defaultChecked style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ fontSize: "0.95rem", color: "#475569" }}>Enabled</span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* System Preferences */}
        <section>
          <h2 style={{ fontSize: "1.05rem", fontWeight: 600, color: "#1e293b", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "1px solid #f1f5f9", fontFamily: "'Inter', sans-serif" }}>
            System Preferences
          </h2>
          <div style={{ background: "#ffffff", padding: "1.5rem 2rem", borderRadius: "12px", border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Theme</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>Customize UI appearance</div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="theme" checked={theme === "light"} onChange={() => setTheme("light")} style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ color: "#475569", fontSize: "0.95rem" }}>Light</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="theme" checked={theme === "dark"} onChange={() => setTheme("dark")} style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ color: "#475569", fontSize: "0.95rem" }}>Dark</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="radio" name="theme" checked={theme === "system"} onChange={() => setTheme("system")} style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ color: "#475569", fontSize: "0.95rem" }}>System</span>
                </label>
              </div>
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 500, color: "#1e293b", fontSize: "0.95rem" }}>Notifications</div>
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>How we contact you</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={notifications.email} onChange={(e) => setNotifications({...notifications, email: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ color: "#475569", fontSize: "0.95rem" }}>Email Alerts</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={notifications.push} onChange={(e) => setNotifications({...notifications, push: e.target.checked})} style={{ width: "18px", height: "18px", accentColor: "#8b5cf6" }} />
                  <span style={{ color: "#475569", fontSize: "0.95rem" }}>Push Notifications</span>
                </label>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
