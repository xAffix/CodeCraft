import json
import os
import urllib.request

output_file = "/home/affi/.gemini/antigravity/brain/3532af22-a2f2-456a-96ae-253c026f312a/.system_generated/steps/15/output.txt"
temp_dir = "/home/affi/Desktop/CodeCraft/ui_temp"
os.makedirs(temp_dir, exist_ok=True)

with open(output_file, 'r') as f:
    data = json.load(f)

for i, screen in enumerate(data.get("screens", [])):
    title = screen.get("title", f"screen_{i}").replace(" | ", "_").replace(" ", "_").replace(".", "")
    html_url = screen.get("htmlCode", {}).get("downloadUrl")
    if html_url:
        print(f"Downloading {title}...")
        try:
            req = urllib.request.Request(html_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req) as response:
                html_content = response.read().decode('utf-8')
                with open(os.path.join(temp_dir, f"{title}.html"), "w") as out_f:
                    out_f.write(html_content)
        except Exception as e:
            print(f"Error downloading {title}: {e}")
print("Done downloading.")
