"use client";

import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { ScheduleService } from "@/services/scheduleService";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";
import PageHeader from "@/components/ui/PageHeader";

interface CreateScheduleClientProps {
    userId: string;
    callerId?: string;
    baseUrl?: string;
}

export default function CreateScheduleClient({ userId, callerId, baseUrl = '/schedules' }: CreateScheduleClientProps) {
    const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: baseUrl });
    const t = useTranslations('ScheduleRegister');
    const [isLoading, setIsLoading] = useState(false);
    const effectiveCallerId = callerId ?? userId;

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            await ScheduleService.createSchedule({
                ...data,
                userId: userId,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
            }, effectiveCallerId);

            toast.success(t('createSuccess'), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            navigateAfterAction(baseUrl);
        } catch (error: any) {
            console.error("Erro ao criar cronograma de treino:", error?.message || error);
            toast.error(t('createError'));
            setIsLoading(false);
        } finally {
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            <PageHeader title={t('createTitle')} variant="minimal" backHref={baseUrl} />

            <main className="px-6 max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ScheduleForm
                    onSubmit={handleCreate}
                    isLoading={isLoading}
                    userId={userId}
                />
            </main>
        </div>
    );
}
