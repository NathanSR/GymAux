-- ========================================================
-- GymAux - Migration v2: Reestruturação da Tabela exercises
-- ========================================================

-- 1. Sincronizar dados de 'is_public' para 'visibility' se a coluna ainda existir
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'exercises' AND column_name = 'is_public'
    ) THEN
        UPDATE exercises SET visibility = 'public' WHERE is_public = true AND (visibility IS NULL OR visibility = 'private');
    END IF;
END $$;

-- 2. Remover TODAS as políticas RLS antigas da tabela exercises
DROP POLICY IF EXISTS "Anyone can view public exercises" ON exercises;
DROP POLICY IF EXISTS "Allow select for everyone" ON exercises;
DROP POLICY IF EXISTS "Allow read for owner, public or shared users" ON exercises;
DROP POLICY IF EXISTS "Allow read exercises based on visibility" ON exercises;

-- 3. Remover as colunas obsoletas (Sem CASCADE, 100% seguro)
-- Como as políticas foram removidas acima, o comando DROP COLUMN roda limpo.
ALTER TABLE exercises DROP COLUMN IF EXISTS is_public;
ALTER TABLE exercises DROP COLUMN IF EXISTS media_url;

-- 4. Adicionar novas colunas para mídias e músculos secundários
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS image_url TEXT NULL;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS video_url TEXT NULL;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS gallery JSONB NULL DEFAULT '[]'::jsonb;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS secondary_muscles TEXT[] NULL DEFAULT '{}';

-- 5. Garantir a presença de colunas biomecânicas com valores default
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment VARCHAR(50) DEFAULT 'none';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS execution_mode VARCHAR(50) DEFAULT 'bilateral';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS mechanics VARCHAR(50) DEFAULT 'compound';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES exercises(id) ON DELETE SET NULL;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'public';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS shared_with UUID[] DEFAULT '{}';

-- 6. Recriar a política oficial de acesso RLS baseada em 'visibility'
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read exercises based on visibility" ON exercises
FOR SELECT USING (
  -- A. O próprio autor sempre pode ver
  auth.uid() = created_by
  OR
  -- B. Exercícios do sistema (ID < 1000 ou created_by_type = 'system') ou públicos
  created_by_type = 'system'
  OR
  visibility = 'public'
  OR
  -- C. Exercícios compartilhados com alunos/treinadores ativos
  (
    visibility = 'students' AND
    EXISTS (
      SELECT 1 FROM connections
      WHERE (
        (connections.trainer_id = exercises.created_by AND connections.student_id = auth.uid()) OR
        (connections.student_id = exercises.created_by AND connections.trainer_id = auth.uid())
      )
      AND connections.status = 'active'
    )
  )
  OR
  -- D. Exercícios restritos a usuários listados em shared_with
  (
    visibility = 'restricted' AND
    auth.uid() = ANY(shared_with)
  )
);
