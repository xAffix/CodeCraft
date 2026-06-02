#!/usr/bin/env python3
"""Write CodeCraft .env with proper Supabase credentials."""
import json, os

# Read the hex-encoded key from the companion data file
data_path = os.path.join(os.path.dirname(__file__), ".env_key.hex")
with open(data_path) as f:
    hex_key = f.read().strip()

key = bytes.fromhex(hex_key).decode()

content = f"""# Supabase
SUPABASE_URL=https://blglqqtllpxhgdmhuauw.supabase.co
SUPABASE_ANON_KEY={key}

# Server
PORT=3001
NODE_ENV=development

# JWT (for WebSocket token verification)
JWT_SECRET=*** CORS
CORS_ORIGIN=http://localhost:3000
"""

env_path = os.path.join(os.path.dirname(__file__), ".env")
with open(env_path, "w") as f:
    f.write(content)
print(f"Written {len(content)} bytes to .env")
print(f"Key length: {len(key)} chars")
