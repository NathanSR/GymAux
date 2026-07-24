import React from 'react';
import { LegalLayout } from '@/components/legal/LegalLayout';
import { FileText, AlertTriangle, Dumbbell, ShieldAlert, Award, RefreshCw, Scale } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Termos de Uso | GymAux',
    description: 'Termos de Uso e Condições Gerais de Serviços do GymAux.',
};

export default function TermsPage() {
    const sections = [
        { id: 'sec-1', title: '1. Aceitação dos Termos' },
        { id: 'sec-2', title: '2. Descrição do Serviço' },
        { id: 'sec-3', title: '3. Isenção Médica (Disclaimer)' },
        { id: 'sec-4', title: '4. Conta & Conduta do Usuário' },
        { id: 'sec-5', title: '5. Propriedade Intelectual' },
        { id: 'sec-6', title: '6. Limitação de Responsabilidade' },
        { id: 'sec-7', title: '7. Modificações & Encerramento' },
        { id: 'sec-8', title: '8. Legislação Aplicável & Foro' },
    ];

    const tldr = [
        'O GymAux é um diário e assistente de treino digital para registro de suas rotinas físicas.',
        'DISCLAIMER MÉDICO IMPORTANTE: O aplicativo NÃO substitui avaliação médica prévia nem a supervisão presencial de um profissional de Educação Física (CREF).',
        'Você é responsável por manter a confidencialidade de sua senha e conta.',
        'Respeitamos a propriedade intelectual e exigimos uso ético da plataforma sem tentativas de engenharia reversa ou abuso.',
    ];

    return (
        <LegalLayout
            title="Termos de Uso"
            subtitle="Condições gerais de acesso e utilização do ecossistema GymAux. Por favor, leia atentamente antes de utilizar a aplicação."
            updatedAt="23 de Julho de 2026"
            badgeText="Termos Gerais de Uso • GymAux Platform"
            tldrTitle="Resumo dos Pontos Principais"
            tldrSummary={tldr}
            sections={sections}
        >
            {/* Seção 1 */}
            <section id="sec-1" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        1. Aceitação dos Termos e Condições
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Ao acessar, cadastrar-se ou utilizar o aplicativo <strong>GymAux</strong> (seja via navegador web ou PWA), você declara haver lido, compreendido e concordado expressamente com todos os termos e condições dispostos neste documento.
                    </p>
                    <p>
                        Caso não concorde com qualquer uma das disposições aqui descritas, você deve interromper imediatamente o uso da plataforma.
                    </p>
                </div>
            </section>

            {/* Seção 2 */}
            <section id="sec-2" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                        <Dumbbell className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        2. Descrição do Serviço GymAux
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        O GymAux é uma plataforma digital desenvolvida para auxiliar praticantes de musculação e atividades físicas a organizar, registrar e acompanhar suas rotinas de treino, cargas, repetições e evolução corporal.
                    </p>
                    <p>
                        O aplicativo possui funcionalidade offline-first, permitindo o salvamento local dos treinos e posterior sincronização assim que uma conexão de rede for restabelecida.
                    </p>
                </div>
            </section>

            {/* Seção 3 - Disclaimer Médico */}
            <section id="sec-3" className="p-6 md:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-amber-300 tracking-tight">
                        3. Isenção de Responsabilidade Médica e Esportiva (Disclaimer)
                    </h2>
                </div>
                <div className="text-sm text-zinc-200 leading-relaxed space-y-3">
                    <p className="font-semibold text-amber-200">
                        ATENÇÃO: LEITURA OBRIGATÓRIA ANTES DE INICIAR QUALQUER ROTINA DE EXERCÍCIOS.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-xs md:text-sm text-zinc-300">
                        <li>
                            O GymAux é exclusivamente um diário de registro e ferramenta auxiliar de organização. O aplicativo <strong>NÃO PRESTA CONSULTORIA MÉDICA OU DE EDUCAÇÃO FÍSICA</strong>.
                        </li>
                        <li>
                            Nenhuma funcionalidade do aplicativo deve ser interpretada como diagnóstico, prescrição médica ou substituto de avaliação presencial por médico esportivo ou profissional de Educação Física habilitado junto ao CREF.
                        </li>
                        <li>
                            Recomendamos fortemente a realização de exames médicos prévios antes de iniciar qualquer programa de exercícios intensos ou alteração de cargas corporais. A execução dos treinos ocorre sob inteira responsabilidade do usuário.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Seção 4 */}
            <section id="sec-4" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        4. Cadastro, Segurança & Conduta do Usuário
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Para acessar os recursos de sincronização na nuvem, o usuário deve criar uma conta com dados verdadeiros e manter suas credenciais confidenciais.
                    </p>
                    <p>É expressamente proibido:</p>
                    <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-400">
                        <li>Tentar burlar mecanismos de autenticação ou segurança da plataforma;</li>
                        <li>Utilizar robôs, scrapers ou rotinas automatizadas para extração não autorizada de dados;</li>
                        <li>Submeter conteúdos ilícitos, difamatórios ou nocivos no perfil ou fichas compartilhadas.</li>
                    </ul>
                </div>
            </section>

            {/* Seção 5 */}
            <section id="sec-5" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                        <Award className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        5. Propriedade Intelectual & Marcas
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Todo o código-fonte, marcas registradas, logotipos, elementos visuais, ilustrações, bibliotecas de exercícios e design do aplicativo GymAux pertencem exclusivamente à plataforma.
                    </p>
                    <p>
                        A concessão de acesso ao serviço não confere ao usuário qualquer direito de propriedade ou licença sobre os ativos intelectuais além do uso pessoal não comercial.
                    </p>
                </div>
            </section>

            {/* Seção 6 */}
            <section id="sec-6" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <RefreshCw className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        6. Limitação de Responsabilidade & Disponibilidade PWA
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Embora busquemos manter o serviço disponível 24 horas por dia com alta resiliência offline, não garantimos que a operação seja ininterrupta ou livre de erros pontuais causados por instabilidades de rede ou atualizações de terceiros.
                    </p>
                </div>
            </section>

            {/* Seção 7 */}
            <section id="sec-7" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        7. Modificações nos Termos & Rescisão
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. Alterações relevantes serão comunicadas através da aplicação. O uso continuado da plataforma após as alterações constitui aceitação tácita.
                    </p>
                </div>
            </section>

            {/* Seção 8 */}
            <section id="sec-8" className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                        <Scale className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">
                        8. Legislação Aplicável & Foro
                    </h2>
                </div>
                <div className="text-sm text-zinc-300 leading-relaxed space-y-3">
                    <p>
                        Estes Termos são regidos e interpretados estritamente de acordo com as leis da República Federativa do Brasil, em especial o Código de Defesa do Consumidor, o Marco Civil da Internet (Lei nº 12.965/2014) e a LGPD (Lei nº 13.709/2018).
                    </p>
                </div>
            </section>
        </LegalLayout>
    );
}
