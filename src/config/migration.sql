-- 1. Criar colunas adicionais na tabela exercises se elas não existirem
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment VARCHAR(50) DEFAULT 'none';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS execution_mode VARCHAR(50) DEFAULT 'bilateral';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS mechanics VARCHAR(50) DEFAULT 'compound';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL;

-- 2. Migração inteligente de dados baseada em palavras-chave no nome do exercício
-- Equipamentos:
UPDATE exercises SET equipment = 'dumbbell' WHERE name ILIKE '%halter%' OR name ILIKE '%dumb%' OR name ILIKE '%com halter%';
UPDATE exercises SET equipment = 'barbell' WHERE name ILIKE '%barra%' OR name ILIKE '%bar%' OR name ILIKE '%com barra%';
UPDATE exercises SET equipment = 'cable' WHERE name ILIKE '%cabo%' OR name ILIKE '%polia%' OR name ILIKE '%no cabo%' OR name ILIKE '%cross%';
UPDATE exercises SET equipment = 'machine' WHERE name ILIKE '%maquina%' OR name ILIKE '%máquina%' OR name ILIKE '%articulado%' OR name ILIKE '%press%';
UPDATE exercises SET equipment = 'smith' WHERE name ILIKE '%smith%' OR name ILIKE '%guiado%';
UPDATE exercises SET equipment = 'bodyweight' WHERE name ILIKE '%peso corporal%' OR name ILIKE '%flexão%' OR name ILIKE '%barra fixa%' OR name ILIKE '%graviton%' OR name ILIKE '%prancha%';

-- Modo de execução:
UPDATE exercises SET execution_mode = 'unilateral' WHERE name ILIKE '%unilateral%';
UPDATE exercises SET execution_mode = 'alternating' WHERE name ILIKE '%alternado%' OR name ILIKE '%alternada%';

-- Mecânica (Isoladores versus Compostos):
UPDATE exercises SET mechanics = 'isolation' WHERE 
  name ILIKE '%rosca%' OR 
  name ILIKE '%extensora%' OR 
  name ILIKE '%flexora%' OR 
  name ILIKE '%elevação lateral%' OR 
  name ILIKE '%crucifixo%' OR 
  name ILIKE '%voador%' OR 
  name ILIKE '%pec deck%' OR 
  name ILIKE '%triceps testa%' OR 
  name ILIKE '%coice%' OR
  name ILIKE '%panturrilha%';
