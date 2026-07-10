'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Exercise } from '@/config/types';
import { Search, Plus, Dumbbell, ShieldAlert, Video, Trash2, Edit2, Shield, User as UserIcon, HelpCircle } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '@/services/adminService';
import { useAlerts } from '@/hooks/useAlerts';
import { useTranslations } from 'next-intl';
import { CATEGORIES, EQUIPMENT } from '@/config/constants';

interface AdminExercisesClientProps {
  initialExercises: (Exercise & { createdByName?: string })[];
  initialTotalCount: number;
}

export default function AdminExercisesClient({ initialExercises, initialTotalCount }: AdminExercisesClientProps) {
  const router = useRouter();
  const alerts = useAlerts();
  const tc = useTranslations('Categories');
  const te = useTranslations('Equipment');
  
  const [exercises, setExercises] = useState(initialExercises);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [equipmentFilter, setEquipmentFilter] = useState('all');
  const [originFilter, setOriginFilter] = useState<'all' | 'system' | 'user'>('all');

  // Estados de scroll infinito e carregamento
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialExercises.length < initialTotalCount);

  // Busca de dados paginados
  const fetchExercises = async (
    pageNum: number,
    isReset = false,
    currentSearch = search,
    currentCategory = categoryFilter,
    currentEquipment = equipmentFilter,
    currentOrigin = originFilter
  ) => {
    if (loading) return;
    setLoading(true);
    try {
      const limit = 12;
      const res = await adminService.getAllExercisesAdmin({
        search: currentSearch,
        category: currentCategory,
        equipment: currentEquipment,
        origin: currentOrigin,
        page: pageNum,
        limit
      });

      if (isReset) {
        setExercises(res.exercises);
        setHasMore(res.exercises.length === limit);
      } else {
        setExercises((prev) => {
          const existingIds = new Set(prev.map(e => e.id));
          const newExercises = res.exercises.filter(e => !existingIds.has(e.id));
          return [...prev, ...newExercises];
        });
        setHasMore(res.exercises.length === limit);
      }
    } catch (err) {
      console.error("[AdminExercisesClient] Erro ao carregar exercícios:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounce para a busca textual
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchExercises(1, true, search, categoryFilter, equipmentFilter, originFilter);
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Filtros de mudança instantânea (Categoria, Equipamento e Origem)
  useEffect(() => {
    setPage(1);
    fetchExercises(1, true, search, categoryFilter, equipmentFilter, originFilter);
  }, [categoryFilter, equipmentFilter, originFilter]);

  // Carrega mais quando o número da página aumenta
  useEffect(() => {
    if (page > 1) {
      fetchExercises(page, false);
    }
  }, [page]);

  // Observer para detecção do rodapé da lista
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleDelete = async (id: number, name: string) => {
    const result = await alerts.confirm({
      title: 'Excluir Exercício?',
      text: `Deseja realmente excluir o exercício "${name.toUpperCase()}"? Esta ação removerá o exercício do catálogo geral e de todos os treinos que o utilizam.`,
      icon: 'warning',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      danger: true,
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteExerciseAdmin(id);
        setExercises(exercises.filter(ex => ex.id !== id));
        alerts.success('Excluído!', 'O exercício foi excluído com sucesso.');
      } catch (err: any) {
        console.error('Erro ao excluir exercício:', err);
        alerts.error('Erro ao excluir', 'Não foi possível excluir o exercício.');
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

  const categories = [...CATEGORIES];
  const filteredExercises = exercises;

  return (
    <div className="p-6 md:p-10 space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter">Exercícios</h1>
          <p className="text-zinc-500 text-sm mt-1">Gerencie os exercícios do catálogo do sistema e dos usuários</p>
        </div>
        <Link
          href="/admin/exercises/new"
          className="flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-zinc-950 px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-lime-500/20 cursor-pointer"
        >
          <Plus size={16} /> Novo Exercício
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 bg-zinc-900/40 p-4 rounded-2xl border border-zinc-900">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome, descrição ou tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-xs font-semibold text-zinc-350 outline-none focus:border-lime-500/50 transition-all placeholder-zinc-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-350 outline-none focus:border-lime-500/50 transition-all appearance-none cursor-pointer min-w-[150px] text-zinc-300"
        >
          <option value="all">Todas Categorias</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {tc(cat).toUpperCase()}
            </option>
          ))}
        </select>

        {/* Equipment Filter */}
        <select
          value={equipmentFilter}
          onChange={(e) => setEquipmentFilter(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-xs font-semibold text-zinc-350 outline-none focus:border-lime-500/50 transition-all appearance-none cursor-pointer min-w-[150px] text-zinc-300"
        >
          <option value="all">Todos Equipamentos</option>
          {EQUIPMENT.map(eq => (
            <option key={eq} value={eq}>
              {te(eq).toUpperCase()}
            </option>
          ))}
        </select>

        {/* Origin Filter */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          {(['all', 'system', 'user'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => setOriginFilter(opt)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                originFilter === opt 
                  ? 'bg-lime-400 text-zinc-950 font-black shadow-md' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {opt === 'all' ? 'Todos' : opt === 'system' ? 'Sistema' : 'Usuários'}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <AnimatePresence mode="popLayout">
        {filteredExercises.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredExercises.map((ex) => (
              <motion.div
                key={ex.id}
                variants={cardVariants}
                className="p-6 rounded-3xl bg-zinc-900/50 border border-zinc-900 relative overflow-hidden flex flex-col justify-between hover:border-zinc-800 transition-colors"
              >
                {/* Top Header Card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-zinc-950 text-zinc-400 border border-zinc-800 uppercase">
                        {tc(ex.category)}
                      </span>

                      {ex.created_by_type === 'system' ? (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 uppercase">
                          <Shield size={10} /> Sistema
                        </span>
                      ) : (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 uppercase truncate max-w-[150px]" title={ex.createdByName}>
                          <UserIcon size={10} /> {ex.createdByName || 'Usuário'}
                        </span>
                      )}
                    </div>

                    {/* Media indicator */}
                    {ex.mediaUrl ? (
                      <span className="text-lime-400 text-xs flex items-center gap-1" title="Possui mídia demonstrativa">
                        <Video size={14} />
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-xs flex items-center gap-1" title="Sem mídia">
                        <Video size={14} className="opacity-40" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-black uppercase italic tracking-tighter text-zinc-100 mb-2 truncate">
                    {ex.name}
                  </h3>

                  {ex.description ? (
                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                      {ex.description}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-650 italic leading-relaxed mb-4">
                      Sem descrição cadastrada.
                    </p>
                  )}

                  {/* Tags list */}
                  {ex.tags && ex.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-6">
                      {ex.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold text-zinc-500 bg-zinc-950/40 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center justify-between border-t border-zinc-900/50 pt-4 mt-auto">
                  <div className="flex gap-2 text-[10px] text-zinc-500 font-bold uppercase">
                    <span>Nível: <strong className="text-zinc-350">{ex.level === 'beginner' ? 'Inic.' : ex.level === 'intermediate' ? 'Inter.' : 'Avanç.'}</strong></span>
                    <span>•</span>
                    <span>Visib.: <strong className={
                      ex.visibility === 'public'
                        ? 'text-lime-400'
                        : ex.visibility === 'students'
                        ? 'text-cyan-400'
                        : ex.visibility === 'restricted'
                        ? 'text-yellow-400'
                        : 'text-zinc-550'
                    }>{
                      ex.visibility === 'public'
                        ? 'Públ.'
                        : ex.visibility === 'students'
                        ? 'Alunos'
                        : ex.visibility === 'restricted'
                        ? 'Restr.'
                        : 'Priv.'
                    }</strong></span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/admin/exercises/${ex.id}/edit`}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors cursor-pointer"
                      title="Editar Exercício"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <button
                      onClick={() => ex.id && handleDelete(ex.id, ex.name)}
                      className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-red-400 hover:border-red-500/20 transition-colors cursor-pointer"
                      title="Excluir Exercício"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Elemento sentinela para carregar mais páginas */}
            <div ref={lastElementRef} className="col-span-full h-12 flex items-center justify-center mt-4">
              {loading && (
                <div className="flex items-center gap-2 text-zinc-500 font-bold uppercase text-[10px] tracking-wider">
                  <div className="w-4 h-4 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                  <span>Carregando mais exercícios...</span>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-zinc-900/10 rounded-3xl border border-zinc-900 border-dashed"
          >
            <Dumbbell className="text-zinc-700 mb-4 animate-pulse" size={48} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Nenhum exercício encontrado</h3>
            <p className="text-xs text-zinc-650 mt-1">Experimente mudar seus filtros de busca ou origem.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
