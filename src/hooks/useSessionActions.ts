import { useRouter } from '@/i18n/routing';
import { useAlerts } from './useAlerts';
import { SessionService } from '@/services/sessionService';
import { Workout, Session } from '@/config/types';
import { useTranslations } from 'next-intl';
import { startTopLoader } from '@/utils/topLoader';

export const useSessionActions = () => {
    const router = useRouter();
    const { confirm } = useAlerts();
    const t = useTranslations('Session');
    const th = useTranslations('Home');

    const startWorkout = async (workout: Workout) => {
        const result = await confirm({
            title: th('startWorkoutTitle'),
            text: th('startWorkoutText'),
            icon: 'question',
            confirmText: th('startConfirm'),
            cancelText: th('startCancel'),
        });

        if (result.isConfirmed) {
            const session = await SessionService.startSession(workout);
            startTopLoader();
            router.push(`/session/${session.id}`);
        }
    };

    const resumeWorkout = async (sessionId: string) => {
        if (!sessionId) return;
        const result = await confirm({
            title: th('resumeWorkoutTitle'),
            text: th('resumeWorkoutText'),
            icon: 'info',
            confirmText: th('resumeConfirm'),
            cancelText: th('resumeCancel'),
        });

        if (result.isConfirmed) {
            await SessionService.resumeSession(sessionId);
            startTopLoader();
            router.push(`/session/${sessionId}`);
        }
    };

    const exitSession = async (sessionId: string) => {
        if (!sessionId) {
            startTopLoader();
            router.replace('/home');
            return;
        }
        const result = await confirm({
            title: t('exitTitle'),
            text: t('exitText'),
            icon: 'warning',
            confirmText: t('exitConfirm'),
            cancelText: t('exitCancel'),
        });

        if (result.isConfirmed) {
            await SessionService.pauseSession(sessionId);
            startTopLoader();
            setTimeout(() => {
                router.replace('/home');
            }, 50);
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
                const finalSegment = new Date().getTime() - new Date(session.resumedAt).getTime();
                session.duration += finalSegment;
            }

            session.current.step = 'completion';
            setSession({ ...session } as Session);
            await synchronizeProgress();
        }
    };

    const cancelSession = async (sessionId: string) => {
        const result = await confirm({
            title: th('cancelWorkoutTitle'),
            text: th('cancelWorkoutText'),
            icon: 'warning',
            confirmText: th('cancelConfirm'),
            cancelText: th('cancelCancel'),
            danger: true,
        });

        if (result.isConfirmed) {
            await SessionService.deleteSession(sessionId);
            router.refresh();
            return true;
        }
        return false;
    };

    return {
        startWorkout,
        resumeWorkout,
        exitSession,
        forceFinishWorkout,
        cancelSession,
    };
};
