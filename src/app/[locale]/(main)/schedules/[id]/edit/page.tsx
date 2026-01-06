"use client";

import Loading from "@/app/[locale]/loading";
import { ScheduleForm } from "@/components/schedules/ScheduleForm";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/i18n/routing";
import { ScheduleService } from "@/services/scheduleService";
import { ChevronLeft, Clock, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function EditSchedulePage() {
    const { theme } = useTheme();
    const router = useRouter();
    const t = useTranslations('ScheduleEdit');
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                const data: any = await ScheduleService.getScheduleById(Number(id));
                if (data) {
                    setInitialData(data);
                } else {
                    router.push('/schedules');
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
                router.push('/schedules');
            }
        };
        fetchSchedule();
    }, [id, router]);

    const handleUpdate = async (data: any) => {
        setLoading(true);
        try {
            await ScheduleService.updateSchedule(Number(id), {
                ...data,
                updatedAt: new Date()
            });
            toast.success(t('editSuccess'));
            router.back();
        } catch (error) {
            console.error("Error updating schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        Swal.fire({
            title: t('confirmDeleteTitle'),
            text: t('confirmDeleteText'),
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: t('confirmDeleteButton'),
            cancelButtonText: t('cancelButton'),
            background: theme === 'dark' ? '#18181b' : '#ffffff', // zinc-900 ou branco
            color: theme === 'dark' ? '#ffffff' : '#111827',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await ScheduleService.deleteSchedule(Number(id));
                    router.push('/schedules');
                } catch (error) {
                    console.error("Error deleting schedule:", error);
                }
            }
        });
    };

    // State: Loading
    if (!initialData) return <Loading name={t('editTitle')} />

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-12 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-all active:scale-90 cursor-pointer"
                >
                    <ChevronLeft size={20} />
                </button>

                <h1 className="font-black text-xs tracking-widest uppercase text-zinc-400 dark:text-zinc-500">
                    {t('editTitle')}
                </h1>

                <button
                    onClick={handleDelete}
                    className="p-3 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 cursor-pointer"
                >
                    <Trash2 size={20} />
                </button>
            </header>

            <main className="px-6 max-w-2xl mx-auto mt-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <ScheduleForm
                    initialData={initialData}
                    onSubmit={handleUpdate}
                    isLoading={loading}
                />
            </main>
        </div>
    );
}