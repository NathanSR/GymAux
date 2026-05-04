'use client'

import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Users } from "lucide-react";
import { memo } from "react";

export const TrainerHeader = memo(({ t }: { t: any }) => {
    const router = useRouter();
    return (
        <header className="flex items-center gap-4 mb-10">
            <button
                onClick={() => router.back()}
                className="group p-3 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-lime-400/50 transition-all duration-300 shadow-sm dark:shadow-none"
            >
                <ArrowLeft className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors" />
            </button>
            <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                    <div className="absolute inset-0 bg-lime-400 blur-xl opacity-20 animate-pulse" />
                    <div className="relative p-3 bg-lime-400 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                        <Users className="w-6 h-6 text-zinc-950" />
                    </div>
                </div>
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                        {t('title')}
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('activeStudents')}</p>
                </div>
            </div>
        </header>
    );
});
TrainerHeader.displayName = 'TrainerHeader';