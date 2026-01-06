'use client';

import { User } from '@/config/types';
import { useRouter } from '@/i18n/routing';
import { User as UserIcon } from 'lucide-react';

interface UserCardProps {
    user: User;
}

export default function UserCard({ user }: UserCardProps) {
    const router = useRouter();

    const handleSelect = () => {
        // 1. Salva o ID do usuário ativo para persistência simples
        localStorage.setItem('activeUserId', user.id!.toString());

        // 2. Redireciona para o Home (vamos criar essa rota a seguir)
        router.push('/home');
    };

    return (
        <button
            onClick={handleSelect}
            className="group flex flex-col items-center gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-lime-500 dark:hover:border-lime-500 hover:shadow-lg transition-all active:scale-95"
        >
            <div className="relative">
                {user.avatar ? (
                    <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-transparent group-hover:border-lime-500 transition-colors"
                    />
                ) : (
                    <div className="w-20 h-20 rounded-full bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center border-2 border-transparent group-hover:border-lime-500 transition-colors">
                        <UserIcon size={32} className="text-lime-600 dark:text-lime-400" />
                    </div>
                )}
            </div>

            <div className="text-center">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate w-24">
                    {user.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user.weight}kg • {user.height}cm
                </p>
            </div>
        </button>
    );
}