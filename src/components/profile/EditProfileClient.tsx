"use client";

import React, { useState } from "react";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { User as AppUser } from "@/config/types";
import { toast } from 'react-toastify';
import { useRouter } from "@/i18n/routing";
import { userService } from "@/services/userService";
import UserForm from "@/components/users/UserForm";
import { useTranslations } from "next-intl";

interface EditProfileClientProps {
    initialUser: AppUser;
}

import PageHeader from "@/components/ui/PageHeader";

export default function EditProfileClient({ initialUser }: EditProfileClientProps) {
    const router = useRouter();
    const t = useTranslations('UserEdit');
    const [isSaving, setIsSaving] = useState(false);

    const handleUpdate = async (data: AppUser) => {
        setIsSaving(true);
        try {
            await userService.updateUser(initialUser.id!, {
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
            <PageHeader title={t('title')} backHref="/profile" className="max-w-lg mx-auto rounded-b-[32px] border-x" />

            <main className="p-6 max-w-lg mx-auto">
                <UserForm
                    initialData={initialUser}
                    onSubmit={handleUpdate}
                    isLoading={isSaving}
                    submitLabel={t('submitBtn')}
                />

                <div className="mt-8 p-5 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 flex gap-4">
                    <AlertCircle className="text-zinc-400 shrink-0" size={20} />
                    <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                        {t('tip')}
                    </p>
                </div>
            </main>
        </div>
    );
}
