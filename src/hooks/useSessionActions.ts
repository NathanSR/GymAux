import { useRouter } from '@/i18n/routing';
import { useAlerts } from './useAlerts';
import { SessionService } from '@/services/sessionService';
import { Workout, Session } from '@/config/types';
import { useTranslations } from 'next-intl';

export const useSessionActions = () => {
    const router = useRouter();
    const { confirm } = useAlerts();
    const t = useTranslations('Session');
    const th = useTranslations('Home');

    const startWorkout = async (workout: Workout) => {
        const result = await confirm({
            title: th('startWorkoutTitle') || 'Iniciar Treino?',
            text: th('startWorkoutText') || 'Você está pronto para começar?',
            icon: 'question',
            confirmText: th('startConfirm') || 'Sim, vamos!',
            cancelText: th('startCancel') || 'Agora não',
        });

        if (result.isConfirmed) {
            const session = await SessionService.startSession(workout);
            router.push(`/session/${session.id}`);
        }
    };

    const resumeWorkout = async (sessionId: string) => {
        const result = await confirm({
            title: th('resumeWorkoutTitle') || 'Continuar Treino?',
            text: th('resumeWorkoutText') || 'Você tem um treino em andamento. Vamos voltar?',
            icon: 'info',
            confirmText: th('resumeConfirm') || 'Continuar!',
            cancelText: th('resumeCancel') || 'Agora não',
        });

        if (result.isConfirmed) {
            await SessionService.resumeSession(sessionId);
            router.push(`/session/${sessionId}`);
        }
    };

    const exitSession = async (sessionId: string) => {
        const result = await confirm({
            title: t('exitTitle') || 'Pausar Treino?',
            text: t('exitText') || 'O tempo será pausado e você poderá continuar mais tarde na Home.',
            icon: 'warning',
            confirmText: t('exitConfirm') || 'Sim, pausar e sair',
            cancelText: t('exitCancel') || 'Cancelar',
        });

        if (result.isConfirmed) {
            await SessionService.pauseSession(sessionId);
            router.push('/home');
        }
    };

    const forceFinishWorkout = async (session: Session, setSession: (session: Session) => void, synchronizeProgress: () => Promise<void>) => {
        const result = await confirm({
            title: t('finishWorkoutTitle'),
            text: t('finishWorkoutText'),
            icon: 'warning',
            confirmText: t('finishConfirm'),
            cancelText: t('finishCancel'),
            danger: false, // In this app Lime is used for finish
        });

        if (result.isConfirmed) {
            if (!session.pausedAt && session.resumedAt) {
                const finalSegment = new Date().getTime() - session.resumedAt.getTime();
                session.duration += finalSegment;
            }

            session.current.step = 'completion';
            setSession({ ...session } as Session);
            await synchronizeProgress();
        }
    };

    return {
        startWorkout,
        resumeWorkout,
        exitSession,
        forceFinishWorkout,
    };
};
