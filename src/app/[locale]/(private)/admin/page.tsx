import { createClient } from '@/lib/supabase/server';
import { adminService } from '@/services/adminService';
import AdminDashboardClient from '@/components/admin/AdminDashboardClient';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/admin/login');
  }

  // Busca estatísticas no Supabase
  const stats = await adminService.getAdminStats(supabase);

  return (
    <AdminDashboardClient stats={stats} />
  );
}
