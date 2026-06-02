"use client";

import { useState } from 'react';
import { User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { User as AppUser } from '@/config/types';
import ProfileMenu from '@/components/home/ProfileMenu';

export function HomeHeader({ activeUser, formattedDate }: { activeUser: AppUser | null; formattedDate: string }) {
    const t = useTranslations('Home');
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
        <header className="mb-8 flex justify-between items-center relative">
            <div>
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                    {formattedDate}
                </p>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white leading-none">
                    {t('greeting', { name: activeUser?.name || t('defaultUser') })}
                </h1>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="group relative w-12 h-12 rounded-[20px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 overflow-hidden active:scale-95 transition-all shadow-sm hover:shadow-md hover:border-lime-500/50"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-lime-400/0 to-lime-400/0 group-hover:from-lime-400/5 group-hover:to-lime-400/10 transition-all duration-500" />
                    {activeUser?.avatar
                        ? <img src={activeUser.avatar} alt="User" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        : <User size={22} className="group-hover:scale-110 transition-transform duration-500" />}
                </button>
                <ProfileMenu
                    showProfileMenu={showProfileMenu}
                    setShowProfileMenu={setShowProfileMenu}
                    activeUser={activeUser}
                />
            </div>
        </header>
    );
}
