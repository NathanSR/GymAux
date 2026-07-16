-- 1. ADICIONAR COLUNAS NA TABELA EXERCISES
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS visibility VARCHAR(20) DEFAULT 'private';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS shared_with UUID[] DEFAULT '{}';

-- 2. MIGRAR DADOS ANTIGOS DE 'is_public' PARA 'visibility'
-- Caso seja público (sistema ou admin), vira 'public'. Caso contrário, 'private'.
UPDATE exercises SET visibility = 'public' WHERE is_public = true;
UPDATE exercises SET visibility = 'private' WHERE is_public = false OR is_public IS NULL;

-- 3. ATUALIZAR POLÍTICA DE LEITURA (SELECT) DE EXERCÍCIOS
-- Primeiro removemos políticas antigas que possam interferir na leitura
DROP POLICY IF EXISTS "Allow read for owner, public or shared users" ON exercises;
DROP POLICY IF EXISTS "Allow select for everyone" ON exercises;
DROP POLICY IF EXISTS "Allow read exercises based on visibility" ON exercises;

-- Criamos a nova política de acesso baseado em visibilidade
CREATE POLICY "Allow read exercises based on visibility" ON exercises
FOR SELECT USING (
  -- 1. O criador sempre pode ver seu próprio exercício
  auth.uid() = created_by
  OR
  -- 2. Exercícios públicos são visíveis para qualquer pessoa
  visibility = 'public'
  OR
  -- 3. Exercícios compartilhados com conexões são visíveis se houver conexão ativa (aluno/treinador)
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
  -- 4. Exercícios com visibilidade restrita são visíveis para usuários listados em shared_with
  (
    visibility = 'restricted' AND
    auth.uid() = ANY(shared_with)
  )
);
