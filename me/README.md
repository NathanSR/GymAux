# Documentação de Engenharia - GymAux

Esta pasta contém a documentação técnica da arquitetura, stack, padrões de projeto e banco de dados do **GymAux**. A documentação é organizada em arquivos modulares e objetivos:

* **[Arquitetura do Sistema (architecture.md)](file:///c:/Users/NathanSR/Projects/gymaux-app/me/architecture.md)**
  * Visão geral do fluxo Offline-First, divisão de responsabilidades em camadas e visão geral do diretório de código.
* **[Stack Tecnológica (stack.md)](file:///c:/Users/NathanSR/Projects/gymaux-app/me/stack.md)**
  * Detalhamento das tecnologias e bibliotecas utilizadas no frontend (Next.js/Tailwind v4), banco local (RxDB) e backend (Supabase).
* **[Padrões de Projeto (patterns.md)](file:///c:/Users/NathanSR/Projects/gymaux-app/me/patterns.md)**
  * Padrões de sincronização assíncrona, Service Layer, separação de estados via React Contexts e roteamento localizado.
* **[Arquitetura de Banco de Dados (database.md)](file:///c:/Users/NathanSR/Projects/gymaux-app/me/database.md)**
  * Estrutura de tabelas locais (RxDB), políticas de RLS no Supabase, auto-recuperação de cache e reserva de namespaces de IDs.
