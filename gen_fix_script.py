import base64
import os

layout_path = r'd:/new project/project3/frontend/admin-englishom/src/app/[locale]/admin/(protected)/layout.tsx'
try:
    with open(layout_path, 'rb') as f:
        layout_b64 = base64.b64encode(f.read()).decode()
except Exception as e:
    print(f"Error reading layout file: {e}")
    exit(1)

json_b64 = 'eyJ0aXRsZUFyIjoiTGV2ZWwgMSIsInRpdGxlRW4iOiJMZXZlbCAxIiwiZGVzY3JpcHRpb25BciI6IkRlc2MiLCJkZXNjcmlwdGlvbkVuIjoiRGVzYyIsInByaWNlIjoxMDAsImlzQXZhaWxhYmxlIjp0cnVlLCJsZXZlbF9uYW1lIjoiQTEifQ=='

sh_content = f"""#!/bin/bash
echo "Restoring layout.tsx..."
echo "{layout_b64}" | base64 -d > /var/www/englishom/frontend/admin-englishom/src/app/[locale]/admin/\(protected\)/layout.tsx

echo "Creating Level Payload..."
echo "{json_b64}" | base64 -d > /tmp/level_payload.json

echo "Creating Level via API..."
curl -v -X POST https://api.englishom.com/api/courses/admin -H "Content-Type: application/json" -d @/tmp/level_payload.json

echo "Rebuilding Admin..."
cd /var/www/englishom/frontend/admin-englishom
rm -rf .next
npm run build
pm2 restart admin-englishom
echo "Done!"
"""

print(base64.b64encode(sh_content.encode('utf-8')).decode())
