import re

filepath = r"d:\NeuroSense\frontend\src\pages\ComprehensiveAssessment.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update stepper rendering variables
content = content.replace('step < 6', 'step < 5')
content = content.replace('step / 6', 'step / 5')
content = content.replace('step === 6', 'step === 5')
content = content.replace('6 modalities', '5 modalities')
content = content.replace('step === 6 ? "" : "module-card"', 'step === 5 ? "" : "module-card"')
content = content.replace('padding: step === 6 ? "0" : "2.5rem"', 'padding: step === 5 ? "0" : "2.5rem"')

# 2. Update array mapping
content = content.replace('["Typing", "Mouse 1", "Mouse 2", "Voice", "Gait", "Spiral"]', '["Typing", "Mouse", "Spiral", "Voice", "Gait"]')

# 3. Extract the cases
# case 0: Typing (0 -> 1)
# case 1: Mouse (1 -> 2)
# case 2: Mouse 2 (discard)
# case 3: Voice (3 -> 4)
# case 4: Gait (4 -> 5)
# case 5: Spiral (2 -> 3)
# case 6: Report

# Let's find the cases using split
parts = content.split("      case 0:")
before_cases = parts[0]
cases_content = "      case 0:" + parts[1]

# Split cases_content by "      case "
c0 = cases_content.split("      case 1:")[0]
rest1 = "      case 1:" + cases_content.split("      case 1:")[1]

c1 = rest1.split("      case 2:")[0]
rest2 = "      case 2:" + rest1.split("      case 2:")[1]

c2 = rest2.split("      case 3:")[0]
rest3 = "      case 3:" + rest2.split("      case 3:")[1]

c3 = rest3.split("      case 4:")[0]
rest4 = "      case 4:" + rest3.split("      case 4:")[1]

c4 = rest4.split("      case 5:")[0]
rest5 = "      case 5:" + rest4.split("      case 5:")[1]

c5 = rest5.split("      case 6:")[0]
c6 = "      case 6:" + rest5.split("      case 6:")[1]

# Update the next step references
# c0 (Typing) -> goes to 1. Correct.
# c1 (Mouse) -> goes to 2 (Spiral). Change goToNextStep(2) inside c1 if it is not already. (It is goToNextStep(2))
# c2 is discarded.
# c3 (Voice) -> goes to 4. Correct.
# c4 (Gait) -> goes to 5 (Report). Change goToNextStep(5) to goToNextStep(5). (It is already 5).
# c5 (Spiral) -> goes to 3 (Voice). Change goToNextStep(6) to goToNextStep(3). Change `setStep(4)` in Previous to `setStep(1)`.
c5 = c5.replace("goToNextStep(6)", "goToNextStep(3)")
c5 = c5.replace("setStep(4)", "setStep(1)")

# c3 (Voice) -> goes to 4. Previous should be 2 (Spiral).
c3 = c3.replace("setStep(2)", "setStep(2)") # Wait, voice previous was 2, which was Mouse 2. Now it should be Spiral, which is 2. So setStep(2) is correct.
# Wait, let's fix the Previous buttons carefully:
# c0: no prev
# c1 (Mouse): setStep(0)
c1 = c1.replace("Mouse Tracking (DFL)", "Mouse Tracking")
# c5 (Spiral, now 2): setStep(1)
c5 = c5.replace("      case 5:", "      case 2:")
c5 = c5.replace("setStep(4)", "setStep(1)")
# c3 (Voice, now 3): setStep(2)
# c4 (Gait, now 4): setStep(3)
c4 = c4.replace("setStep(3)", "setStep(3)")

# c6 (Report, now 5):
c6 = c6.replace("      case 6:", "      case 5:")

new_cases_content = c0 + c1 + c5 + c3 + c4 + c6

new_content = before_cases + new_cases_content

with open(filepath, "w", encoding="utf-8") as f:
    f.write(new_content)
print("Updated successfully")
