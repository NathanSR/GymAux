import EditProfileClient from '@/components/profile/EditProfileClient';
import { createClient } from '@/lib/supabase/server';
import { userService } from '@/services/userService';
import { redirect } from 'next/navigation';

export default async function EditProfilePage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect('/');
    }

    const activeUser = await userService.getUserById(user.id, supabase);
    if (!activeUser) {
        redirect('/home');
    }

    return (
        <EditProfileClient initialUser={activeUser} />
    );
}