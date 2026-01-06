'use client';

import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { useState } from 'react';
import UserForm from '@/components/users/UserForm';
import UserCard from '@/components/users/UserCard';
import { Plus } from 'lucide-react';
import { userService } from '@/services/userService';

export default function HomePage() {
    const t = useTranslations();
    const [isCreating, setIsCreating] = useState(false);

    // Busca usuários no Dexie
    const users = useLiveQuery(() => userService.getAllUsers(), []);

    // Se o banco ainda estiver carregando
    if (!users) return null;

    // Tela de Criação (se não houver usuários ou se clicou em "Novo")
    if (users.length === 0 || isCreating) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
                <div className="w-full max-w-md space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                            {t('UserRegister.title')}
                        </h1>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2">
                            {t('UserRegister.subtitle')}
                        </p>
                    </div>
                    <UserForm onCancel={users.length > 0 ? () => setIsCreating(false) : undefined} />
                </div>
            </main>
        );
    }

    // Tela de Seleção de Perfil
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-zinc-950">
            <h1 className="text-2xl font-bold mb-8 text-zinc-900 dark:text-white">
                {t('Index.title')}
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-2xl">
                {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                ))}

                <button
                    onClick={() => setIsCreating(true)}
                    className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-800 hover:border-lime-500 transition-colors"
                >
                    <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                        <Plus className="text-zinc-500" />
                    </div>
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {t('Index.addNew')}
                    </span>
                </button>
            </div>
        </main>
    );
}