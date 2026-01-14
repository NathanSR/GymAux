'use client';

import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import UserForm from '@/components/users/UserForm';
import UserCard from '@/components/users/UserCard';
import { ChevronLeft, Plus } from 'lucide-react';
import { userService } from '@/services/userService';
import PWAInstallButton from '@/components/PWAInstallButton';

export default function HomePage() {
    const t = useTranslations();
    const [isCreating, setIsCreating] = useState(false);

    const users = useLiveQuery(() => userService.getAllUsers(), []);

    const onSubmit = async (data: any) => {
        await userService.createUser(data);
        setIsCreating(false);
    };

    if (!users) return null;

    if (users.length === 0 || isCreating) {
        return (
            <>
                {users.length > 0 && (
                    <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 cursor-pointer active:scale-90 transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    </header>
                )}
                <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
                    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-tight">
                                {t('UserRegister.title')}
                            </h1>
                            <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
                                {t('UserRegister.subtitle')}
                            </p>
                        </div>
                        <UserForm onSubmit={onSubmit} />
                    </div>
                </main>
            </>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
            <div className="text-center mb-12 animate-in fade-in duration-700">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-white leading-tight">
                    {t('Index.title')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">
                    {t('Index.subtitle')}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl px-4">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}

                <button
                    onClick={() => setIsCreating(true)}
                    className="flex flex-col items-center justify-center gap-3 aspect-square rounded-[2.5rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-lime-500/50 hover:bg-lime-500/5 transition-all group"
                >
                    <div className="w-14 h-14 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                        <Plus className="text-zinc-400 group-hover:text-lime-500" size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-lime-600">
                        {t('Index.addNew')}
                    </span>
                </button>
            </div>

            {/* Componente de Instalação PWA */}
            <PWAInstallButton />
        </main>
    );
}