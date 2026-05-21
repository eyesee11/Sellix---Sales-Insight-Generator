import urllib.request, urllib.parse, json
import uuid

data = urllib.parse.urlencode({'username': 'demo@example.com', 'password': 'demo_password'}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/auth/login', data=data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
resp = urllib.request.urlopen(req)
token = json.loads(resp.read().decode())['access_token']

boundary = uuid.uuid4().hex
body = (
    f'--{boundary}\r\n'
    'Content-Disposition: form-data; name="email"\r\n\r\n'
    'demo@example.com\r\n'
    f'--{boundary}\r\n'
    'Content-Disposition: form-data; name="file"; filename="test.csv"\r\n'
    'Content-Type: text/csv\r\n\r\n'
    'Region,Revenue,Units\r\nNorth,100,2\r\n'
    f'--{boundary}--\r\n'
)

req2 = urllib.request.Request('http://localhost:8000/api/v1/upload', data=body.encode('utf-8'), method='POST')
req2.add_header('Authorization', f'Bearer {token}')
req2.add_header('Content-Type', f'multipart/form-data; boundary={boundary}')

try:
    print(urllib.request.urlopen(req2).read().decode())
except Exception as e:
    print(e.read().decode())
