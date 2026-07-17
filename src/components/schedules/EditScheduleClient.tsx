'use client';

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useSmartNavigation } from "@/hooks/useSmartNavigation";
import { useTranslations } from "next-intl";
import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { ScheduleService } from "@/services/scheduleService";
import { useAlerts } from "@/hooks/useAlerts";
import { useTheme } from "@/context/ThemeContext";
import { toast } from "react-toastify";
import PageHeader from "@/components/ui/PageHeader";

interface EditScheduleClientProps {
    initialData: any;
    scheduleId: string;
    callerId: string;
    baseUrl?: string;
}

export default function EditScheduleClient({ initialData, scheduleId, callerId, baseUrl = '/schedules' }: EditScheduleClientProps) {
    const { isDark } = useTheme();
    const { navigateAfterAction } = useSmartNavigation({ fallbackUrl: baseUrl });
    const t = useTranslations('ScheduleEdit');
    const alerts = useAlerts();

    const [loading, setLoading] = useState(false);

    const handleUpdate = async (data: any) => {
        setLoading(true);
        try {
            await ScheduleService.updateSchedule(scheduleId, {
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                updatedAt: new Date()
            }, callerId);
            toast.success(t('editSuccess'));
            navigateAfterAction(baseUrl);
        } catch (error: any) {
            console.error("Error updating schedule:", error?.message || error);
            setLoading(false);
        } finally {
        }
    };

    const handleDelete = async () => {
        const result = await alerts.confirm({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            confirmText: t('confirmDeleteButton'),
            cancelText: t('cancelButton'),
            variant: 'delete',
        });

        if (result.isConfirmed) {
            try {
                await ScheduleService.deleteSchedule(scheduleId, callerId);
                navigateAfterAction(baseUrl);
            } catch (error: any) {
                console.error("Error deleting schedule:", error?.message || error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            <PageHeader
                title={t('editTitle')}
                variant="minimal"
                backHref={baseUrl}
                rightAction={
                    <button
                        onClick={handleDelete}
                        className="p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 cursor-pointer"
                    >
                        <Trash2 size={20} />
                    </button>
                }
            />

            <main className="px-6 max-w-2xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ScheduleForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isLoading={loading}
                    userId={initialData.userId}
                />
            </main>
        </div>
    );
}
