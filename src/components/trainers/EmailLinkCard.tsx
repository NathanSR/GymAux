'use client'


import { Plus, Search } from "lucide-react";
import { memo } from "react";


export const EmailLinkCard = memo(({ emailInput, setEmailInput, onLink, isLinking, t }: any) => (
    <div className="p-7 bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[32px] space-y-5 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />
            <span>{t('linkByEmail')}</span>
        </div>
        <div className="flex gap-2">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-600 group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 transition-colors" />
                <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onLink()}
                    placeholder={t('idPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-lime-500/50 dark:focus:border-lime-400/50 focus:ring-4 focus:ring-lime-500/5 dark:focus:ring-lime-400/5 transition-all outline-none"
                />
            </div>
            <button
                onClick={onLink}
                disabled={!emailInput || isLinking}
                className="px-5 bg-lime-400 text-zinc-950 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] active:scale-90 flex items-center justify-center min-w-[56px]"
            >
                {isLinking ? (
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                    <Plus className="w-6 h-6 stroke-[2.5px]" />
                )}
            </button>
        </div>
    </div>
));
EmailLinkCard.displayName = 'EmailLinkCard';