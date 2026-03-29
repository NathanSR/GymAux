import SessionClient from '@/components/session/SessionClient';
import { createClient } from '@/lib/supabase/server';
import { SessionService } from '@/services/sessionService';
import { redirect } from 'next/navigation';

interface SessionPageProps {
    params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    const session = await SessionService.getSessionById(id, supabase);
    if (!session) {
        redirect('/home');
    }

    return (
        <SessionClient initialSession={session} />
    );
}