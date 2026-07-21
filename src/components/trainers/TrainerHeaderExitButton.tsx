'use client';

import { ArrowLeft } from 'lucide-react';
import { useSmartNavigation } from '@/hooks/useSmartNavigation';
import { useTranslations } from 'next-intl';

export function TrainerHeaderExitButton() {
    const t = useTranslations('Trainer');
    const { goBack } = useSmartNavigation({ fallbackUrl: '/trainer' });

    return (
        <button
            onClick={() => goBack('/trainer')}
            className="flex items-center gap-2 px-3 py-2 bg-zinc-950 hover:bg-zinc-800 rounded-xl transition-all group active:scale-95 shadow-lg shadow-zinc-950/20 flex-shrink-0 cursor-pointer"
            type="button"
        >
            <ArrowLeft className="w-4 h-4 text-lime-400 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black text-white uppercase tracking-tight hidden xs:block">
                {t('exitEditingMode')}
            </span>
            <span className="text-[10px] font-black text-white uppercase tracking-tight xs:hidden">
                {t('exit') || 'Sair'}
            </span>
        </button>
    );
}
