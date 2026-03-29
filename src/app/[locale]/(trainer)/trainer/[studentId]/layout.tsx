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
        <div className="min-h-screen bg-zinc-950 flex flex-col font-sans selection:bg-lime-400 selection:text-zinc-950 overflow-x-hidden">
            {/* Editing Mode Banner */}
            <header className="sticky top-0 z-50 bg-zinc-950/80 border-b border-white/5 px-4 py-4 shadow-2xl backdrop-blur-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-lime-500/5 via-transparent to-lime-500/5 pointer-events-none" />
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4 flex-1">
                        <Link 
                            href="/trainer" 
                            className="p-3 bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl transition-all group active:scale-95 border border-white/5"
                        >
                            <ArrowLeft className="w-5 h-5 text-zinc-400 group-hover:text-lime-400 transition-colors" />
                        </Link>
                        
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-lime-400 rounded-2xl border-2 border-zinc-950 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                                <ShieldCheck className="w-6 h-6 text-zinc-950" />
                            </div>
                            <div>
                                <h2 className="text-base font-black text-white uppercase italic tracking-tight line-clamp-1 leading-none mb-1">
                                    {t('editingMode', { student: student?.name || '...' })}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <div className="h-2 w-2 rounded-full bg-lime-500" />
                                        <div className="absolute inset-0 h-2 w-2 rounded-full bg-lime-400 animate-ping" />
                                    </div>
                                    <span className="text-[10px] font-black text-lime-400/60 uppercase tracking-[0.2em] leading-none italic">
                                        Active Trainer Session
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-lime-400 uppercase tracking-widest leading-none mb-1 italic">Authorized</p>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none">Access Granted</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/50 flex items-center justify-center p-2 overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-10">
                            {student?.avatar ? (
                                <img src={student.avatar} alt={student.name} className="w-full h-full object-cover rounded-md" />
                            ) : (
                                <User className="w-5 h-5 text-zinc-500" />
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