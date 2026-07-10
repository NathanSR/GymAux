'use client';

import { useState } from 'react';
import { Search, Plus, Trash2, Edit2, Dumbbell, User as UserIcon, Calendar } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { WorkoutService } from '@/services/workoutService';
import { useAlerts } from '@/hooks/useAlerts';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminWorkoutsClientProps {
  initialWorkouts: any[];
  adminId: string;
}

export default function AdminWorkoutsClient({ initialWorkouts, adminId }: AdminWorkoutsClientProps) {
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const [search, setSearch] = useState('');
  const alerts = useAlerts();

  const filteredWorkouts = workouts.filter((w) => {
    const matchesName = w.name.toLowerCase().includes(search.toLowerCase());
    const matchesUser = w.user && w.user.name.toLowerCase().includes(search.toLowerCase());
    return matchesName || matchesUser;
  });

  const handleDelete = async (workoutId: string, workoutName: string) => {
    const result = await alerts.confirm({
      title: 'Excluir Treino?',
      text: `Tem certeza que deseja excluir o treino "${workoutName}"? Essa ação não pode ser desfeita.`,
      icon: 'warning',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      danger: true,
    });

    if (result.isConfirmed) {
      try {
        await WorkoutService.deleteWorkout(workoutId, adminId);
        setWorkouts(workouts.filter((w) => w.id !== workoutId));
        alerts.success('Treino Excluído', 'O treino foi removido com sucesso.');
      } catch (err: any) {
        alerts.error('Erro ao excluir', err?.message || 'Ocorreu um erro ao excluir o treino.');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Treinos</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie os treinos cadastrados para todos os usuários</p>
        </div>
        <Link
          href="/admin/workouts/new"
          className="bg-lime-400 hover:bg-lime-500 text-zinc-950 px-5 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xl shadow-lime-500/10 cursor-pointer self-start md:self-auto active:scale-95 shrink-0"
        >
          <Plus size={16} strokeWidth={3} />
          Novo Treino
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome do treino ou do aluno..."
          className="w-full bg-zinc-900 border border-zinc-800 focus:border-lime-500/50 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder-zinc-650"
        />
      </div>

      {/* Workouts Grid */}
      <AnimatePresence mode="wait">
        {filteredWorkouts.length > 0 ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredWorkouts.map((workout) => (
              <motion.div
                key={workout.id}
                variants={cardVariants}
                whileHover={{ y: -4, borderColor: 'rgba(163, 230, 53, 0.2)' }}
                className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-3xl flex flex-col justify-between gap-5 transition-all relative overflow-hidden group min-h-[220px]"
              >
                {/* Upper Section */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-sm text-white truncate uppercase tracking-tight group-hover:text-lime-400 transition-colors">
                      {workout.name}
                    </h3>
                    <div className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[8px] font-black uppercase tracking-wider text-zinc-400 flex items-center gap-1 shrink-0">
                      <Dumbbell size={10} />
                      {workout.exercises.length} {workout.exercises.length === 1 ? 'Grupo' : 'Grupos'}
                    </div>
                  </div>

                  {workout.description ? (
                    <p className="text-zinc-400 text-xs font-medium line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>
                  ) : (
                    <p className="text-zinc-600 text-xs italic font-medium">Sem descrição cadastrada</p>
                  )}
                </div>

                {/* Lower Section (User Profile & Actions) */}
                <div className="space-y-4 pt-3 border-t border-zinc-900/50">
                  {/* User Profile */}
                  <div className="flex items-center gap-2">
                    {workout.user?.avatar ? (
                      <img
                        src={workout.user.avatar}
                        alt={workout.user.name}
                        className="w-7 h-7 rounded-full object-cover border border-zinc-800"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-lime-400">
                        <UserIcon size={12} />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-wider leading-none">Aluno</span>
                      <span className="text-xs font-bold text-zinc-300 truncate leading-tight uppercase mt-0.5">{workout.user?.name || 'Sistema'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[8px] font-bold text-zinc-650 uppercase flex items-center gap-1 tracking-wider">
                      <Calendar size={10} />
                      {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {/* Editar */}
                      <Link
                        href={`/admin/workouts/${workout.id}/edit`}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-lime-500/30 text-zinc-400 hover:text-white transition-all active:scale-90"
                        title="Editar Treino"
                      >
                        <Edit2 size={14} />
                      </Link>

                      {/* Excluir */}
                      <button
                        onClick={() => handleDelete(workout.id, workout.name)}
                        className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-red-500/10 hover:border-red-500/30 text-zinc-400 hover:text-red-400 transition-all active:scale-90 cursor-pointer"
                        title="Excluir Treino"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-zinc-500 space-y-3"
          >
            <Dumbbell size={40} className="text-zinc-700" />
            <p className="text-sm font-bold uppercase tracking-wider">Nenhum treino encontrado</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
