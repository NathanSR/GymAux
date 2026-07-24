import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { ShieldCheck, Lock, Database, HeartPulse, UserCheck, FileKey, Mail, Server } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidade | GymAux',
    description: 'Política de Privacidade e Proteção de Dados (LGPD) do GymAux.',
};

export default async function PrivacyPage() {
    const t = await getTranslations('PrivacyPage');

    const sections = [
        { id: 'sec-1', title: '1. Visão Geral & Controladora' },
        { id: 'sec-2', title: '2. Dados Pessoais & Sensíveis (Saúde)' },
        { id: 'sec-3', title: '3. Bases Legais & Finalidades (LGPD)' },
        { id: 'sec-4', title: '4. Armazenamento, Nuvem & Dexie' },
        { id: 'sec-5', title: '5. Compartilhamento de Dados' },
        { id: 'sec-6', title: '6. Direitos do Titular (Art. 18)' },
        { id: 'sec-7', title: '7. Retenção & Exclusão de Conta' },
        { id: 'sec-8', title: '8. Encarregado pelo Tratamento (DPO)' },
    ];

    const tldr = [
        'Seus dados de treino e saúde pertencem a VOCÊ. Não vendemos nem compartilhamos dados com terceiros para anúncios.',
        'Seus treinos são salvos no seu dispositivo via IndexedDB e sincronizados com a nuvem criptografada no Supabase.',
        'Você pode exportar, alterar ou excluir permanentemente seus dados a qualquer momento.',
        'Utilizamos apenas cookies estritamente necessários por padrão, e você pode gerenciar suas preferências no aplicativo.',
    ];

    return (
        <LegalLayout
            title="Política de Privacidade"
            subtitle="Transparência total sobre como coletamos, tratamos e protegemos seus dados pessoais e dados de saúde em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)."
            updatedAt="23 de Julho de 2026"
            badgeText="LGPD Compliant • Lei nº 13.709/2018"
            tldrTitle="Resumo em Linguagem Simples"
            tldrSummary={tldr}
            sections={sections}
        >
            {/* Seção 1 */}
            <section id="sec-1" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        1. Visão Geral & Controladora dos Dados
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        A presente Política de Privacidade regula o tratamento de dados pessoais realizado pela plataforma <strong>GymAux</strong>. Ao utilizar nosso aplicativo web e aplicativo progressivo (PWA), você confia a nós a gestão de suas informações de treino e progresso físico.
                    </p>
                    <p>
                        Para os fins da <strong>LGPD (Lei nº 13.709/2018, Art. 5º, VI)</strong>, o GymAux atua como <strong>Controlador</strong> dos seus dados pessoais. Assumimos o compromisso público de adotar as melhores práticas de segurança da informação, encriptação e privacidade por padrão (<em>Privacy by Default</em>).
                    </p>
                </div>
            </section>

            {/* Seção 2 */}
            <section id="sec-2" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                        <HeartPulse className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        2. Coleta de Dados Pessoais & Dados Sensíveis de Saúde
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-4">
                    <p>
                        Em virtude da natureza do aplicativo (registro de treinamento e acompanhamento físico), o GymAux trata as seguintes categorias de dados:
                    </p>
                    <div className="space-y-3">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-brand">A. Dados de Identificação</h3>
                            <p className="text-xs text-zinc-400">Nome completo, endereço de e-mail, foto de perfil (opcional) e identificadores de conta.</p>
                        </div>

                        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-1">
                            <h3 className="font-bold text-rose-300 text-xs uppercase tracking-wider flex items-center gap-1.5">
                                <HeartPulse className="w-3.5 h-3.5" />
                                B. Dados Pessoais Sensíveis de Saúde & Performance (Art. 5º, II - LGPD)
                            </h3>
                            <p className="text-xs text-zinc-300">
                                Peso corporal, altura, histórico de cargas, séries, repetições, rotinas de exercícios executadas, registros de progresso e estatísticas de treino. Esses dados são tratados com nível reforçado de proteção.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-brand">C. Dados Técnicos e de Telemetria</h3>
                            <p className="text-xs text-zinc-400">Endereço IP, tipo de navegador, sistema operacional, preferências de idioma/tema e logs de acesso essenciais.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 3 */}
            <section id="sec-3" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <FileKey className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        3. Bases Legais & Finalidades do Tratamento (Art. 7º e 11)
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>Fundamentamos o tratamento dos seus dados estritamente nas hipóteses legais da LGPD:</p>
                    <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-zinc-300">
                        <li>
                            <strong className="text-white">Execução de Contrato (Art. 7º, V):</strong> Para disponibilizar as funcionalidades da plataforma, salvar suas fichas de treino e permitir o acompanhamento de progresso.
                        </li>
                        <li>
                            <strong className="text-white">Consentimento Expresso (Art. 11, I):</strong> Para o tratamento de dados sensíveis de saúde e para a ativação de cookies não-essenciais.
                        </li>
                        <li>
                            <strong className="text-white">Legítimo Interesse e Segurança (Art. 7º, IX):</strong> Para prevenir fraudes, proteger contra acessos não autorizados e manter a integridade da aplicação.
                        </li>
                        <li>
                            <strong className="text-white">Cumprimento de Obrigação Legal (Art. 7º, II):</strong> Para guarda de logs de acesso nos termos do Marco Civil da Internet (Lei nº 12.965/2014).
                        </li>
                    </ul>
                </div>
            </section>

            {/* Seção 4 */}
            <section id="sec-4" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Database className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        4. Armazenamento Local, Nuvem & Dexie DB (Offline-First)
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        O GymAux adota uma arquitetura híbrida para máxima velocidade e disponibilidade:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-brand">Armazenamento Local (Dexie.js / IndexedDB)</h3>
                            <p className="text-xs text-zinc-400">
                                Seus treinos diários e registros de sessão são salvos imediatamente no banco de dados local do seu próprio navegador. Isso garante funcionamento impecável mesmo sem sinal de internet na academia.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                            <h3 className="font-bold text-xs uppercase tracking-wider text-cyan-400">Nuvem Protegida (Supabase Cloud DB)</h3>
                            <p className="text-xs text-zinc-400">
                                Quando online, os dados são sincronizados via conexões seguras HTTPS/TLS e armazenados com encriptação e regras estritas de autorização (Row Level Security - RLS).
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 5 */}
            <section id="sec-5" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Server className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        5. Compartilhamento com Terceiros & Operadores
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        <strong>NÃO vendemos, alugamos ou comercializamos</strong> seus dados pessoais ou históricos de treino em hipótese alguma.
                    </p>
                    <p>
                        O compartilhamento é restrito estritamente a provedores de infraestrutura técnica necessários para a operação do sistema (na condição de <em>Operadores</em> sob a LGPD), tais como o serviço de banco de dados Supabase e servidores de CDN. Todos mantêm rigorosos padrões globais de segurança (SOC 2, ISO 27001).
                    </p>
                </div>
            </section>

            {/* Seção 6 */}
            <section id="sec-6" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <UserCheck className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        6. Direitos do Titular sob a LGPD (Artigo 18)
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>Você possui plenos direitos garantidos pela legislação brasileira, incluindo:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                            <strong className="text-brand block font-bold mb-1">Acesso e Confirmação:</strong> Obter confirmação e acesso aos dados tratados.
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                            <strong className="text-brand block font-bold mb-1">Correção:</strong> Solicitar correção de dados incompletos ou desatualizados.
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                            <strong className="text-brand block font-bold mb-1">Portabilidade:</strong> Exportar seus dados em formato estruturado.
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                            <strong className="text-brand block font-bold mb-1">Eliminação e Revogação:</strong> Revogar consentimento e solicitar exclusão definitiva.
                        </div>
                    </div>
                </div>
            </section>

            {/* Seção 7 */}
            <section id="sec-7" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        7. Retenção de Dados & Exclusão de Conta
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Manteremos seus dados armazenados enquanto sua conta estiver ativa ou conforme necessário para prestar nossos serviços.
                    </p>
                    <p>
                        Caso decida encerrar sua conta, seus dados de perfil e treinos serão apagados de nossas bases principais de forma definitiva, resguardando-se apenas a retenção de logs exigidos por dever de lei.
                    </p>
                </div>
            </section>

            {/* Seção 8 */}
            <section id="sec-8" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        8. Encarregado pelo Tratamento de Dados (DPO) & Contato
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Para exercer qualquer um dos seus direitos de privacidade ou esclarecer dúvidas sobre a LGPD, entre em contato direto com o nosso canal dedicado de privacidade:
                    </p>
                    <div className="p-4 rounded-2xl bg-brand/5 border border-brand/20 space-y-1">
                        <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold block">Canal Direto de Privacidade / DPO</span>
                        <a href="mailto:privacidade@gymaux.app" className="text-brand font-bold text-base hover:underline block">
                            privacidade@gymaux.app
                        </a>
                    </div>
                </div>
            </section>
        </LegalLayout>
    );
}
