'use client';

import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";
import { ScheduleService } from "@/services/scheduleService";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// --- PÁGINA: CreateSchedulePage ---
export default function CreateSchedulePage() {
    const router = useRouter();
    const t = useTranslations();
    const [isLoading, setIsLoading] = useState(false);

    const { activeUser } = useSession()

    const handleCreate = async (data: any) => {
        setIsLoading(true);
        try {
            // O dado já vem estruturado pelo WorkoutForm
            await ScheduleService.createSchedule({
                ...data,
                userId: activeUser?.id,
                createdAt: new Date(),
            });
            router.back();
        } catch (error) {
            console.error("Erro ao criar cronograma de treino:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-10">
                <button onClick={() => router.back()} className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="font-black uppercase tracking-tight text-sm">{t('create_title')}</h1>
                <div className="w-11"></div>
            </header>

            <main className="px-6 max-w-2xl mx-auto">
                <ScheduleForm onSubmit={handleCreate} isLoading={isLoading} />
            </main>
        </div>
    );
}