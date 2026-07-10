'use client';

import { Users, Dumbbell, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface AdminDashboardClientProps {
  stats: {
    totalUsers: number;
    totalWorkouts: number;
    totalActiveSessions: number;
  };
}

export default function AdminDashboardClient({ stats }: AdminDashboardClientProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-lime-500/20 to-emerald-500/10',
      iconColor: 'text-lime-400',
      description: 'Usuários cadastrados no aplicativo'
    },
    {
      title: 'Treinos Planejados',
      value: stats.totalWorkouts,
      icon: Dumbbell,
      color: 'from-blue-500/20 to-indigo-500/10',
      iconColor: 'text-blue-400',
      description: 'Treinos montados por usuários/admins'
    },
    {
      title: 'Treinos Iniciados',
      value: stats.totalActiveSessions,
      icon: Activity,
      color: 'from-amber-500/20 to-orange-500/10',
      iconColor: 'text-amber-400',
      description: 'Sessões de treino em andamento no banco'
    }
  ];

  return (
    <div className="p-6 md:p-10 space-y-10 text-white">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Painel de Controle</h1>
          <p className="text-zinc-500 text-sm mt-1">Estatísticas globais e gerenciamento do GymAux</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider text-lime-400">
          <ShieldCheck size={16} />
          Modo Administrador Ativo
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              variants={itemVariants}
              whileHover={{ y: -5, borderColor: 'rgba(163, 230, 53, 0.2)' }}
              className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-900 relative overflow-hidden flex flex-col justify-between min-h-[160px] transition-colors"
            >
              {/* Background gradient overlay */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.color} blur-[40px] rounded-full pointer-events-none -mr-8 -mt-8`} />

              <div className="flex items-center justify-between relative z-10">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{card.title}</span>
                <div className={`p-3 rounded-2xl bg-zinc-900 border border-zinc-800 ${card.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>

              <div className="mt-4 relative z-10">
                <span className="text-4xl font-black tracking-tight">{card.value}</span>
                <p className="text-zinc-500 text-xs mt-1 font-medium">{card.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <h2 className="text-lg font-black uppercase tracking-wider text-zinc-400">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/workouts/new"
            className="group flex items-center justify-between p-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-850 hover:border-lime-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <Dumbbell size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">Criar Novo Treino</span>
                <span className="text-zinc-500 text-xs font-medium">Cadastrar treino para usuário</span>
              </div>
            </div>
            <ArrowRight size={18} className="text-zinc-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/users"
            className="group flex items-center justify-between p-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-850 hover:border-lime-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <Users size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">Gerenciar Usuários</span>
                <span className="text-zinc-500 text-xs font-medium">Listar e analisar alunos</span>
              </div>
            </div>
            <ArrowRight size={18} className="text-zinc-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/workouts"
            className="group flex items-center justify-between p-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800/80 border border-zinc-850 hover:border-lime-500/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-lime-500/10 text-lime-400 group-hover:scale-110 transition-transform">
                <Dumbbell size={20} />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-sm">Gerenciar Treinos</span>
                <span className="text-zinc-500 text-xs font-medium">Listar, editar e excluir treinos</span>
              </div>
            </div>
            <ArrowRight size={18} className="text-zinc-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
