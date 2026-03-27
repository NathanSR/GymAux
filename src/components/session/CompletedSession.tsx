'use client';

import { Trophy, Scale, MessageSquare, Zap, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Session } from '@/config/types';
import { SessionService } from '@/services/sessionService';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, watch, setValue } = useForm<CompletionFormData>({
        defaultValues: {
            userWeight: 0,
            description: '',
            usingCreatine: false
        }
    });

    const isUsingCreatine = watch('usingCreatine');

    const onFinishWorkout = async (data: CompletionFormData) => {
        if (!session.id) return;
        try {
            setIsSubmitting(true);
            await SessionService.finishSession(session.id, {
                weight: data.userWeight,
                description: data.description,
                usingCreatine: data.usingCreatine
            });
            router.push('/home');
        } catch (error) {
            console.error("Error finishing workout:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-8 flex flex-col items-center justify-center max-w-md mx-auto animate-in fade-in zoom-in-95 duration-500">
            <div className="w-full space-y-8">
                {/* Header de Sucesso */}
                <div className="text-center space-y-4">
                    <div className="inline-flex p-6 bg-lime-400 rounded-full shadow-2xl shadow-lime-400/20 mb-2">
                        <Trophy size={48} className="text-zinc-950" />
                    </div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                        {t('completedTitle')}
                    </h2>
                    <p className="text-zinc-500 text-sm font-medium">{t('completedSubtitle')}</p>
                </div>

                <form onSubmit={handleSubmit(onFinishWorkout)} className="space-y-4">
                    {/* Peso Corporal */}
                    <div className="bg-zinc-900/50 p-5 rounded-[32px] border border-zinc-800 focus-within:border-lime-400/50 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                            <Scale size={14} className="text-lime-400" />
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('bodyWeight')}</label>
                        </div>
                        <input
                            {...register("userWeight")}
                            type="number"
                            step="0.1"
                            className="w-full bg-transparent border-none p-0 font-bold text-2xl text-white outline-none"
                            placeholder="0.0"
                        />
                    </div>

                    {/* Switch de Creatina */}
                    <div
                        onClick={() => setValue('usingCreatine', !isUsingCreatine)}
                        className={`flex items-center justify-between p-5 rounded-[32px] border transition-all cursor-pointer ${isUsingCreatine ? 'bg-lime-400/10 border-lime-400/50' : 'bg-zinc-900/50 border-zinc-800'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-xl ${isUsingCreatine ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}>
                                <Zap size={18} fill={isUsingCreatine ? "currentColor" : "none"} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-tight">{t('usingCreatine')}</p>
                                <p className="text-[10px] text-zinc-500 font-bold">{isUsingCreatine ? t('creatineOn') : t('creatineOff')}</p>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full relative transition-colors ${isUsingCreatine ? 'bg-lime-400' : 'bg-zinc-700'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isUsingCreatine ? 'left-5' : 'left-1'}`} />
                        </div>
                    </div>

                    {/* Notas Finais */}
                    <div className="bg-zinc-900/50 p-5 rounded-[32px] border border-zinc-800 focus-within:border-lime-400/50 transition-all">
                        <div className="flex items-center gap-2 mb-3">
                            <MessageSquare size={14} className="text-zinc-500" />
                            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{t('finalNotes')}</label>
                        </div>
                        <textarea
                            {...register("description")}
                            placeholder={t('notesPlaceholder')}
                            className="w-full bg-transparent border-none p-0 text-sm min-h-[80px] resize-none outline-none text-zinc-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin" />
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