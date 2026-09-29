import { useState, useEffect } from "react";

const translations: Record<string, Record<string, string>> = {
  en: {
    workspace: "Workspace",
    settingsTitle: "Settings",
    settingsDesc: "Manage your account, preferences, and clinical workspace configuration.",
    saveBtn: "Save changes",
    savingBtn: "Saving...",
    profile: "Profile",
    profileDesc: "Identity and regional preferences for your workspace.",
    email: "Email address",
    language: "Language",
    security: "Security",
    securityDesc: "Keep your account and clinical data protected.",
    password: "Password",
    passwordDesc: "Last changed 3 months ago",
    changePassword: "Change password",
    twoFactor: "Two-factor authentication",
    twoFactorDesc: "Add an extra layer of account protection.",
    enabled: "Enabled",
    disabled: "Disabled",
    preferences: "Preferences",
    preferencesDesc: "Choose how NeuroSense communicates with you.",
    notifications: "Notifications",
    notificationsDesc: "Control the alerts sent to your workspace.",
    emailAlerts: "Email alerts",
    pushNotifs: "Push notifications",
    successMsg: "Settings saved successfully!",
    pwdResetMsg: "A password reset link has been sent to your email."
  },
  es: {
    workspace: "Espacio de trabajo",
    settingsTitle: "Ajustes",
    settingsDesc: "Administre su cuenta, preferencias y configuración del espacio clínico.",
    saveBtn: "Guardar cambios",
    savingBtn: "Guardando...",
    profile: "Perfil",
    profileDesc: "Identidad y preferencias regionales de su espacio de trabajo.",
    email: "Correo electrónico",
    language: "Idioma",
    security: "Seguridad",
    securityDesc: "Mantenga protegidos su cuenta y sus datos clínicos.",
    password: "Contraseña",
    passwordDesc: "Cambiado hace 3 meses",
    changePassword: "Cambiar contraseña",
    twoFactor: "Autenticación de dos factores",
    twoFactorDesc: "Agregue una capa adicional de protección.",
    enabled: "Activado",
    disabled: "Desactivado",
    preferences: "Preferencias",
    preferencesDesc: "Elija cómo se comunica NeuroSense con usted.",
    notifications: "Notificaciones",
    notificationsDesc: "Controle las alertas enviadas a su espacio de trabajo.",
    emailAlerts: "Alertas por correo",
    pushNotifs: "Notificaciones push",
    successMsg: "¡Ajustes guardados correctamente!",
    pwdResetMsg: "Se ha enviado un enlace a su correo."
  },
  fr: {
    workspace: "Espace de travail",
    settingsTitle: "Paramètres",
    settingsDesc: "Gérez votre compte, vos préférences et la configuration de l'espace.",
    saveBtn: "Enregistrer",
    savingBtn: "Enregistrement...",
    profile: "Profil",
    profileDesc: "Identité et préférences régionales pour votre espace de travail.",
    email: "Adresse e-mail",
    language: "Langue",
    security: "Sécurité",
    securityDesc: "Protégez votre compte et vos données cliniques.",
    password: "Mot de passe",
    passwordDesc: "Modifié il y a 3 mois",
    changePassword: "Changer le mot de passe",
    twoFactor: "Double authentification",
    twoFactorDesc: "Ajoutez une couche supplémentaire de protection.",
    enabled: "Activé",
    disabled: "Désactivé",
    preferences: "Préférences",
    preferencesDesc: "Choisissez comment NeuroSense communique avec vous.",
    notifications: "Notifications",
    notificationsDesc: "Contrôlez les alertes envoyées à votre espace de travail.",
    emailAlerts: "Alertes par e-mail",
    pushNotifs: "Notifications push",
    successMsg: "Paramètres enregistrés avec succès !",
    pwdResetMsg: "Un lien a été envoyé à votre adresse e-mail."
  }
};

export default function Settings() {
  const [email, setEmail] = useState("dr.smith@neurosense.ai");
  const [language, setLanguage] = useState("en");
  const [twoFactor, setTwoFactor] = useState(true);
  const [notifications, setNotifications] = useState({ email: true, push: false });
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = translations[language] || translations["en"];

  useEffect(() => {
    const saved = localStorage.getItem("neurosense_settings");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.email) setEmail(data.email);
        if (data.language) setLanguage(data.language);
        if (typeof data.twoFactor === "boolean") setTwoFactor(data.twoFactor);
        if (data.notifications) setNotifications(data.notifications);
      } catch (e) {}
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      localStorage.setItem("neurosense_settings", JSON.stringify({
        email, language, twoFactor, notifications
      }));
      setIsSaving(false);
      showToast(t.successMsg);
      setTimeout(() => window.location.reload(), 1000);
    }, 600);
  };

  const handleChangePassword = () => {
    showToast(t.pwdResetMsg);
  };

  return (
    <div className="settings-page fade-in" style={{ position: "relative" }}>
      {toastMessage && (
        <div style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          background: "var(--primary)",
          color: "white",
          padding: "1rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 10px 25px rgba(139, 92, 246, 0.4)",
          zIndex: 9999,
          fontWeight: 600,
          animation: "slideUp 0.3s ease-out forwards"
        }}>
          {toastMessage}
        </div>
      )}
      <header className="settings-header">
        <div>
          <p className="settings-kicker">{t.workspace}</p>
          <h1>{t.settingsTitle}</h1>
          <p>{t.settingsDesc}</p>
        </div>
        <button 
          className="btn btn-primary settings-save" 
          type="button"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? t.savingBtn : t.saveBtn}
        </button>
      </header>

      <main className="settings-content">
        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
            </div>
            <div><h2>{t.profile}</h2><p>{t.profileDesc}</p></div>
          </div>
          <div className="settings-card">
            <label className="settings-field">
              <span>{t.email}</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            <label className="settings-field">
              <span>{t.language}</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
            </div>
            <div><h2>{t.security}</h2><p>{t.securityDesc}</p></div>
          </div>
          <div className="settings-card settings-list-card">
            <div className="settings-row">
              <div><strong>{t.password}</strong><span>{t.passwordDesc}</span></div>
              <button className="btn btn-outline settings-row-action" type="button" onClick={handleChangePassword}>{t.changePassword}</button>
            </div>
            <div className="settings-row">
              <div><strong>{t.twoFactor}</strong><span>{t.twoFactorDesc}</span></div>
              <label className="settings-toggle">
                <input type="checkbox" checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
                <span aria-hidden="true"></span>
                <em>{twoFactor ? t.enabled : t.disabled}</em>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="settings-section-heading">
            <div className="settings-section-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6h.01A1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.14.37.5.61.9.61H21a2 2 0 1 1 0 4h-.7c-.4 0-.76.24-.9.61Z"/></svg>
            </div>
            <div><h2>{t.preferences}</h2><p>{t.preferencesDesc}</p></div>
          </div>
          <div className="settings-card settings-list-card">
            <div className="settings-row settings-row-preference">
              <div><strong>{t.notifications}</strong><span>{t.notificationsDesc}</span></div>
              <div className="settings-notification-options">
                <label><input type="checkbox" checked={notifications.email} onChange={(event) => setNotifications({ ...notifications, email: event.target.checked })} /><span>{t.emailAlerts}</span></label>
                <label><input type="checkbox" checked={notifications.push} onChange={(event) => setNotifications({ ...notifications, push: event.target.checked })} /><span>{t.pushNotifs}</span></label>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
