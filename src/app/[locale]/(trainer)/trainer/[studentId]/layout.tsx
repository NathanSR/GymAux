import { getTranslations } from 'next-intl/server';
import { userService } from '@/services/userService';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, ShieldCheck, User } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default async function TrainerLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const t = await getTranslations('Trainer');
    const supabase = await createClient();
    const student = await userService.getUserById(studentId, supabase);

    return (
        <div className="flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-x-hidden">
            {/* Editing Mode Banner */}
            <header className="sticky top-0 z-50 bg-lime-400 border-b border-zinc-950/10 px-4 py-2.5 shadow-xl transition-all">
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Link
                            href="/trainer"
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all group active:scale-95 shadow-lg shadow-zinc-950/20 flex-shrink-0"
                        >
                            <ArrowLeft className="w-4 h-4 text-lime-400 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-black text-white uppercase tracking-tight hidden xs:block">
                                {t('exitEditingMode')}
                            </span>
                            <span className="text-[10px] font-black text-white uppercase tracking-tight xs:hidden">
                                {t('exit') || 'Sair'}
                            </span>
                        </Link>

                        <div className="flex items-center gap-3 min-w-0">
                            <div className="hidden sm:flex p-2 bg-zinc-950 rounded-lg shadow-md flex-shrink-0">
                                <ShieldCheck className="w-4 h-4 text-lime-400" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <h2 className="text-sm font-black text-zinc-950 uppercase italic tracking-tighter truncate leading-none mb-1">
                                    {student?.name || '...'}
                                </h2>
                                <div className="flex items-center gap-1.5">
                                    <div className="relative flex-shrink-0">
                                        <div className="h-1.5 w-1.5 rounded-full bg-zinc-950" />
                                        <div className="absolute inset-0 h-1.5 w-1.5 rounded-full bg-zinc-950 animate-ping" />
                                    </div>
                                    <span className="text-[9px] font-bold text-zinc-950/60 uppercase tracking-widest leading-none truncate italic">
                                        {t('activeSession')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-zinc-950/10 p-0.5 overflow-hidden ring-1 ring-zinc-950/10">
                            {student?.avatar ? (
                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-zinc-950/5 rounded-lg">
                                    <User className="w-4 h-4 text-zinc-950/30" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full max-w-6xl mx-auto pb-32">
                {children}
            </main>
        </div>
    );
}