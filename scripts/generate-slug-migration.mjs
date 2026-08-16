import fs from 'fs';
import path from 'path';

const seedPath = path.join(process.cwd(), '_temp', 'seed_exercises.sql');
const content = fs.readFileSync(seedPath, 'utf8');
const lines = content.split('\n');

const updates = [];
const valuesList = [];

for (const line of lines) {
    if (!line.trim().startsWith('INSERT INTO exercises')) continue;
    const match = line.match(/VALUES\s*\(\s*(\d+)\s*,\s*'([^']+)'/i);
    if (match) {
        const id = parseInt(match[1]);
        const name = match[2];
        updates.push({ id, name });
        valuesList.push(`  (${id}, '${name}')`);
    }
}

console.log(`Total de exercícios extraídos: ${updates.length}`);

const sqlContent = `-- ========================================================
-- GymAux - Atualização da coluna 'name' dos exercícios
-- Base de dados de referência: _temp/seed_exercises.sql
-- Total de exercícios mapeados: ${updates.length}
-- ========================================================

-- Atualização em lote da coluna 'name' de acordo com o ID de cada exercício
UPDATE exercises AS e
SET name = v.name
FROM (
  VALUES
${valuesList.join(',\n')}
) AS v(id, name)
WHERE e.id = v.id;
`;

const outputPath1 = path.join(process.cwd(), 'scripts', 'add_slug_to_exercises.sql');
const outputPath2 = path.join(process.cwd(), '_temp', 'add_slug_to_exercises.sql');

fs.writeFileSync(outputPath1, sqlContent, 'utf8');
fs.writeFileSync(outputPath2, sqlContent, 'utf8');

console.log(`Arquivo gerado em: ${outputPath1}`);
console.log(`Arquivo gerado em: ${outputPath2}`);
