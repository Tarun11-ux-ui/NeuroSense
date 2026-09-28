const fs = require('fs');
const path = require('path');

const cssFile = path.join('d:', 'NeuroSense', 'frontend', 'src', 'App.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const newCSS = `
/* Enhanced Professional UI Overrides */
.module-card {
  background: var(--panel-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--panel-border);
  box-shadow: 0 4px 15px -3px rgba(15, 23, 42, 0.04), 0 2px 6px -2px rgba(15, 23, 42, 0.02);
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
}

.module-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px -8px rgba(139, 92, 246, 0.15), 0 4px 10px -4px rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.3);
}

.btn {
  font-family: "Inter", sans-serif;
  font-weight: 500;
  letter-spacing: 0.01em;
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(139, 92, 246, 0.4);
}

.btn-outline {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--panel-border);
}
.btn-outline:hover {
  background: rgba(139, 92, 246, 0.05);
  border-color: rgba(139, 92, 246, 0.3);
  color: var(--primary);
}

input[type="email"], select {
  font-family: "Inter", sans-serif;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}
input[type="email"]:focus, select:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.15) !important;
}
`;

if (!cssContent.includes('Enhanced Professional UI Overrides')) {
  fs.writeFileSync(cssFile, cssContent + "\n" + newCSS);
}

console.log("App.css updated with professional styling.");
