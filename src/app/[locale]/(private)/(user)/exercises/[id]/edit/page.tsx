'use client';

import { use, useEffect, useState } from 'react';
import EditExerciseClient from '@/components/exercises/EditExerciseClient';
import { ExerciseService } from '@/services/exerciseService';
import { useSession } from '@/hooks/useSession';
import { useRouter, usePathname } from '@/i18n/routing';
import { FormSkeleton } from '@/components/ui/Skeleton';

interface EditExercisePageProps {
    params: Promise<{ id: string }>;
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const rawId = (resolvedParams?.id && resolvedParams.id !== 'template' && resolvedParams.id !== 'shell')
        ? resolvedParams.id
        : (pathname.match(/\/exercises\/([^/]+)\/edit/)?.[1] || resolvedParams?.id);

    const [exercise, setExercise] = useState<any>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const exId = Number(rawId);

        if (isNaN(exId) || exId < 1000) {
            router.push('/exercises');
            return;
        }

        setFetching(true);
        ExerciseService.getExerciseById(exId).then(data => {
            if (!isMounted) return;
            if (
                !data || 
                data.created_by_type === 'system' || 
                (data.id && data.id < 1000)
            ) {
                router.push('/exercises');
            } else if (!sessionLoading && activeUser?.id && data.created_by && data.created_by !== activeUser.id) {
                router.push('/exercises');
            } else {
                setExercise({
                    ...data,
                    tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags
                });
            }
        }).catch(() => {
            if (isMounted) router.push('/exercises');
        }).finally(() => {
            if (isMounted) setFetching(false);
        });

        return () => {
            isMounted = false;
        };
    }, [rawId, activeUser?.id, sessionLoading, router]);

    const isFetching = (sessionLoading || fetching) && !exercise;

    return (
        <EditExerciseClient 
            initialExercise={exercise} 
            exerciseId={Number(rawId)} 
            isFetching={isFetching}
        />
    );
}