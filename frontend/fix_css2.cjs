const fs = require('fs');
const path = require('path');

const cssFile = path.join('d:', 'NeuroSense', 'frontend', 'src', 'App.css');
let cssContent = fs.readFileSync(cssFile, 'utf8');

const premiumCSS = `
/* Deep Premium Polish */
body {
  background-color: #f8fafc;
  background-image: 
    radial-gradient(circle at 0% 0%, rgba(139, 92, 246, 0.04) 0%, transparent 40%),
    radial-gradient(circle at 100% 100%, rgba(217, 70, 239, 0.04) 0%, transparent 40%);
}

.module-card {
  background: #ffffff;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.module-card:hover {
  transform: translateY(-4px) scale(1.01);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  border-color: rgba(139, 92, 246, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
  border: none;
  box-shadow: 0 4px 14px 0 rgba(139, 92, 246, 0.39);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
  background: linear-gradient(135deg, #936bf8, #8247e8);
}

.btn-outline {
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #475569;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.btn-outline:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #cbd5e1;
}

.sidebar-nav {
  margin-top: 1rem;
}

.sidebar-link {
  border-radius: 12px;
  margin: 0 0.5rem;
  padding: 0.875rem 1rem;
  transition: all 0.2s ease;
}

.sidebar-link.active {
  background: rgba(139, 92, 246, 0.1);
  color: #7c3aed;
  box-shadow: none;
  border-left: 3px solid #7c3aed;
}

.sidebar-link:not(.active):hover {
  background: rgba(241, 245, 249, 0.8);
}

input[type="email"], select {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background: #ffffff;
}

input[type="email"]:focus, select:focus {
  border-color: #8b5cf6 !important;
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1) !important;
}

h1, h2, h3 {
  color: #0f172a;
  letter-spacing: -0.03em;
}

p, span, div {
  color: #475569;
}
`;

if (!cssContent.includes('Deep Premium Polish')) {
  fs.writeFileSync(cssFile, cssContent + "\n" + premiumCSS);
}

console.log("Premium polish applied to App.css");
