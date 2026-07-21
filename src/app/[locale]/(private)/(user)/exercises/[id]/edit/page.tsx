'use client';

import { use, useEffect, useState } from 'react';
import EditExerciseClient from '@/components/exercises/EditExerciseClient';
import { ExerciseService } from '@/services/exerciseService';
import { useSession } from '@/hooks/useSession';
import { useRouter } from '@/i18n/routing';
import { FormSkeleton } from '@/components/ui/Skeleton';

interface EditExercisePageProps {
    params: Promise<{ id: string }>;
}

export default function EditExercisePage({ params }: EditExercisePageProps) {
    const { id } = use(params);
    const router = useRouter();
    const { activeUser, loading: sessionLoading } = useSession();

    const [exercise, setExercise] = useState<any>(null);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const exId = Number(id);

        if (isNaN(exId) || exId < 1000) {
            router.push('/exercises');
            return;
        }

        ExerciseService.getExerciseById(exId).then(data => {
            if (!isMounted) return;
            if (
                !data || 
                data.created_by_type === 'system' || 
                (data.id && data.id < 1000) || 
                (activeUser?.id && data.created_by !== activeUser.id)
            ) {
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
    }, [id, activeUser?.id, router]);

    if ((sessionLoading || fetching) && !exercise) {
        return <FormSkeleton />;
    }

    if (!activeUser || !exercise) return null;

    return (
        <EditExerciseClient initialExercise={exercise} exerciseId={Number(id)} />
    );
}