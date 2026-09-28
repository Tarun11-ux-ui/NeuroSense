const fs = require('fs');
const path = require('path');

const historyFile = path.join('d:', 'NeuroSense', 'frontend', 'src', 'pages', 'History.tsx');
let historyCode = fs.readFileSync(historyFile, 'utf8');

historyCode = historyCode.replace(
  /<div style={{ display: "flex", gap: "3rem", flex: "2" }}>/g,
  '<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", gap: "1.5rem", flex: "2", alignItems: "center" }}>'
);
historyCode = historyCode.replace(
  /<div style={{ display: "flex", alignItems: "center", gap: "1.5rem", flex: "0.5", justifyContent: "flex-end" }}>/g,
  '<div style={{ display: "flex", alignItems: "center", gap: "1rem", flex: "0.8", justifyContent: "flex-end" }}>'
);
historyCode = historyCode.replace(
  /<div key=\{session\.id\} className="module-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", cursor: "pointer" }}>/g,
  '<div key={session.id} className="module-card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", cursor: "pointer", gap: "1rem" }}>'
);
fs.writeFileSync(historyFile, historyCode);

const reportsFile = path.join('d:', 'NeuroSense', 'frontend', 'src', 'pages', 'Reports.tsx');
let reportsCode = fs.readFileSync(reportsFile, 'utf8');
reportsCode = reportsCode.replace(
  /<div key=\{report\.id\} className="module-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem" }}>/g,
  '<div key={report.id} className="module-card" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 1.5rem", gap: "1rem" }}>'
);
reportsCode = reportsCode.replace(
  /<div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>/g,
  '<div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem" }}>'
);
fs.writeFileSync(reportsFile, reportsCode);

const settingsFile = path.join('d:', 'NeuroSense', 'frontend', 'src', 'pages', 'Settings.tsx');
let settingsCode = fs.readFileSync(settingsFile, 'utf8');
settingsCode = settingsCode.replace(
  /gridTemplateColumns: "1fr 2fr"/g,
  'gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))"'
);
fs.writeFileSync(settingsFile, settingsCode);

console.log("Pages fixed!");
