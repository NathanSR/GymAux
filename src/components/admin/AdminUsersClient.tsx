'use client';

import { useState } from 'react';
import { User } from '@/config/types';
import { Search, User as UserIcon, Mail, Calendar, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminUsersClientProps {
  initialUsers: User[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'trainer' | 'user'>('all');

  const filteredUsers = initialUsers.filter((u) => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()));
      
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'trainer': return 'Treinador';
      default: return 'Aluno';
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'trainer': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      default: return 'bg-zinc-800 text-zinc-400 border border-zinc-700/50';
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
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Usuários</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie os perfis e permissões dos usuários do sistema</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou e-mail..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-lime-500/50 rounded-xl py-3 pl-12 pr-4 text-sm font-semibold outline-none transition-all placeholder-zinc-650"
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-zinc-500 shrink-0" />
          <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
            {(['all', 'admin', 'trainer', 'user'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  roleFilter === role 
                    ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-500/10' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Todos' : role === 'admin' ? 'Admins' : role === 'trainer' ? 'Treinadores' : 'Alunos'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <AnimatePresence mode="wait">
        {filteredUsers.length > 0 ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                variants={cardVariants}
                whileHover={{ y: -4, borderColor: 'rgba(163, 230, 53, 0.2)' }}
                className="p-5 bg-zinc-900/40 border border-zinc-900 rounded-3xl flex items-start gap-4 transition-all relative overflow-hidden group"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 group-hover:border-lime-500/50 transition-colors"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lime-400 group-hover:border-lime-500/50 transition-colors">
                      <UserIcon size={24} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-black text-sm text-white truncate uppercase tracking-tight group-hover:text-lime-400 transition-colors">
                      {user.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${getRoleStyle(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  {user.email && (
                    <p className="text-zinc-500 text-xs font-semibold flex items-center gap-1.5 truncate">
                      <Mail size={12} className="shrink-0 text-zinc-600" />
                      {user.email}
                    </p>
                  )}

                  {/* Date Registered */}
                  <p className="text-zinc-500 text-[10px] font-bold flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar size={12} className="shrink-0 text-zinc-650" />
                    Registrado em: {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                  
                  {/* Stats (Weight/Height) */}
                  <div className="pt-2 flex gap-4 text-[10px] font-black uppercase tracking-wider text-zinc-400 border-t border-zinc-900/50 mt-2">
                    <span>Peso: <strong className="text-white font-bold">{user.weight}kg</strong></span>
                    <span>Altura: <strong className="text-white font-bold">{user.height}cm</strong></span>
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
            <UserIcon size={40} className="text-zinc-700" />
            <p className="text-sm font-bold uppercase tracking-wider">Nenhum usuário encontrado</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
