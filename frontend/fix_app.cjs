const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'NeuroSense', 'frontend', 'src', 'App.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Change Sidebar definition
code = code.replace(
  'function Sidebar() {',
  'function Sidebar({ setIsAuthenticated }: { setIsAuthenticated: (val: boolean) => void }) {'
);

// Add the Sign Out button to the end of Sidebar
const navEnd = '</nav>';
const signOutButton = `
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(15, 23, 42, 0.05)' }}>
        <button
          className="btn"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--panel-border)' }}
          onClick={() => setIsAuthenticated(false)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Sign Out
        </button>
      </div>
`;
code = code.replace(navEnd, navEnd + signOutButton);

// Update MainLayout to pass setIsAuthenticated to Sidebar and remove header
code = code.replace(
  '<Sidebar />',
  '<Sidebar setIsAuthenticated={setIsAuthenticated} />'
);

const headerStart = '<header className="app-navbar fade-in">';
const headerEnd = '</header>';
const headerStartIdx = code.indexOf(headerStart);
const headerEndIdx = code.indexOf(headerEnd) + headerEnd.length;

if (headerStartIdx !== -1 && headerEndIdx !== -1) {
  code = code.slice(0, headerStartIdx) + code.slice(headerEndIdx);
}

fs.writeFileSync(filePath, code);
console.log('App.tsx updated.');
