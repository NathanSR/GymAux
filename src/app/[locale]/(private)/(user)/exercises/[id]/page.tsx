'use client';

import { use, useEffect, useState } from "react";
import { usePathname } from "@/i18n/routing";
import { ExerciseService } from "@/services/exerciseService";
import ViewExerciseClient from "@/components/exercises/ViewExerciseClient";
import { FormSkeleton } from "@/components/ui/Skeleton";
import { useRouter } from "@/i18n/routing";
import { Exercise } from "@/config/types";

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

export default function ExerciseDetailsPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const pathname = usePathname();
    const router = useRouter();

    const rawId = (resolvedParams?.id && resolvedParams.id !== 'template' && resolvedParams.id !== 'shell')
        ? resolvedParams.id
        : (pathname.match(/\/exercises\/([^/]+)/)?.[1] || resolvedParams?.id);

    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const exId = Number(rawId);

        if (isNaN(exId) || exId <= 0) {
            router.push('/exercises');
            return;
        }

        setLoading(true);
        ExerciseService.getExerciseById(exId)
            .then((data) => {
                if (!isMounted) return;
                if (data) {
                    setExercise(data);
                } else {
                    router.push('/exercises');
                }
            })
            .catch((err) => {
                console.warn('[ExerciseDetailsPage] Error fetching exercise:', err);
                if (isMounted) router.push('/exercises');
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });

        return () => {
            isMounted = false;
        };
    }, [rawId, router]);

    return (
        <ViewExerciseClient 
            exercise={exercise} 
            isFetching={loading && !exercise} 
        />
    );
}