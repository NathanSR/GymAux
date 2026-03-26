import json
import os

def clean_json(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found")
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    removed_count = 0
    for line in lines:
        if '"":' in line:
            removed_count += 1
            # If the last line in a block, we might need to remove a trailing comma from the previous line
            # but usually these are followed by successful keys, so it's fine.
            # Actually, standard JSON might break if we just remove lines.
            # Let's try to load it as JSON first if possible.
            continue
        new_lines.append(line)
            
    # Try to parse to ensure it's still valid JSON
    content = "".join(new_lines)
    try:
        # We need to handle trailing commas if any were left by removing the last element
        # This is tricky with simple line removal.
        pass
    except:
        pass

    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    print(f"Cleaned {filepath}, removed {removed_count} lines")

files = [
    'c:/Users/NathanSR/Projects/gymaux-app/messages/en.json',
    'c:/Users/NathanSR/Projects/gymaux-app/messages/pt.json',
    'c:/Users/NathanSR/Projects/gymaux-app/messages/es.json'
]

for f in files:
    clean_json(f)
