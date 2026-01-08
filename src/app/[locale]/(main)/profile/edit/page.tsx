'use client'

import React, { useState } from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { User } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import Loading from "@/app/[locale]/loading";
import { toast } from 'react-toastify';
import { useRouter } from "@/i18n/routing";
import { userService } from "@/services/userService";
import UserForm from "@/components/users/UserForm";
import { useTranslations } from "next-intl"; // Importado

export default function EditProfilePage() {
    const router = useRouter();
    const t = useTranslations('UserEdit'); // Inicializado
    const [isSaving, setIsSaving] = useState(false);
    const { activeUser, loading } = useSession();

    const handleUpdate = async (data: User) => {
        if (!activeUser?.id) return;

        setIsSaving(true);
        try {
            await userService.updateUser(activeUser.id, data);
            toast.success(t('success')); // Traduzido
        } catch (error) {
            toast.error(t('error')); // Traduzido
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !activeUser) return <Loading />;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors">
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        type="button"
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => router.push("/home")}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight italic">
                        {t('title')} {/* Traduzido */}
                    </h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
                <UserForm
                    initialData={activeUser}
                    onSubmit={handleUpdate}
                    isLoading={isSaving}
                    submitLabel={t('submitBtn')}
                />

                {/* Tip Card */}
                <div className="mt-8 p-5 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 flex gap-4">
                    <AlertCircle className="text-zinc-400 shrink-0" size={20} />
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                        {t('tip')} {/* Traduzido */}
                    </p>
                </div>
            </main>
        </div>
    );
}