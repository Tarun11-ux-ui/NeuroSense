import requests
import json

BASE_URL = "http://localhost:8000"

def test_deep_analysis():
    print("Testing Full System Integration...")
    
    # Test 1: Predict
    print("\n--- Testing /api/predict ---")
    payload = {
        "patient_id": "PT-TEST",
        "keystroke": [
            {"key": "a", "action": "keydown", "time": 1000},
            {"key": "a", "action": "keyup", "time": 1150}
        ],
        "reaction": [
            {"time": 400}
        ],
        "mouse_dfl": [
            {"x": 100, "y": 200, "time": 1000},
            {"x": 150, "y": 250, "time": 1100}
        ],
        "facial": [
            {"ear": 0.25, "mar": 0.05, "timestamp": 0.1}
        ]
    }
    
    res = requests.post(f"{BASE_URL}/api/predict", json=payload)
    print("Predict Status:", res.status_code)
    try:
        data = res.json()
        print("Overall Score:", data.get("result", {}).get("overall_score"))
        print("Reaction Output:", data.get("result", {}).get("modalities", {}).get("reaction"))
        print("Facial Output:", data.get("result", {}).get("modalities", {}).get("facial"))
        print("Explainable AI:", data.get("result", {}).get("fusion", {}).get("explainable_ai", {}).get("recommendation"))
    except Exception as e:
        print("Error parsing predict response:", e, res.text)
        
    # Test 2: Patients List
    print("\n--- Testing /api/patients ---")
    res = requests.get(f"{BASE_URL}/api/patients")
    print("Patients Status:", res.status_code)
    print("Patients Data:", res.json())
    
    # Test 3: Patient History
    print("\n--- Testing /api/patients/PT-TEST/history ---")
    res = requests.get(f"{BASE_URL}/api/patients/PT-TEST/history")
    print("History Status:", res.status_code)
    print("History Data:", res.json())

if __name__ == "__main__":
    test_deep_analysis()
