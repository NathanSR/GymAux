
const fs = require('fs');
const path = require('path');

const filePath = 'c:/Users/NathanSR/Projects/gymaux-app/src/config/seedExercises.ts';
const content = fs.readFileSync(filePath, 'utf-8');

// Function to clean up values
const clean = (val) => val ? val.trim().replace(/^['"]|['"]$/g, '') : null;

// More robust extraction
// We want to skip commented out lines
const lines = content.split('\n');
const cleanLines = lines.filter(line => !line.trim().startsWith('//'));
const cleanContent = cleanLines.join('\n');

const objectRegex = /\{([\s\S]+?)\}/g;
let match;
let count = 0;
let sql = "-- Seed exercises\n";

while ((match = objectRegex.exec(cleanContent)) !== null) {
    const block = match[1];
    
    // Extract fields within the block
    const idMatch = block.match(/id:\s*(\d+)/);
    const nameMatch = block.match(/name:\s*["']([^"']+)["']/);
    const descMatch = block.match(/description:\s*["']([^"']+)["']/);
    const catMatch = block.match(/category:\s*["']([^"']+)["']/);
    const tagsMatch = block.match(/tags:\s*\[([\s\S]+?)\]/);
    const howToMatch = block.match(/howTo:\s*["']([^"']+)["']/);

    if (!idMatch || !nameMatch) continue;

    const id = idMatch[1];
    const name = nameMatch[1];
    const description = descMatch ? descMatch[1] : '';
    const category = catMatch ? catMatch[1] : '';
    const tagsRaw = tagsMatch ? tagsMatch[1] : '';
    const howTo = howToMatch ? howToMatch[1] : '';

    const tags = tagsRaw.split(',').map(t => clean(t)).filter(t => t);
    const tagsSql = tags.length > 0 ? "ARRAY[" + tags.map(t => `'${t}'`).join(', ') + "]" : "ARRAY[]::text[]";

    sql += `INSERT INTO exercises (id, name, description, category, tags, how_to, created_by_type, is_public, created_by) VALUES (${id}, '${name}', '${description}', '${category}', ${tagsSql}, '${howTo}', 'system', true, null) ON CONFLICT (id) DO NOTHING;\n`;
    count++;
}

fs.writeFileSync('c:/Users/NathanSR/Projects/gymaux-app/seed_exercises.sql', sql);
console.log(`Generated SQL with ${count} exercises.`);
