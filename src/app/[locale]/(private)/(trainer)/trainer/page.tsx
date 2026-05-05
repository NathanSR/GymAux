import { createClient } from '@/lib/supabase/server';
import { connectionService } from '@/services/connectionService';
import { userService } from '@/services/userService';
import TrainerClient from '@/components/trainers/TrainerClient';
import { redirect } from 'next/navigation';

export default async function TrainerDashboardPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    // const activeUser = await userService.getUserById(user.id, supabase);
    // if (!activeUser || activeUser.role !== 'trainer') {
    //     redirect('/');
    // }

    const activeStudents = await connectionService.getActiveStudents(user.id, supabase);

    return (
        <TrainerClient
            trainerId={user.id}
            initialStudents={activeStudents.students.map(c => ({
                id: c.id,
                name: c.name,
                avatar: c.avatar
            }))}
        />
    );
}
