
import re
import json

def parse_exercises(content):
    # This regex is a bit naive but should work for this specific file structure
    # It looks for blocks like { id: ..., name: ..., ... }
    exercise_blocks = re.findall(r'\{\s+id: (\d+),\s+name: "([^"]+)",\s+description: "([^"]+)",\s+category: "([^"]+)",\s+tags: \[([^\]]+)\],\s+howTo: "([^"]+)"\s+\}', content)
    
    exercises = []
    for block in exercise_blocks:
        tags = [t.strip().strip('"').strip("'") for t in block[4].split(',')]
        exercises.append({
            "id": int(block[0]),
            "name": block[1],
            "description": block[2],
            "category": block[3],
            "tags": tags,
            "how_to": block[5],
            "created_by_type": 'system',
            "is_public": True,
            "created_by": None
        })
    return exercises

with open('c:/Users/NathanSR/Projects/gymaux-app/src/config/seedExercises.ts', 'r', encoding='utf-8') as f:
    content = f.read()

exercises = parse_exercises(content)

# Generate SQL
sql = "-- Seed exercises\n"
for ex in exercises:
    tags_sql = "ARRAY[" + ", ".join([f"'{t}'" for t in ex['tags']]) + "]"
    sql += f"INSERT INTO exercises (id, name, description, category, tags, how_to, created_by_type, is_public, created_by) VALUES ({ex['id']}, '{ex['name']}', '{ex['description']}', '{ex['category']}', {tags_sql}, '{ex['how_to']}', 'system', true, null) ON CONFLICT (id) DO NOTHING;\n"

with open('c:/Users/NathanSR/Projects/gymaux-app/seed_exercises.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print(f"Generated SQL with {len(exercises)} exercises.")
