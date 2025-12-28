"use client";

import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { useRouter } from "@/i18n/routing";
import { ScheduleService } from "@/services/scheduleService";
import { WorkoutService } from "@/services/workoutService";
import { ChevronLeft, Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// --- PÁGINA: EditSchedulePage ---
export default function EditSchedulePage() {
    const router = useRouter();
    const t = useTranslations();
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            const data: any = await ScheduleService.getActiveSchedule(Number(id));
            if (data) setInitialData(data);
            else router.push('/schedules');
        };
        fetchSchedule();
    }, [id, router]);

    const handleUpdate = async (data: any) => {
        setLoading(true);
        try {
            await WorkoutService.updateWorkout(Number(id), {
                ...data,
                updatedAt: new Date()
            });
            router.back();
        } catch (error) {
            console.error("Erro ao atualizar treino:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        // Nota: Em produção, recomenda-se um modal de confirmação costumizado
        if (confirm(t('confirmDeleteSchedule'))) {
            try {
                await ScheduleService.deleteSchedule(Number(id));
                router.push('/schedules');
            } catch (error) {
                console.error("Erro ao eliminar cronograma:", error);
            }
        }
    };

    if (!initialData) return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-lime-400/20 rounded-full flex items-center justify-center">
                    <Clock className="text-lime-400 animate-spin" />
                </div>
                <p className="text-zinc-500 font-bold uppercase text-[10px]">Carregando Cronograma...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                    <ChevronLeft size={24} />
                </button>
                <h1 className="font-black text-lg tracking-tight uppercase">{t('editSchedule')}</h1>
                <button
                    onClick={handleDelete}
                    className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-50 hover:text-white transition-all"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <main className="px-6 max-w-2xl mx-auto">
                <ScheduleForm initialData={initialData} onSubmit={handleUpdate} isLoading={loading} />
            </main>
        </div>
    );
}
