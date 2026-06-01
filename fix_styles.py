import os
import re

input_dir = "/home/affi/Desktop/CodeCraft/ui/src/app"

def fix_styles_in_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Fix style="font-variation-settings: 'FILL' 1;"
    content = re.sub(r'style="font-variation-settings: \'FILL\' (\d+);"', r'style={{ fontVariationSettings: "\'FILL\' \1" }}', content)
    
    # Fix style="animation-delay: 2s;"
    content = re.sub(r'style="animation-delay: ([^"]+);"', r'style={{ animationDelay: "\1" }}', content)

    # General fallback for any other style="k: v;"
    def generic_style_replacer(match):
        style_content = match.group(1)
        # simplistic conversion
        parts = style_content.split(";")
        new_styles = []
        for p in parts:
            if not p.strip(): continue
            k, v = p.split(":", 1)
            k = k.strip()
            # camelCase the key
            k = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), k)
            v = v.strip().replace("'", "\\'")
            new_styles.append(f"{k}: '{v}'")
        return 'style={{ ' + ", ".join(new_styles) + ' }}'
        
    content = re.sub(r'style="([^"]+)"', generic_style_replacer, content)
    
    with open(filepath, 'w') as f:
        f.write(content)

for root, dirs, files in os.walk(input_dir):
    for filename in files:
        if filename.endswith(".tsx"):
            fix_styles_in_file(os.path.join(root, filename))

print("Fixed styles.")
