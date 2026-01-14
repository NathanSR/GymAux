'use client';

import { useState, useEffect } from 'react';
import { Download, Share, PlusSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function PWAInstallButton() {
    const t = useTranslations('PWAInstall');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.matchMedia('(display-mode: standalone)').matches) {
                setIsInstalled(true);
            }

            const userAgent = window.navigator.userAgent.toLowerCase();
            setIsIOS(/iphone|ipad|ipod/.test(userAgent));

            const handler = (e: Event) => {
                e.preventDefault();
                setDeferredPrompt(e);
            };

            window.addEventListener('beforeinstallprompt', handler);
            return () => window.removeEventListener('beforeinstallprompt', handler);
        }
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };

    if (isInstalled) return null;

    if (deferredPrompt) {
        return (
            <button
                onClick={handleInstall}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-zinc-950 px-6 py-3 rounded-full font-black uppercase text-xs tracking-widest shadow-lg shadow-lime-500/20 transition-all animate-bounce z-50"
            >
                <Download size={16} />
                {t('installButton')}
            </button>
        );
    }

    if (isIOS) {
        return (
            <div className="mt-8 p-6 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 text-center max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-4">
                    {t('iosTitle')}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-bold text-zinc-600 dark:text-zinc-300">
                    <span>{t('iosStep1')}</span>
                    <Share size={16} className="text-blue-500" />
                    <span>{t('iosStep2')}</span>
                    <PlusSquare size={16} />
                    <span>{t('iosStep3')}</span>
                </div>
            </div>
        );
    }

    return null;
}