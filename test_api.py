import urllib.request
import json
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

url = "http://127.0.0.1:8000/api/auth/login/"
data = json.dumps({"email": "government@medcode.demo", "password": "MedCode@12345!"}).encode('utf-8')
req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        res = json.loads(response.read().decode())
        token = res.get('data', {}).get('access')
        print("Login obtained token")

        req2 = urllib.request.Request("http://127.0.0.1:8000/api/government/dashboard/", headers={'Authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req2) as r2:
            print("Dashboard:", r2.read().decode()[:100])
except Exception as e:
    print("Error:", str(e))
    if hasattr(e, 'read'):
        print("Body:", e.read().decode())
