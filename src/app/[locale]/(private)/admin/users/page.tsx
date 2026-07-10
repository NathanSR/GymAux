import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import AdminUsersClient from '@/components/admin/AdminUsersClient';
import { redirect } from 'next/navigation';

export default async function AdminUsersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca todos os usuários
  const users = await adminService.getAllUsers(supabase);

  return (
    <AdminUsersClient initialUsers={users} />
  );
}
