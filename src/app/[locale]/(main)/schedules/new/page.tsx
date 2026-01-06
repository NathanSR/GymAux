'use client';

import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "@/i18n/routing";
import { ScheduleService } from "@/services/scheduleService";
import { ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "react-toastify";

export default function CreateSchedulePage() {
    const router = useRouter();
    const t = useTranslations('ScheduleRegister');
    const [isLoading, setIsLoading] = useState(false);

    const { activeUser } = useSession();

    const handleCreate = async (data: any) => {
        if (!activeUser?.id) return;

        setIsLoading(true);
        try {
            // O dado já vem estruturado pelo WorkoutForm
            await ScheduleService.createSchedule({
                ...data,
                userId: activeUser.id,
                createdAt: new Date(),
            });

            toast.success(t('createSuccess'), {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                theme: "colored",
            });

            router.back();
        } catch (error) {
            console.error("Erro ao criar cronograma de treino:", error);
            toast.error(t('createError'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            {/* Header Sticky */}
            <header className="px-6 py-6 flex items-center justify-between sticky top-0 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md z-30 border-b border-transparent dark:border-zinc-900/50">
                <button
                    onClick={() => router.back()}
                    className="p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800 active:scale-90 transition-all cursor-pointer text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>

                <h1 className="font-black uppercase tracking-widest text-[10px] text-zinc-400 dark:text-zinc-500">
                    {t('createTitle')}
                </h1>

                {/* Spacer para centralizar o título */}
                <div className="w-11"></div>
            </header>

            <main className="px-6 max-w-2xl mx-auto mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ScheduleForm
                    onSubmit={handleCreate}
                    isLoading={isLoading}
                />
            </main>
        </div>
    );
}