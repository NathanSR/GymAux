import SessionClient from '@/components/session/SessionClient';
import { createClient } from '@/lib/supabase/server';
import { SessionService } from '@/services/sessionService';
import { redirect } from 'next/navigation';

export default async function SessionPage({ params }: { params: Promise<{ id: string, locale: string }> }) {
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

    const isReadOnly = session.current.step === 'completion';

    return (
        <SessionClient initialSession={session!} isReadOnly={isReadOnly} />
    );
}