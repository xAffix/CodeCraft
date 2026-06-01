import os
import re

input_dir = "/home/affi/Desktop/CodeCraft/ui_temp"
output_dir = "/home/affi/Desktop/CodeCraft/ui/src/app"

def html_to_jsx(html):
    # Extract body content
    body_match = re.search(r'<body[^>]*>(.*?)</body>', html, re.DOTALL | re.IGNORECASE)
    if not body_match:
        return ""
    content = body_match.group(1)
    
    # Remove script tags
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL | re.IGNORECASE)
    
    # Convert attributes to JSX
    content = content.replace('class="', 'className="')
    content = content.replace('for="', 'htmlFor="')
    content = content.replace('onclick=', 'onClick=')
    content = content.replace('onsubmit=', 'onSubmit=')
    content = content.replace('onchange=', 'onChange=')
    content = content.replace('tabindex=', 'tabIndex=')
    content = content.replace('autocomplete=', 'autoComplete=')
    
    # Handle self-closing tags
    content = re.sub(r'<(input|img|br|hr|meta|link)([^>]*?)(?<!/)>', r'<\1\2 />', content)
    
    # Remove HTML comments to avoid JSX parsing issues (or replace with {/* */})
    content = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', content, flags=re.DOTALL)
    
    # Wrap in fragments just in case there are multiple roots
    return f"<>\n{content}\n</>"

def generate_page(name, jsx):
    return f"""'use client';
import React, {{ useEffect }} from 'react';

export default function {name}() {{
  useEffect(() => {{
    // Interactions can be added here
  }}, []);

  return (
    {jsx}
  );
}}
"""

for filename in os.listdir(input_dir):
    if filename.endswith(".html") and filename != "screen1.html":
        filepath = os.path.join(input_dir, filename)
        with open(filepath, 'r') as f:
            html = f.read()
            
        jsx = html_to_jsx(html)
        
        # Determine route name
        route_name = filename.replace("CodeCraft_", "").replace(".html", "").lower()
        if route_name == "access_terminal":
            route_dir = output_dir  # Make this the main page
        else:
            route_dir = os.path.join(output_dir, route_name)
            os.makedirs(route_dir, exist_ok=True)
            
        page_name = "".join(word.capitalize() for word in route_name.split("_"))
        
        with open(os.path.join(route_dir, "page.tsx"), "w") as out_f:
            out_f.write(generate_page(page_name, jsx))

print("Conversion complete.")
