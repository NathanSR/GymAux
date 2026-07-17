'use client';

import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function InstallPromptBanner() {
    const t = useTranslations('PWAInstall');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already running in standalone mode (installed PWA)
        if (typeof window !== 'undefined') {
            const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
            if (isStandalone) {
                setIsInstalled(true);
                return;
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            // Check local storage so we don't spam users who dismissed it recently
            const dismissedAt = localStorage.getItem('gymaux_pwa_dismissed');
            if (dismissedAt) {
                const elapsedDays = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
                if (elapsedDays < 3) return; // Wait 3 days before showing prompt again
            }
            setIsVisible(true);
        };

        const handleAppInstalled = () => {
            setIsVisible(false);
            setDeferredPrompt(null);
            setIsInstalled(true);
            console.log('[PWA] GymAux was installed successfully!');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Install prompt outcome: ${outcome}`);
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('gymaux_pwa_dismissed', Date.now().toString());
    };

    if (!isVisible || isInstalled) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <div className="bg-zinc-900/95 backdrop-blur-md border border-lime-500/30 rounded-2xl p-4 shadow-2xl shadow-lime-500/10 flex flex-col gap-3 relative text-white">
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors"
                    aria-label={t('notNow')}
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="flex items-start gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center shrink-0">
                        <Download className="w-5 h-5 text-lime-400" />
                    </div>
                    <div className="pr-6">
                        <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                            {t('title')}
                        </h4>
                        <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
                            {t('description')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-zinc-800/80">
                    <button
                        onClick={handleInstallClick}
                        className="flex-1 py-2.5 px-4 bg-lime-400 hover:bg-lime-300 text-zinc-950 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-lime-400/20 active:scale-[0.98] cursor-pointer"
                    >
                        <Download className="w-3.5 h-3.5" />
                        {t('installDesktop')}
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="py-2.5 px-3 text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors font-medium cursor-pointer"
                    >
                        {t('notNow')}
                    </button>
                </div>
            </div>
        </div>
    );
}
