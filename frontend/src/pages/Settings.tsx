import { useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState({ email: true, push: false });

  return (
    <div className="settings-page fade-in">
      <header className="settings-header">
        <div>
          <p className="settings-kicker">Workspace</p>
          <h1>Settings</h1>
          <p>Manage your account, preferences, and clinical workspace configuration.</p>
        </div>
        <button className="btn btn-primary settings-save" type="button">Save changes</button>
      </header>

      <main className="settings-content">
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            </div>
            <div><h2>Profile</h2><p>Identity and regional preferences for your workspace.</p></div>
          </div>
          <div className="settings-card">
            <label className="settings-field">
              <span>Email address</span>
              <input type="email" defaultValue="dr.smith@neurosense.ai" />
            </label>
            <label className="settings-field">
              <span>Language</span>
              <select defaultValue="en"><option value="en">English (US)</option><option value="es">Spanish</option><option value="fr">French</option></select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </div>
            <div><h2>Security</h2><p>Keep your account and clinical data protected.</p></div>
          </div>
          <div className="settings-card settings-list-card">
            <div className="settings-row">
              <div><strong>Password</strong><span>Last changed 3 months ago</span></div>
              <button className="btn btn-outline settings-row-action" type="button">Change password</button>
            </div>
            <div className="settings-row">
              <div><strong>Two-factor authentication</strong><span>Add an extra layer of account protection.</span></div>
              <label className="settings-toggle"><input type="checkbox" defaultChecked /><span aria-hidden="true"></span><em>Enabled</em></label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.37.5.61.9.61H21a2 2 0 1 1 0 4h-.7c-.4 0-.76.24-.9.61Z"/></svg>
            </div>
            <div><h2>Preferences</h2><p>Choose how NeuroSense looks and communicates with you.</p></div>
          </div>
          <div className="settings-card settings-list-card">
            <div className="settings-row settings-row-preference">
              <div><strong>Interface theme</strong><span>Choose the appearance of your workspace.</span></div>
              <div className="settings-choice-group" role="radiogroup" aria-label="Interface theme">
                {['light', 'dark', 'system'].map((option) => <label key={option} className={theme === option ? 'selected' : ''}><input type="radio" name="theme" value={option} checked={theme === option} onChange={() => setTheme(option)} /><span>{option}</span></label>)}
              </div>
            </div>
            <div className="settings-row settings-row-preference">
              <div><strong>Notifications</strong><span>Control the alerts sent to your workspace.</span></div>
              <div className="settings-notification-options">
                <label><input type="checkbox" checked={notifications.email} onChange={(event) => setNotifications({ ...notifications, email: event.target.checked })} /><span>Email alerts</span></label>
                <label><input type="checkbox" checked={notifications.push} onChange={(event) => setNotifications({ ...notifications, push: event.target.checked })} /><span>Push notifications</span></label>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
