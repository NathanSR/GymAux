import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto min-h-screen pb-12">
        {children}
      </main>
    </div>
  );
}
