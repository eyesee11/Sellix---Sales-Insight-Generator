import urllib.request
import urllib.error
import uuid

url = 'https://sellix-sales-insight-generator.onrender.com/api/v1/upload'
boundary = uuid.uuid4().hex

with open('../sales_q1_2026.csv', 'rb') as f:
    file_content = f.read()

body = (
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="email"\r\n\r\n'
    f'ayushchauhan1164@gmail.com\r\n'
    f'--{boundary}\r\n'
    f'Content-Disposition: form-data; name="file"; filename="sales_q1_2026.csv"\r\n'
    f'Content-Type: text/csv\r\n\r\n'
).encode('utf-8') + file_content + f'\r\n--{boundary}--\r\n'.encode('utf-8')

req = urllib.request.Request(url, data=body, headers={
    'Content-Type': f'multipart/form-data; boundary={boundary}'
})

try:
    with urllib.request.urlopen(req) as response:
        print('Status:', response.getcode())
        print('Response:', response.read().decode())
except urllib.error.HTTPError as e:
    print('Status:', e.code)
    print('Response:', e.read().decode())
except Exception as e:
    print('Error:', str(e))
