const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'NeuroSense', 'frontend', 'src', 'pages', 'ComprehensiveAssessment.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Replace any remaining handleMouseBalabitMove declaration entirely
code = code.replace(/const handleMouseBalabitMove = useCallback\([\s\S]*?\}, \[\]\);/g, '');

// Also any lingering mouseBalabit mentions inside the final report logic or submit logic
// In ComprehensiveAssessment.tsx, around line 514:
// `mouse_balabit: mouseBalabit.length > 0 ? mouseBalabit : undefined,`
code = code.replace(/mouse_balabit:[\s\S]*?,/g, '');

fs.writeFileSync(filePath, code);
console.log('Fixed mouseBalabit references.');
