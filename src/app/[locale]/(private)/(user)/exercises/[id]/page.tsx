// import { Metadata } from 'next';
import { ExerciseService } from "@/services/exerciseService";
import { createClient } from "@/lib/supabase/server";
import ViewExerciseClient from "@/components/exercises/ViewExerciseClient";
import { notFound } from "next/navigation";
// import { getTranslations } from 'next-intl/server';

interface PageProps {
    params: Promise<{ id: string; locale: string }>;
}

/**
 * Metadata Generation for SEO
 */
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//     const { id, locale } = await params;
//     const supabase = await createClient();
//     const exercise = await ExerciseService.getExerciseById(Number(id), supabase);
//     const t = await getTranslations({ locale, namespace: 'Exercises' });

//     if (!exercise) {
//         return {
//             title: 'Exercise Not Found | GymAux',
//         };
//     }

//     const name = t.has(exercise.name) ? t(exercise.name) : exercise.name;
//     const description = exercise.description 
//         ? (t.has(exercise.description) ? t(exercise.description) : exercise.description) 
//         : `Learn how to perform ${name} correctly with GymAux. Detailed instructions, tags, and category info.`;

//     return {
//         title: `${name} - GymAux Exercises`,
//         description: description,
//         keywords: [`gym`, `workout`, `exercise`, name, exercise.category, ...(exercise.tags || [])],
//         openGraph: {
//             title: `${name} | GymAux`,
//             description: description,
//             images: [
//                 {
//                     url: exercise.mediaUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
//                     width: 1200,
//                     height: 630,
//                     alt: name,
//                 }
//             ],
//             type: 'article',
//         },
//         twitter: {
//             card: 'summary_large_image',
//             title: name,
//             description: description,
//             images: [exercise.mediaUrl || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop'],
//         },
//     };
// }

/**
 * Exercise Details Page - Server Component
 * Fetches data on the server for better SEO and performance.
 */
export default async function ExerciseDetailsPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const exercise = await ExerciseService.getExerciseById(Number(id), supabase);

    if (!exercise) {
        notFound();
    }

    return (
        <ViewExerciseClient exercise={exercise} />
    );
}