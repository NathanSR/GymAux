import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { Cookie, Lock, BarChart3, Sliders, Settings2, Trash2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Cookies | GymAux',
    description: 'Política de Cookies e Gestão de Tecnologias de Armazenamento do GymAux.',
};

export default function CookiesPage() {
    const sections = [
        { id: 'sec-1', title: '1. O que são Cookies & Armazenamento' },
        { id: 'sec-2', title: '2. Categorias de Cookies Usados' },
        { id: 'sec-3', title: '3. Tabela Detalhada de Cookies' },
        { id: 'sec-4', title: '4. Como Gerenciar no Navegador' },
    ];

    const tldr = [
        'Cookies e LocalStorage são pequenos arquivos salvos no seu dispositivo para permitir que o aplicativo funcione.',
        'Cookies Essenciais são obrigatórios para você fazer login e sincronizar seus treinos.',
        'Você pode desativar cookies opcionais (Analíticos e Funcionais) no nosso gerenciador no rodapé.',
        'Seus dados de preferência de cookies podem ser alterados ou limpos a qualquer momento.',
    ];

    return (
        <LegalLayout
            title="Política de Cookies"
            subtitle="Detalhamento técnico e funcional sobre como utilizamos cookies, LocalStorage e IndexedDB para entregar a melhor experiência de treino."
            updatedAt="23 de Julho de 2026"
            badgeText="Gestão de Cookies • LGPD Compliant"
            tldrTitle="Resumo Rápido"
            tldrSummary={tldr}
            sections={sections}
        >
            {/* Seção 1 */}
            <section id="sec-1" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <Cookie className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        1. O que são Cookies e Armazenamentos Locais?
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Cookies são pequenos arquivos de texto armazenados no seu navegador quando você visita um site ou aplicativo web. O GymAux também utiliza tecnologias modernas como <strong>LocalStorage</strong> e <strong>IndexedDB (Dexie.js)</strong> para possibilitar a execução de treinos sem internet.
                    </p>
                </div>
            </section>

            {/* Seção 2 */}
            <section id="sec-2" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Settings2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        2. Categorias de Cookies Utilizados pelo GymAux
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                            <Lock className="w-4 h-4" /> Essenciais
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Indispensáveis para autenticação de conta via Supabase, proteção CSRF, persistência de idioma e funcionamento offline da PWA.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-brand font-bold text-sm">
                            <BarChart3 className="w-4 h-4" /> Analíticos
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Coletam métricas anônimas sobre o tempo de carregamento de páginas e erros de sistema para melhorarmos a performance.
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                            <Sliders className="w-4 h-4" /> Funcionais
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Guardam personalizações avançadas de interface, animações e preferências visuais de painel de treino.
                        </p>
                    </div>
                </div>
            </section>

            {/* Seção 3 */}
            <section id="sec-3" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        3. Tabela Detalhada de Cookies & Armazenamentos
                    </h2>
                </div>
                <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs text-zinc-300 border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                                <th className="py-3 px-4">Nome / Chave</th>
                                <th className="py-3 px-4">Categoria</th>
                                <th className="py-3 px-4">Duração</th>
                                <th className="py-3 px-4">Finalidade</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3 px-4 font-mono text-brand">sb-*-auth-token</td>
                                <td className="py-3 px-4 text-emerald-400 font-bold">Essencial</td>
                                <td className="py-3 px-4">Sessão / 1 ano</td>
                                <td className="py-3 px-4">Autenticação segura do usuário no Supabase Cloud.</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-mono text-brand">gymaux_cookie_consent_v1</td>
                                <td className="py-3 px-4 text-emerald-400 font-bold">Essencial</td>
                                <td className="py-3 px-4">1 ano</td>
                                <td className="py-3 px-4">Salva as escolhas de consentimento de cookies da LGPD.</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-mono text-brand">gymaux_theme</td>
                                <td className="py-3 px-4 text-emerald-400 font-bold">Essencial</td>
                                <td className="py-3 px-4">Persistente</td>
                                <td className="py-3 px-4">Guarda a preferência de tema (Modo Escuro / Modo Claro).</td>
                            </tr>
                            <tr>
                                <td className="py-3 px-4 font-mono text-brand">dexie_db (GymAuxDB)</td>
                                <td className="py-3 px-4 text-emerald-400 font-bold">Essencial (IndexedDB)</td>
                                <td className="py-3 px-4">Persistente</td>
                                <td className="py-3 px-4">Armazena treinos, rotinas e exercícios localmente para uso offline.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Seção 4 */}
            <section id="sec-4" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <Trash2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        4. Como Gerenciar ou Apagar Cookies no Navegador
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Você pode alterar suas preferências de cookies no GymAux a qualquer momento utilizando o botão <strong>Preferências de Cookies</strong> no rodapé da página.
                    </p>
                    <p className="text-xs text-zinc-400">
                        Além disso, você pode desativar ou apagar cookies diretamente nas configurações do seu navegador (Google Chrome, Apple Safari, Mozilla Firefox ou Microsoft Edge). Observe que desativar cookies essenciais impedirá o acesso às áreas autenticadas do aplicativo.
                    </p>
                </div>
            </section>
        </LegalLayout>
    );
}
