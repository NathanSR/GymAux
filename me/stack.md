# Stack Tecnológica

A stack do **GymAux** foi selecionada com foco em performance local, desenvolvimento ágil, portabilidade PWA e capacidades offline.

---

## Núcleo & Framework
* **Next.js (v16.1.1) & React (v19.2.3):** Uso do *App Router* para roteamento otimizado, renderização híbrida (SSR + CSR) e *React Server Components* (RSC) para carregar layouts estáticos de forma instantânea.
* **TypeScript (v5.x):** Tipagem estática em toda a base de código, garantindo manutenibilidade e autocompletação estrita para os modelos de treino e banco de dados.

## Estilização & UI
* **Tailwind CSS v4 & PostCSS v4:** Nova geração do motor de estilização utilitária, oferecendo compilação ultrarrápida, suporte a variáveis CSS nativas e facilidade de manutenção.
* **Framer Motion (v12.x):** Utilizado para micro-interações fluidas na UI (transições de abas, exibição de drawers e animações de conclusão de exercícios).
* **Lucide React:** Conjunto consistente de ícones vetoriais leves.

## Banco de Dados & Sincronização Local
* **RxDB (v15+) & RxJS (v7+):** Banco de dados local reativo para navegadores, utilizando o adaptador **Dexie Storage** para estabilidade sobre o IndexedDB do navegador. Fornece persistência offline nativa com consultas rápidas e reatividade instantânea via Observables (RxJS) na interface.
* **Supabase Client SDK:** Utilizado diretamente na camada de replicação do RxDB para sincronização em segundo plano, evitando servidores intermediários.

## Backend & Serviços de Nuvem
* **Supabase (v2.100.0) & Supabase SSR (v0.9.0):** Solução Backend-as-a-Service (BaaS) com banco de dados PostgreSQL.
  * **Auth:** Autenticação gerenciada via cookies no Next.js (SSR).
  * **RLS (Row Level Security):** Segurança dos dados em nível de linha no próprio banco de dados, protegendo a privacidade dos alunos e as conexões de instrutores.

## Integrações & Funcionalidades PWA
* **Next-PWA (v10.2.9):** Geração automática de Service Workers para suporte offline completo, caching de assets estáticos e instalação na tela inicial.
* **Next-Intl (v4.6.1):** Gerenciamento dinâmico de localização (i18n) e traduções a nível de rotas e componentes.
* **Dnd-kit (v6.x / v10.x):** Biblioteca modular de drag-and-drop para reordenação acessível de exercícios nos treinos.
* **Html5-Qrcode & Qrcode.React:** Bibliotecas de geração e leitura de QR codes para compartilhamento ágil de rotinas ou check-in de equipamentos.
