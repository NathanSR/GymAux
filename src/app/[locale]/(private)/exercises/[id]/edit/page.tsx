import EditExerciseClient from '@/components/exercises/EditExerciseClient';
import { ExerciseService } from '@/services/exerciseService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface EditExercisePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditExercisePage({ params }: EditExercisePageProps) {
    const { id } = await params;
    const supabase = await createClient();

    const data: any = await ExerciseService.getExerciseById(Number(id), supabase);
    if (!data) {
        redirect('/exercises');
    }

    // Preparar dados para o cliente
    const exerciseWithTagString = {
        ...data,
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : data.tags
    };

    return (
        <EditExerciseClient initialExercise={exerciseWithTagString} exerciseId={Number(id)} />
    );
}