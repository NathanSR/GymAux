"use client";

import React, { useState } from "react";
import { ChevronLeft, AlertCircle, Cookie, Shield, FileText, ChevronRight } from "lucide-react";
import { User as AppUser } from "@/config/types";
import { toast } from 'react-toastify';
import { useRouter, Link } from "@/i18n/routing";
import { userService } from "@/services/userService";
import UserForm from "@/components/users/UserForm";
import { useTranslations } from "next-intl";
import { useCookieConsent } from "@/context/CookieConsentContext";

import { FormFieldsSkeleton } from "@/components/ui/Skeleton";
import PageHeader from "@/components/ui/PageHeader";

interface EditProfileClientProps {
    initialUser?: AppUser | null;
    isFetching?: boolean;
}

export default function EditProfileClient({ initialUser, isFetching = false }: EditProfileClientProps) {
    const router = useRouter();
    const t = useTranslations('UserEdit');
    const [isSaving, setIsSaving] = useState(false);
    const { openModal } = useCookieConsent();

    const handleUpdate = async (data: AppUser) => {
        if (!initialUser?.id) return;
        setIsSaving(true);
        try {
            await userService.updateUser(initialUser.id, {
                name: data.name,
                avatar: data.avatar,
                weight: Number(data.weight),
                height: Number(data.height),
                goal: data.goal,
            });
            toast.success(t('success'));
        } catch (error: any) {
            toast.error(t('error'));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors">
            <PageHeader title={t('title')} backHref="/home" className="max-w-lg mx-auto rounded-b-[32px] border-x" />

            <main className="p-6 max-w-lg mx-auto space-y-6">
                {isFetching || !initialUser ? (
                    <FormFieldsSkeleton />
                ) : (
                    <>
                        <UserForm
                            initialData={initialUser}
                            onSubmit={handleUpdate}
                            isLoading={isSaving}
                            submitLabel={t('submitBtn')}
                        />

                        <div className="p-5 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 flex gap-4">
                            <AlertCircle className="text-zinc-400 shrink-0" size={20} />
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                                {t('tip')}
                            </p>
                        </div>

                        {/* Seção LGPD & Privacidade no Perfil */}
                        <div className="p-6 bg-white dark:bg-zinc-900/60 rounded-[32px] border border-zinc-200/80 dark:border-zinc-800 space-y-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-600 dark:text-lime-400">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-zinc-900 dark:text-white">
                                        Privacidade & Dados (LGPD)
                                    </h3>
                                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                                        Gerencie seus dados pessoais, consentimento e políticas.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 pt-1">
                                <button
                                    type="button"
                                    onClick={openModal}
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 text-xs font-bold transition-all text-zinc-800 dark:text-zinc-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Cookie size={16} className="text-amber-500" />
                                        <span>Preferências de Cookies</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </button>

                                <Link
                                    href="/privacy"
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 text-xs font-bold transition-all text-zinc-800 dark:text-zinc-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <Shield size={16} className="text-emerald-500" />
                                        <span>Política de Privacidade</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>

                                <Link
                                    href="/terms"
                                    className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/50 text-xs font-bold transition-all text-zinc-800 dark:text-zinc-200"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText size={16} className="text-blue-500" />
                                        <span>Termos de Uso</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-400" />
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
