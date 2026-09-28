const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'NeuroSense', 'frontend', 'src', 'pages', 'ComprehensiveAssessment.tsx');
let code = fs.readFileSync(filePath, 'utf8');

// Update variables
code = code.replace(/step < 6/g, 'step < 5');
code = code.replace(/step \/ 6/g, 'step / 5');
code = code.replace(/step === 6/g, 'step === 5');
code = code.replace(/6 modalities/g, '5 modalities');
code = code.replace(/\["Typing", "Mouse 1", "Mouse 2", "Voice", "Gait", "Spiral"\]/g, '["Typing", "Mouse", "Spiral", "Voice", "Gait"]');

// We need to safely remove case 2 entirely
// First, find 'case 2:'
const case2Start = code.indexOf('      case 2:');
const case3Start = code.indexOf('      case 3:');

if (case2Start !== -1 && case3Start !== -1) {
    // Remove case 2
    code = code.slice(0, case2Start) + code.slice(case3Start);
}

// Now renumber cases
// case 3 -> case 3 (Wait, Spiral was 5, now we want it to be 2)
// Current order:
// 0: Typing
// 1: Mouse 1 (DFL)
// 3: Voice
// 4: Gait
// 5: Spiral
// We want:
// 0: Typing
// 1: Mouse
// 2: Spiral
// 3: Voice
// 4: Gait
// 5: Report

// Let's replace 'case 5:' with 'case 2:'
// Wait, we need to swap them carefully.
const case5Regex = /case 5:([\s\S]*?)(?=case 6:)/;
const case5Match = code.match(case5Regex);
const case5Content = case5Match ? case5Match[0] : '';
code = code.replace(case5Content, '');

// Rename case 6 to case 5
code = code.replace('case 6:', 'case 5:');

// Insert old case 5 content right before case 3 and rename to case 2
const newCase2Content = case5Content.replace('case 5:', 'case 2:');
code = code.replace('case 3:', newCase2Content + '\n      case 3:');

// Now update navigation inside the cases
// Typing (0) goes to 1. Correct.
// Mouse (1) goes to 2 (Spiral). So goToNextStep(2).
// Spiral (2) goes to 3 (Voice). It previously went to 6.
code = code.replace(/goToNextStep\(6\)/g, 'goToNextStep(3)');
// The 'Previous' in Spiral (2) went to 4. We want it to go to 1 (Mouse).
// But we need to target specifically Spiral's setStep.
// Let's just do a regex replace inside the Spiral block:
// We can do this directly in newCase2Content:
let fixedCase2 = newCase2Content.replace(/goToNextStep\(6\)/g, 'goToNextStep(3)');
fixedCase2 = fixedCase2.replace(/setStep\(4\)/g, 'setStep(1)');
code = code.replace(newCase2Content, fixedCase2);

// Voice (3) goes to 4 (Gait). It previously went to 4. Correct.
// Previous in Voice (3) went to 2 (Mouse 2). Now it should go to 2 (Spiral). So setStep(2).
code = code.replace(/setStep\(2\)/g, 'setStep(2)'); // No change needed

// Gait (4) goes to 5 (Report). It previously went to 5 (Spiral).
// Let's change goToNextStep(5) to goToNextStep(5) inside Gait block. Wait, goToNextStep(5) is already 5, so it naturally goes to Report now!
// The Previous in Gait (4) went to 3 (Voice). Correct.

// Fix implicit any
code = code.replace(/\.find\(\(m\)/g, '.find((m: any)');
code = code.replace(/const handleMouseBalabitMove[\s\S]*?\}, \[\]\);/g, '');


fs.writeFileSync(filePath, code);
console.log('Migration complete');
