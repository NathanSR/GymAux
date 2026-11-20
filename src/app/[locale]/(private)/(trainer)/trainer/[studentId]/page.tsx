'use client';

import { use, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/config/db';
import { userService } from '@/services/userService';
import { useSession } from '@/hooks/useSession';
import { useDexieWorkouts, useDexieHistory, useDexieSessions } from '@/hooks/useDexieData';
import TrainerStudentDashboard from '@/components/trainers/TrainerStudentDashboard';
import { usePathname } from '@/i18n/routing';
import { resolveDynamicRouteId } from '@/utils/activeAuthUser';
import { User } from '@/config/types';
import { ListSkeleton } from '@/components/ui/Skeleton';

export default function TrainerStudentPage({
    params
}: {
    params: Promise<{ studentId: string }>;
}) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const studentId = resolveDynamicRouteId(/\/trainer\/([^/?#]+)/, pathname, resolvedParams?.studentId);
    const { activeUser } = useSession();

    const student = useLiveQuery(
        async () => {
            if (!studentId) return null;
            return (await db.users.get(studentId)) || null;
        },
        [studentId]
    );

    useEffect(() => {
        if (!studentId || typeof window === 'undefined' || !navigator.onLine) return;
        userService.getUserById(studentId).catch(() => {});
    }, [studentId]);

    const workouts = useDexieWorkouts(studentId);
    const recentHistory = useDexieHistory(studentId, 10);
    const sessions = useDexieSessions(studentId);

    const isInitialLoading = student === undefined && workouts === undefined;

    if (isInitialLoading) {
        return (
            <div className="flex-1 w-full max-w-5xl mx-auto p-6">
                <ListSkeleton count={4} />
            </div>
        );
    }

    const fallbackStudent: User = student || {
        id: studentId,
        name: 'Aluno',
        weight: 0,
        height: 0,
        role: 'user',
        createdAt: new Date(),
    };

    const activeSession = sessions && sessions.length > 0 ? sessions[0] : null;

    return (
        <TrainerStudentDashboard
            studentId={studentId}
            student={fallbackStudent}
            activeSession={activeSession}
            allSessions={sessions || []}
            recentHistory={recentHistory || []}
            workouts={workouts || []}
            trainerId={activeUser?.id}
        />
    );
}
