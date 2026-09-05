-- ==============================================================================
-- GYMAUX - MIGRATION DE SEGURANÇA E HARDENING DO BANCO DE DADOS E STORAGE
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. FUNÇÕES HELPER DE AUTORIZAÇÃO (SECURITY DEFINER - SEM RECURSÃO DE RLS)
-- ------------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role = 'admin' FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

CREATE OR REPLACE FUNCTION public.is_admin_or_moderator()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT COALESCE(
    (SELECT role IN ('admin', 'moderator') FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_or_moderator() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin_or_moderator() FROM anon, PUBLIC;


-- ------------------------------------------------------------------------------
-- 2. HARDENING DO SUPABASE STORAGE (BUCKETS & POLICIES)
-- ------------------------------------------------------------------------------

-- 2.1 Configurar limites e tipos MIME permitidos nos buckets (estritamente WebP / WebM)
UPDATE storage.buckets
SET 
    allowed_mime_types = ARRAY['image/webp', 'image/svg+xml'],
    file_size_limit = 2097152 -- 2 MB
WHERE id IN ('categories', 'equipments');

UPDATE storage.buckets
SET 
    allowed_mime_types = ARRAY['image/webp', 'video/webm'],
    file_size_limit = 15728640 -- 15 MB
WHERE id = 'exercises';

-- 2.2 Remover políticas abertas de escrita que concediam ALL para {public}
DROP POLICY IF EXISTS "Admin/public write categories" ON storage.objects;
DROP POLICY IF EXISTS "Admin/public write equipments" ON storage.objects;
DROP POLICY IF EXISTS "Admin/public write exercises" ON storage.objects;

-- 2.3 Criar políticas de escrita restritas para administradores e moderadores
DROP POLICY IF EXISTS "Admins and moderators write categories" ON storage.objects;
CREATE POLICY "Admins and moderators write categories" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'categories' AND public.is_admin_or_moderator())
WITH CHECK (bucket_id = 'categories' AND public.is_admin_or_moderator());

DROP POLICY IF EXISTS "Admins and moderators write equipments" ON storage.objects;
CREATE POLICY "Admins and moderators write equipments" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'equipments' AND public.is_admin_or_moderator())
WITH CHECK (bucket_id = 'equipments' AND public.is_admin_or_moderator());

DROP POLICY IF EXISTS "Admins and moderators write exercises" ON storage.objects;
CREATE POLICY "Admins and moderators write exercises" ON storage.objects
FOR ALL TO authenticated
USING (bucket_id = 'exercises' AND public.is_admin_or_moderator())
WITH CHECK (bucket_id = 'exercises' AND public.is_admin_or_moderator());

-- Garantir que as leituras públicas (SELECT) permaneçam ativas para carregar mídias
DROP POLICY IF EXISTS "Public read categories" ON storage.objects;
CREATE POLICY "Public read categories" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'categories');

DROP POLICY IF EXISTS "Public read equipments" ON storage.objects;
CREATE POLICY "Public read equipments" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'equipments');

DROP POLICY IF EXISTS "Public read exercises" ON storage.objects;
CREATE POLICY "Public read exercises" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'exercises');


-- ------------------------------------------------------------------------------
-- 3. HARDENING DE FUNÇÕES & PROCEDURES (REVOGAÇÃO DE ANON & SEARCH_PATH)
-- ------------------------------------------------------------------------------

