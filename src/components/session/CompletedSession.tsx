'use client';

import { Trophy, Scale, MessageSquare, Zap, Save, Loader2 } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { Session } from '@/config/types';
import { numberInputUtils } from '../../utils/numberUtil';
import { SessionService } from '@/services/sessionService';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { startTopLoader } from '@/utils/topLoader';

interface CompletedSessionProps {
    session: Session;
}

interface CompletionFormData {
    userWeight: number;
    description: string;
    usingCreatine: boolean;
}

export function CompletedSession({ session }: CompletedSessionProps) {
    const t = useTranslations('Session');
    const router = useRouter();
    const isOnline = useOnlineStatus();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const { register, handleSubmit, watch, setValue, control } = useForm<CompletionFormData>({
        defaultValues: {
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });

    const isUsingCreatine = watch('usingCreatine');

    const onFinishWorkout = async (data: CompletionFormData) => {
        if (!session.id || isSubmitting) return;

        try {
            setIsSubmitting(true);

            await SessionService.finishSession(session.id, {
                weight: data.userWeight,
                description: data.description,
                usingCreatine: data.usingCreatine
            });

            setIsSuccess(true);

            // If offline, show a specific toast
            if (!isOnline) {
                toast.success(t('savedOfflineSuccess'), {
                    autoClose: 5000,
                    style: { background: '#27272a', color: '#fff', borderRadius: '16px' }
                });
            } else {
                toast.success(t('completedSubtitle'), {
                    autoClose: 3000,
                    style: { background: '#27272a', color: '#fff', borderRadius: '16px' }
                });
            }

            // Small delay to allow the user to see the success feedback
            setTimeout(() => {
                startTopLoader();
                router.replace('/home');
            }, 3000);
        } catch (error: any) {
            console.error('[CompletedSession] Error finishing workout:', error?.message || error);
            toast.error(t('saveError'), {
                autoClose: 5000,
                style: { background: '#27272a', color: '#fff', borderRadius: '16px', fontSize: '14px' }
            });
            setIsSubmitting(false);
        }
    };

    const isFinished = session.isFinishedLocally || isSuccess;

    if (isFinished) {
        return (
            <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-8 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-700 transition-colors">
                <div className={`p-8 rounded-full shadow-2xl transition-all duration-1000 ${isOnline ? 'bg-lime-400 shadow-lime-400/20' : 'bg-zinc-200 dark:bg-zinc-800 shadow-zinc-400/20 dark:shadow-zinc-800/20'}`}>
                    {isOnline ? (
                        <Trophy size={64} className="text-zinc-950 animate-bounce" />
                    ) : (
                        <Save size={64} className="text-zinc-600 dark:text-zinc-400" />
                    )}
                </div>

                <div className="space-y-4">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-zinc-900 dark:text-white">
                        {isOnline ? t('completedTitle') : t('offlineSavedTitle')}
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                        {isOnline
                            ? t('completedSubtitle')
                            : t('offlineSavedText')
                        }
                    </p>
                </div>

                <div className="w-full space-y-3">
                    <button
                        onClick={() => {
                            startTopLoader();
                            router.replace('/home');
                        }}
                        className="w-full py-5 bg-lime-400 text-zinc-950 rounded-[28px] font-black uppercase tracking-widest text-xs hover:bg-lime-500 transition-all shadow-lg shadow-lime-500/10 active:scale-95 cursor-pointer"
                    >
                        {t('goToDashboard')}
                    </button>

                    {!isOnline && (
                        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-full border border-zinc-200 dark:border-zinc-800 animate-pulse">
                            <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
                                {t('syncWhenOnline')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white p-8 flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500 transition-colors">
            <div className="w-full space-y-8">
                {/* Offline Banner */}
                {!isOnline && (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-[24px] flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
                        <div className="bg-amber-500/20 p-2 rounded-xl text-amber-600 dark:text-amber-500">
                            <Zap size={16} />
                        </div>
                        <p className="text-[10px] font-bold text-amber-800 dark:text-amber-200/80 uppercase tracking-wider leading-tight">
                            {t('offlineModeInfo') || "Você está offline. O treino será salvo localmente e sincronizado depois."}
                        </p>
                    </div>
                )}

                {/* Header de Sucesso */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-6 bg-lime-400 rounded-full shadow-2xl shadow-lime-400/20 mb-2">
                        <Trophy size={48} className="text-zinc-950" />
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none text-zinc-900 dark:text-white">
                        {t('completedTitle')}
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">{t('completedSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit(onFinishWorkout)} className="space-y-4">
                    {/* Peso Corporal */}
                    <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[32px] border border-zinc-200 dark:border-zinc-800 focus-within:border-lime-500/50 dark:focus-within:border-lime-400/50 transition-all shadow-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <Scale size={14} className="text-lime-600 dark:text-lime-400" />
                            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">{t('bodyWeight')}</label>
                        </div>
                        <Controller
                            name="userWeight"
                            control={control}
                            render={({ field }) => (
                                <input
                                    {...field}
                                    type="number"
                                    step="0.1"
                                    value={numberInputUtils.formatValue(field.value)}
                                    onFocus={numberInputUtils.onFocus}
                                    onChange={(e) => numberInputUtils.onChange(e, field.onChange)}
                                    className="w-full bg-transparent border-none p-0 font-bold text-2xl text-zinc-900 dark:text-white outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
                                    placeholder="0.0"
                                />
                            )}
                        />
                    </div>

                    {/* Switch de Creatina */}
                    <div
                        onClick={() => setValue('usingCreatine', !isUsingCreatine)}
                        className={`flex items-center justify-between p-5 rounded-[32px] border transition-all cursor-pointer shadow-xs ${isUsingCreatine ? 'bg-lime-400/10 border-lime-500/50 dark:border-lime-400/50' : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isUsingCreatine ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                                <Zap size={18} fill={isUsingCreatine ? "currentColor" : "none"} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-tight text-zinc-900 dark:text-white">{t('usingCreatine')}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{isUsingCreatine ? t('creatineOn') : t('creatineOff')}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${isUsingCreatine ? 'bg-lime-400' : 'bg-zinc-300 dark:bg-zinc-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-xs ${isUsingCreatine ? 'left-5' : 'left-1'}`} />
                        </div>
                    </div>

                    {/* Notas Finais */}
                    <div className="bg-white dark:bg-zinc-900/50 p-5 rounded-[32px] border border-zinc-200 dark:border-zinc-800 focus-within:border-lime-500/50 dark:focus-within:border-lime-400/50 transition-all shadow-xs">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={14} className="text-zinc-500 dark:text-zinc-400" />
                            <label className="text-[10px] font-black uppercase text-zinc-500 dark:text-zinc-400 tracking-widest">{t('finalNotes')}</label>
                        </div>
                        <textarea
                            {...register("description")}
                            placeholder={t('notesPlaceholder')}
                            className="w-full bg-transparent border-none p-0 text-sm min-h-[80px] resize-none outline-none text-zinc-900 dark:text-zinc-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={22} className="animate-spin" />
                                {t('savingWorkout').toUpperCase()}
                            </>
                        ) : (
                            <>
                                <Save size={22} />
                                {t('saveAndFinish').toUpperCase()}
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}