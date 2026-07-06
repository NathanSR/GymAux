# Arquitetura de Banco de Dados

O GymAux opera com uma arquitetura de banco de dados híbrida: **Local (RxDB com Dexie Storage)** para baixa latência e reatividade offline, e **Remoto (Supabase/PostgreSQL)** como fonte da verdade persistente e compartilhamento de dados.

---

## 1. Banco Local: RxDB

Configurado em `src/config/rxDatabase.ts`, o banco local utiliza o adaptador de armazenamento Dexie Storage, rodando sobre a API IndexedDB nativa do navegador para garantir estabilidade e portabilidade PWA.

### Coleções e JSON Schemas (`rxSchema.ts`)
* **`users`:** Armazena perfis dos usuários (`id`, `name`, `email`, `avatar`, `weight`, `height`, `goal`, `role`, `createdAt`, `updated_at`).
* **`exercises`:** Catálogo de exercícios (`id` como string, `created_by`, `created_by_type`, `name`, `description`, `category`, `tags` como array de strings, `howTo`, `mediaUrl`, `level`, `isPublic`, `updated_at`).
* **`workouts`:** Fichas de treino planejadas (`id`, `userId`, `createdBy`, `createdByType`, `name`, `createdAt`, `exercises` como JSON Array de grupos de exercícios, `description`, `updated_at`).
* **`schedules`:** Cronogramas semanais do usuário (`id`, `name`, `userId`, `createdBy`, `createdByType`, `workouts` como array de IDs, `startDate`, `endDate`, `active`, `lastCompleted`, `updated_at`).
* **`history`:** Histórico de sessões de treinos executadas pelo usuário (`id`, `userId`, `workoutId`, `workoutName`, `date`, `executions` como JSON Array de séries concluídas, `weight`, `description`, `duration`, `endDate`, `usingCreatine`, `updated_at`).
* **`sessions`:** Estado reativo da sessão de treino ativa no momento (`id`, `userId`, `workoutId`, `workoutName`, `createdAt`, `exercisesToDo`, `exercisesDone`, `current` objeto de estado do passo atual, `duration`, `pausedAt`, `resumedAt`, `isFinishedLocally`, `updated_at`).
* **`connections`:** Relacionamentos entre instrutores e alunos (`id`, `trainer_id`, `student_id`, `status`, `permissions` objeto JSON, `created_at`, `updated_at`).

### Estratégia de Seeding de Exercícios Padrões
* Exercícios do sistema (IDs de 1 a 999) são semeados a partir de `seedExercises.ts` na primeira inicialização do banco caso a coleção `exercises` esteja vazia.
* Exercícios criados por usuários iniciam com IDs gerados a partir do timestamp ou UUIDs, mapeados para o formato `String` exigido pela chave primária do RxDB.

---

## 2. Banco Remoto: Supabase (PostgreSQL)

O banco remoto atua como a base centralizada de persistência e colaboração. 

### Mapeamento de Atributos e Nomenclatura (snake_case <-> camelCase)
* O banco Postgres usa nomenclatura padrão do SQL em `snake_case` (ex: `user_id`, `created_at`, `updated_at`, `exercises_to_do`).
* O banco local RxDB adota convenção Javascript `camelCase` (ex: `userId`, `createdAt`, `updated_at`, `exercisesToDo`).
* A conversão recursiva de chaves é feita de forma transparente pela camada de replicação no `SyncReplicator` antes do envio (`push`) e recebimento (`pull`) de dados.

### Políticas de Segurança (RLS - Row Level Security)
* As tabelas protegidas (`workouts`, `history`, `schedules`, `sessions`) possuem RLS ativo baseado no ID de autenticação do Supabase (`auth.uid()`).
* A tabela `connections` gerencia permissões específicas (como `manage_workouts`, `manage_schedules`, `view_history`, `view_sessions`), controlando o fluxo de dados que cada instrutor pode visualizar e manipular referente aos seus alunos ativos.