-- 3.1 Revogar execução pública da rotina administrativa bulk_sync_exercises
REVOKE EXECUTE ON FUNCTION public.bulk_sync_exercises(jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.bulk_sync_exercises(jsonb) TO service_role;
ALTER FUNCTION public.bulk_sync_exercises(jsonb) SET search_path = '';

-- 3.2 Revogar execução de handle_new_user para anon e PUBLIC (disparado via trigger interno)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
ALTER FUNCTION public.handle_new_user() SET search_path = '';

-- 3.3 Fixar search_path em update_updated_at_column
ALTER FUNCTION public.update_updated_at_column() SET search_path = '';


-- ------------------------------------------------------------------------------
-- 4. HARDENING DA TABELA PROFILES (ANTI-VAZAMENTO E ANTI-ESCALAÇÃO DE PRIVILÉGIOS)
-- ------------------------------------------------------------------------------

-- 4.1 Remover política permissiva aberta que expunha e-mails e dados de saúde de todos
DROP POLICY IF EXISTS "Profiles are searchable by anyone" ON public.profiles;

-- 4.2 Administradores podem visualizar perfis (usando a função is_admin sem recursão)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT TO authenticated
USING (public.is_admin());

-- 4.3 Trigger no PostgreSQL para impedir que usuários comuns alterem seu próprio 'role'
CREATE OR REPLACE FUNCTION public.protect_profile_role_update()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role IS DISTINCT FROM OLD.role THEN
        IF NOT public.is_admin() AND auth.uid() IS NOT NULL THEN
            RAISE EXCEPTION 'Acesso negado: apenas administradores podem alterar permissões de usuário (role).';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

DROP TRIGGER IF EXISTS tr_protect_profile_role_update ON public.profiles;
CREATE TRIGGER tr_protect_profile_role_update
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_profile_role_update();

-- 4.4 Reforçar a política de UPDATE com WITH CHECK explícito
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 4.5 Criar RPC segura para busca pública de treinador/aluno sem vazar PII (peso, altura, email)
CREATE OR REPLACE FUNCTION public.search_profiles_public(search_term text)
RETURNS TABLE (
    id uuid,
    name text,
    avatar text,
    gymaux_id text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
    SELECT id, name, avatar, gymaux_id
    FROM public.profiles
    WHERE (
        gymaux_id = search_term
        OR lower(email) = lower(search_term)
        OR name ILIKE '%' || search_term || '%'
    )
    LIMIT 10;
$$;

GRANT EXECUTE ON FUNCTION public.search_profiles_public(text) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.search_profiles_public(text) FROM anon, PUBLIC;


-- ------------------------------------------------------------------------------
-- 5. HARDENING DA TABELA CONNECTIONS (TREINADOR X ALUNO SEGURO)
-- ------------------------------------------------------------------------------

-- 5.1 Garantir que convites de conexão nasçam estritamente como 'pending'
DROP POLICY IF EXISTS "Trainers can initiate connections" ON public.connections;
DROP POLICY IF EXISTS "Trainers can initiate connections with pending status" ON public.connections;
CREATE POLICY "Trainers can initiate connections with pending status" ON public.connections
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = trainer_id AND status = 'pending');

-- 5.2 Permitir que treinador ou aluno excluam/desvinculem a conexão a qualquer momento
DROP POLICY IF EXISTS "Users can delete their own connections" ON public.connections;
CREATE POLICY "Users can delete their own connections" ON public.connections
FOR DELETE TO authenticated
USING (auth.uid() = trainer_id OR auth.uid() = student_id);


-- ------------------------------------------------------------------------------
-- 6. POLÍTICAS DE ADMIN GLOBAL (VISUALIZAÇÃO DE TREINOS, SESSÕES, HISTÓRICO)
-- ------------------------------------------------------------------------------

DROP POLICY IF EXISTS "Admins can view all workouts" ON public.workouts;
CREATE POLICY "Admins can view all workouts" ON public.workouts
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all sessions" ON public.sessions;
CREATE POLICY "Admins can view all sessions" ON public.sessions
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all history" ON public.history;
CREATE POLICY "Admins can view all history" ON public.history
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can view all schedules" ON public.schedules;
CREATE POLICY "Admins can view all schedules" ON public.schedules
FOR SELECT TO authenticated
USING (public.is_admin());

DROP POLICY IF EXISTS "Admins and Moderators can manage all exercises" ON public.exercises;
CREATE POLICY "Admins and Moderators can manage all exercises" ON public.exercises
FOR ALL TO authenticated
USING (public.is_admin_or_moderator())
WITH CHECK (public.is_admin_or_moderator());

DROP POLICY IF EXISTS "Admins and moderators can manage categories" ON public.categories;
CREATE POLICY "Admins and moderators can manage categories" ON public.categories
FOR ALL TO authenticated
USING (public.is_admin_or_moderator())
WITH CHECK (public.is_admin_or_moderator());

DROP POLICY IF EXISTS "Admins and moderators can manage equipment" ON public.equipments;
CREATE POLICY "Admins and moderators can manage equipment" ON public.equipments
FOR ALL TO authenticated
USING (public.is_admin_or_moderator())
WITH CHECK (public.is_admin_or_moderator());
