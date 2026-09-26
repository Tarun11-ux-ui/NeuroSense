import requests

url = "http://127.0.0.1:8000/api/predict"
payload = {
  "patient_id": "test",
  "keystroke": [
    {
      "key": "a",
      "press": 1234.0,
      "release": 1234.1,
      "hold": 0.1
    }
  ]
}

import jwt
import datetime

SECRET_KEY = "NEUROSENSE_SECRET_MVP_KEY_X82"
ALGORITHM = "HS256"
token_expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
token = jwt.encode({"sub": "test@example.com", "exp": token_expiry}, SECRET_KEY, algorithm=ALGORITHM)

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
}

try:
    print("Testing backend predict endpoint...")
    res = requests.post(url, json=payload, headers=headers)
    print("Status:", res.status_code)
    print("Response:", res.text)
except Exception as e:
    print(f"Error: {e}")
