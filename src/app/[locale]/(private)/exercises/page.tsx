import ExercisesClient from '@/components/exercises/ExercisesClient';
import { ExerciseService } from '@/services/exerciseService';
import { createClient } from '@/lib/supabase/server';
import { getTranslations } from 'next-intl/server';

export default async function ExerciseLibraryPage() {
    const supabase = await createClient();
    const te = await getTranslations('Exercises');
    const tt = await getTranslations('Tags');

    // Busca inicial no servidor
    const { exercises: initialExercises, totalCount: initialTotalCount } = await ExerciseService.getAllExercises({
        supabase,
        pagination: { page: 1, limit: 20 },
        translations: { te, tt }
    });

    return (
        <ExercisesClient 
            initialExercises={initialExercises} 
            initialTotalCount={initialTotalCount} 
        />
    );
}