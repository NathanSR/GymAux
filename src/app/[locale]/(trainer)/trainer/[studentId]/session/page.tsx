import { SessionService } from '@/services/sessionService';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SessionClient from '@/components/session/SessionClient';

export default async function TrainerStudentSessionPage({
    params
}: {
    params: Promise<{ studentId: string }>
}) {
    const { studentId } = await params;
    const supabase = await createClient();

    const activeSession = await SessionService.getActiveSessionByUserId(studentId, supabase);

    if (!activeSession) {
        redirect(`/trainer/${studentId}`);
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">
             <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-500 p-2 text-[10px] font-black uppercase text-center tracking-[0.3em] z-50 backdrop-blur-md">
                Monitor Mode - Viewing Student Live Session
             </div>
             <div className="flex-1 relative">
                <SessionClient initialSession={activeSession} isReadOnly={true} />
             </div>
        </div>
    );
}
