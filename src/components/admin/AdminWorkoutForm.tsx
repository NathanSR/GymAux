'use client';

import { useState } from 'react';
import { User, Exercise } from '@/config/types';
import { Search, User as UserIcon, Check, ChevronDown } from 'lucide-react';
import WorkoutForm from '@/components/workouts/WorkoutForm';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminWorkoutFormProps {
  users: User[];
  availableExercises: Exercise[];
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export default function AdminWorkoutForm({
  users,
  availableExercises,
  initialData,
  onSubmit,
  isLoading
}: AdminWorkoutFormProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(
    initialData?.userId ? (users.find(u => u.id === initialData.userId) || null) : null
  );
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter(
    u => u.name.toLowerCase().includes(search.toLowerCase()) || 
         (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleFormSubmit = (formData: any) => {
    if (!selectedUser) {
      toast.error('Por favor, selecione um aluno para este treino.');
      return;
    }

    onSubmit({
      ...formData,
      userId: selectedUser.id,
    });
  };

  return (
    <div className="space-y-8">
      {/* Seletor de Aluno */}
      <div className="bg-zinc-900/40 border border-zinc-900 p-6 rounded-3xl space-y-4">
        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-500 ml-1">
          Aluno do Treino
        </label>
        
        {initialData?.userId ? (
          // Em modo de edição, exibe o usuário fixado e desabilitado
          <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
            {selectedUser?.avatar ? (
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-xl object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-lime-400">
                <UserIcon size={18} />
              </div>
            )}
            <div>
              <p className="font-bold text-sm uppercase text-white leading-tight">{selectedUser?.name}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{selectedUser?.email || 'Sem e-mail cadastrado'}</p>
            </div>
          </div>
        ) : (
          // Em modo de criação, exibe o seletor combobox com busca
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 focus:border-lime-500/50 rounded-2xl text-left text-sm font-bold text-white transition-all outline-none cursor-pointer"
            >
              {selectedUser ? (
                <div className="flex items-center gap-3">
                  {selectedUser.avatar ? (
                    <img
                      src={selectedUser.avatar}
                      alt={selectedUser.name}
                      className="w-6 h-6 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-lime-400">
                      <UserIcon size={12} />
                    </div>
                  )}
                  <span className="uppercase text-xs tracking-wide">{selectedUser.name}</span>
                </div>
              ) : (
                <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Selecione um aluno...</span>
              )}
              <ChevronDown size={18} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-3 space-y-3"
                >
                  {/* Busca no seletor */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar alunos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-white outline-none focus:border-lime-500/50 transition-all placeholder-zinc-700"
                    />
                  </div>

                  {/* Lista de alunos */}
                  <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setSelectedUser(u);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-zinc-800 transition-colors cursor-pointer ${
                            selectedUser?.id === u.id ? 'bg-zinc-800' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {u.avatar ? (
                              <img
                                src={u.avatar}
                                alt={u.name}
                                className="w-6 h-6 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 rounded-lg bg-zinc-950 border border-zinc-850 flex items-center justify-center text-lime-400">
                                <UserIcon size={12} />
                              </div>
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-white uppercase leading-tight truncate">{u.name}</span>
                              <span className="text-[10px] text-zinc-550 leading-none truncate mt-0.5">{u.email || 'Sem e-mail'}</span>
                            </div>
                          </div>
                          {selectedUser?.id === u.id && <Check size={14} className="text-lime-400 shrink-0" />}
                        </button>
                      ))
                    ) : (
                      <p className="text-center py-4 text-xs font-bold uppercase tracking-wider text-zinc-600">Nenhum aluno encontrado</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Formulário Principal */}
      <WorkoutForm
        initialData={initialData}
        availableExercises={availableExercises}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
