'use client'

import { useForm } from 'react-hook-form';
import {
    Save,
    Dumbbell,
    CheckCircle2,
    X,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useLiveQuery } from 'dexie-react-hooks';
import { useSession } from '@/hooks/useSession';
import { WorkoutService } from '@/services/workoutService';



// --- COMPONENTE: ScheduleForm ---
export const ScheduleForm = ({ initialData, onSubmit, isLoading }: { initialData?: any; onSubmit: (data: any) => void; isLoading?: boolean; }) => {
    const t = useTranslations();
    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        defaultValues: initialData || {
            name: '',
            userId: 1,
            workouts: [null, null, null, null, null, null, null],
            startDate: new Date().toISOString().split('T')[0],
            active: true,
            lastCompleted: -1
        }
    });

    const daysOfWeek = [
        'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
        'Quinta-feira', 'Sexta-feira', 'Sábado'
    ];

    const currentWorkouts = watch('workouts');

    const handleWorkoutChange = (dayIndex: number, workoutId: string | null) => {
        const newWorkouts = [...currentWorkouts];
        newWorkouts[dayIndex] = workoutId ? parseInt(workoutId) : null;
        setValue('workouts', newWorkouts);
    };

    const { activeUser } = useSession();

    const workouts = useLiveQuery(() =>
        WorkoutService.getWorkoutsByUserId(activeUser?.id || -1),
        [activeUser?.id]) || [];

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Informações Básicas */}
            <section className="bg-white dark:bg-zinc-900 p-6 rounded-[24px] border border-zinc-100 dark:border-zinc-800 shadow-sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 px-1">
                            {t('name')}
                        </label>
                        <input
                            {...register('name', { required: true })}
                            className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                            placeholder="Ex: Minha Rotina de Verão"
                        />
                        {errors.name && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 px-1">
                                {t('startDate')}
                            </label>
                            <input
                                type="date"
                                {...register('startDate', { required: true })}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-lime-400 transition-all text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 px-1">
                                {t('endDate')}
                            </label>
                            <input
                                type="date"
                                {...register('endDate')}
                                className="w-full bg-zinc-50 dark:bg-zinc-800 border-none rounded-xl py-4 px-4 outline-none focus:ring-2 focus:ring-lime-400 transition-all text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${watch('active') ? 'bg-lime-400/10 text-lime-500' : 'bg-zinc-200 text-zinc-400'}`}>
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{t('active')}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Status do plano</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" {...register('active')} className="sr-only peer" />
                            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-400"></div>
                        </label>
                    </div>
                </div>
            </section>

            {/* Workouts Grid */}
            <section>
                <h3 className="text-[10px] font-black uppercase text-zinc-400 mb-4 px-1 flex items-center gap-2">
                    <Dumbbell size={14} /> {t('workouts_title')}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                    {daysOfWeek.map((day, index) => (
                        <div key={day} className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xs text-zinc-500">
                                {day.substring(0, 1)}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-bold mb-1">{day}</p>
                                <select
                                    value={currentWorkouts[index] || ''}
                                    onChange={(e) => handleWorkoutChange(index, e.target.value)}
                                    className="w-full bg-transparent border-none text-sm font-medium focus:ring-0 p-0 text-zinc-500"
                                >
                                    <option value="">{t('no_workout')}</option>
                                    {workouts.map(w => (
                                        <option key={w.id} value={w.id}>{w.name}</option>
                                    ))}
                                </select>
                            </div>
                            {currentWorkouts[index] && (
                                <button
                                    type="button"
                                    onClick={() => handleWorkoutChange(index, null)}
                                    className="p-2 text-zinc-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black py-5 rounded-[24px] shadow-xl shadow-lime-500/20 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
                {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-950"></div> : <Save size={20} />}
                {t('save')}
            </button>
        </form>
    );
};


