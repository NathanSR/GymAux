'use client';

import { useState } from 'react';
import { useRouter, usePathname, Link } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  ClipboardList,
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Usuários', href: '/admin/users', icon: Users },
    { name: 'Exercícios', href: '/admin/exercises', icon: Dumbbell },
    { name: 'Treinos', href: '/admin/workouts', icon: ClipboardList },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-900 text-white select-none">
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-zinc-900/50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 shrink-0">
            <ShieldCheck size={22} />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col"
            >
              <span className="font-black italic uppercase tracking-tighter text-sm leading-none">GymAux</span>
              <span className="text-[10px] font-black uppercase tracking-wider text-lime-400">ADMINISTRADOR</span>
            </motion.div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all group overflow-hidden ${
                isActive ? 'text-lime-400' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {/* Active Background Slide */}
              {isActive && (
                <motion.div
                  layoutId="activeAdminTab"
                  className="absolute inset-0 bg-lime-500/10 border-l-[3px] border-lime-400 rounded-2xl animate-in fade-in"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              
              <Icon size={20} className="relative z-10 shrink-0" />
              
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 text-xs uppercase font-black tracking-wider"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Actions */}
      <div className="p-4 border-t border-zinc-900/50 space-y-2">
        {/* Ir para o App */}
        <Link
          href="/home"
          className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors group"
        >
          <ExternalLink size={18} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          {!collapsed && <span>Ir para o App</span>}
        </Link>

        {/* Sair */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:block h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-24' : 'w-64'} shrink-0 z-40`}>
        <SidebarContent />
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-20 -right-4 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-50 cursor-pointer"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </aside>

      {/* MOBILE HEADER & BURGER */}
      <header className="md:hidden flex items-center justify-between bg-zinc-950 border-b border-zinc-900 px-6 py-4 sticky top-0 z-40 text-white">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400">
            <ShieldCheck size={18} />
          </div>
          <span className="font-black italic uppercase tracking-tighter text-sm">GymAux Admin</span>
        </Link>
        
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white active:scale-95 transition-all cursor-pointer"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* MOBILE NAV OVERLAY */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-md z-30"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
