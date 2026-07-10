"use client";

import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Save,
    Dumbbell,
    Video,
    Tag as TagIcon,
    AlertCircle,
    Type,
    AlignLeft,
    ListOrdered,
    UploadCloud,
    Trash2,
    Check,
    ChevronDown,
    Search,
    User as UserIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/config/constants';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';
import { User } from '@/config/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { connectionService } from '@/services/connectionService';

interface ExerciseFormProps {
    initialData?: {
        name: string;
        category: string;
        description: string;
        howTo: string;
        mediaUrl: string;
        tags: string;
        level?: "beginner" | "intermediate" | "advanced";
        isPublic?: boolean;
        visibility?: "public" | "private" | "students" | "restricted";
        shared_with?: string[];
        equipment?: string;
        executionMode?: string;
        mechanics?: string;
        created_by?: string;
        created_by_type?: "user" | "system" | "trainer";
    };
    onSubmit: (data: any) => void;
    isLoading?: boolean;
    showAdminFields?: boolean;
    users?: User[];
}

export default function ExerciseForm({ 
    initialData, 
    onSubmit, 
    isLoading,
    showAdminFields = false,
    users = []
}: ExerciseFormProps) {
    const t = useTranslations('ExerciseForm');
    const tc = useTranslations('Categories');

    // Estado da aba de mídia
    const [mediaType, setMediaType] = useState<'upload' | 'url'>(
        initialData?.mediaUrl && !initialData.mediaUrl.includes('supabase.co/storage') ? 'url' : 'upload'
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.mediaUrl || null);
    const [isUploading, setIsUploading] = useState(false);

    // Estados de proprietário (Apenas admin)
    const [createdByOption, setCreatedByOption] = useState<'system' | 'user'>(
        initialData?.created_by_type === 'user' ? 'user' : 'system'
    );
    const [selectedUser, setSelectedUser] = useState<User | null>(
        initialData?.created_by ? (users.find(u => u.id === initialData.created_by) || null) : null
    );
    const [userSelectOpen, setUserSelectOpen] = useState(false);
    const [userSearch, setUserSearch] = useState('');

    const { activeUser } = useSession();
    const [connections, setConnections] = useState<{ id: string; name: string; avatar: string | null; type: 'student' | 'trainer' }[]>([]);
    const [loadingConnections, setLoadingConnections] = useState(false);

    const [visibility, setVisibility] = useState<'public' | 'private' | 'students' | 'restricted'>(
        initialData?.visibility || (initialData?.isPublic ? 'public' : 'private')
    );
    const [sharedWith, setSharedWith] = useState<string[]>(initialData?.shared_with || []);

    useEffect(() => {
        async function fetchConnections() {
            if (!activeUser?.id) return;
            setLoadingConnections(true);
            try {
                const supabase = createClient();
                const connList = await connectionService.getActiveConnections(activeUser.id, activeUser.role, supabase);
                setConnections(connList);
            } catch (err) {
                console.error('[ExerciseForm] Error fetching connections:', err);
            } finally {
                setLoadingConnections(false);
            }
        }
        fetchConnections();
    }, [activeUser]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: initialData?.name || '',
            category: initialData?.category || 'chest',
            description: initialData?.description || '',
            howTo: initialData?.howTo || '',
            mediaUrl: initialData?.mediaUrl || '',
            tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : '',
            level: initialData?.level || 'beginner',
            isPublic: initialData?.isPublic ?? true,
            equipment: initialData?.equipment || 'none',
            executionMode: initialData?.executionMode || 'bilateral',
            mechanics: initialData?.mechanics || 'compound'
        }
    });

    const categories = useMemo(() => {
        return [...CATEGORIES];
    }, []);

    // Manipula o arquivo selecionado para upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 15 * 1024 * 1024) {
            toast.error('O arquivo é muito grande! Escolha um arquivo de até 15MB.');
            return;
        }

        setSelectedFile(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
    };

    // Remove a mídia selecionada
    const handleRemoveMedia = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setValue('mediaUrl', '');
    };

    // Interceptador de envio do formulário
    const handleFormSubmit = async (data: any) => {
        if (showAdminFields && createdByOption === 'user' && !selectedUser) {
            toast.error('Por favor, selecione um aluno para vincular este exercício.');
            return;
        }

        let finalMediaUrl = data.mediaUrl;
        setIsUploading(true);

        try {
            if (mediaType === 'upload' && selectedFile) {
                const supabase = createClient();
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `exercises/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('exercise-media')
                    .upload(filePath, selectedFile, {
                        cacheControl: '3600',
                        upsert: false
                    });

                if (uploadError) {
                    throw uploadError;
                }

                // Obtém a URL pública do bucket
                const { data: { publicUrl } } = supabase.storage
                    .from('exercise-media')
                    .getPublicUrl(filePath);

                finalMediaUrl = publicUrl;
            }

            onSubmit({
                ...data,
                mediaUrl: finalMediaUrl,
                created_by: showAdminFields ? (createdByOption === 'user' ? selectedUser?.id : null) : undefined,
                created_by_type: showAdminFields ? createdByOption : undefined,
                visibility,
                shared_with: visibility === 'restricted' ? sharedWith : [],
            });
        } catch (err: any) {
            console.error('[ExerciseForm] Error uploading media:', err);
            toast.error('Erro ao fazer upload do arquivo demonstrativo. Verifique sua conexão.');
        } finally {
            setIsUploading(false);
        }
    };

    // Verifica se a mídia atual é um vídeo
    const isVideo = (url: string | null) => {
        if (!url) return false;
        return (
            selectedFile?.type.startsWith('video/') ||
            url.toLowerCase().endsWith('.mp4') ||
            url.toLowerCase().endsWith('.webm') ||
            url.toLowerCase().includes('.mp4?') ||
            url.includes('storage.googleapis.com') ||
            url.includes('youtube.com') ||
            url.includes('youtu.be')
        );
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Seletor de Proprietário (Apenas Admin) */}
            {showAdminFields && (
                <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-900 p-6 rounded-3xl space-y-4">
                    <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 ml-1">
                        Origem / Proprietário do Exercício
                    </label>
                    
                    <div className="flex bg-zinc-200 dark:bg-zinc-950 p-1 rounded-xl w-fit">
                      <button
                        type="button"
                        onClick={() => {
                            setCreatedByOption('system');
                            setSelectedUser(null);
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          createdByOption === 'system' 
                            ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-500/10' 
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                      >
                        Sistema (Global)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                            setCreatedByOption('user');
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                          createdByOption === 'user' 
                            ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-500/10' 
                            : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
                        }`}
                      >
                        Aluno Específico
                      </button>
                    </div>

                    {createdByOption === 'user' && (
                        <div className="relative mt-2">
                            {initialData?.created_by ? (
                                <div className="flex items-center gap-3 p-4 bg-zinc-200/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                                    {selectedUser?.avatar ? (
                                        <img src={selectedUser.avatar} alt={selectedUser.name} className="w-8 h-8 rounded-lg object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-lg bg-zinc-105 dark:bg-zinc-950 flex items-center justify-center text-lime-400">
                                            <UserIcon size={14} />
                                        </div>
                                    )}
                                    <span className="text-xs font-bold uppercase">{selectedUser?.name || 'Carregando...'}</span>
                                </div>
                            ) : (
                                <>
                                    <button
                                      type="button"
                                      onClick={() => setUserSelectOpen(!userSelectOpen)}
                                      className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:border-lime-500/50 rounded-2xl text-left text-sm font-bold text-zinc-900 dark:text-white transition-all outline-none cursor-pointer"
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
                                            <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-lime-400">
                                              <UserIcon size={12} />
                                            </div>
                                          )}
                                          <span className="uppercase text-xs tracking-wide">{selectedUser.name}</span>
                                        </div>
                                      ) : (
                                        <span className="text-zinc-500 text-xs uppercase tracking-wider font-bold">Selecione o aluno...</span>
                                      )}
                                      <ChevronDown size={18} className={`text-zinc-500 transition-transform ${userSelectOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    <AnimatePresence>
                                      {userSelectOpen && (
                                        <motion.div
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          exit={{ opacity: 0, y: 10 }}
                                          className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-850 rounded-2xl shadow-2xl p-3 space-y-3"
                                        >
                                          <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                                            <input
                                              type="text"
                                              placeholder="Filtrar alunos..."
                                              value={userSearch}
                                              onChange={(e) => setUserSearch(e.target.value)}
                                              className="w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-zinc-900 dark:text-white outline-none focus:border-lime-500/50 transition-all placeholder-zinc-500"
                                            />
                                          </div>

                                          <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                                            {users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase())).length > 0 ? (
                                              users
                                                .filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()))
                                                .map((u) => (
                                                  <button
                                                    key={u.id}
                                                    type="button"
                                                    onClick={() => {
                                                      setSelectedUser(u);
                                                      setUserSelectOpen(false);
                                                    }}
                                                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ${
                                                      selectedUser?.id === u.id ? 'bg-zinc-100 dark:bg-zinc-800' : ''
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
                                                        <div className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-950 flex items-center justify-center text-lime-400">
                                                          <UserIcon size={12} />
                                                        </div>
                                                      )}
                                                      <span className="text-xs font-bold text-zinc-900 dark:text-white uppercase leading-tight truncate">{u.name}</span>
                                                    </div>
                                                    {selectedUser?.id === u.id && <Check size={14} className="text-lime-500 shrink-0" />}
                                                  </button>
                                                ))
                                            ) : (
                                              <p className="text-center py-4 text-xs font-bold uppercase tracking-wider text-zinc-500">Nenhum aluno encontrado</p>
                                            )}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                </>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Nome do Exercício */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <Type size={12} /> {t('nameLabel')}
                </label>
                <input
                    {...register("name", { required: t('nameRequired') })}
                    placeholder={t('namePlaceholder')}
                    className={`w-full bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none transition-all shadow-sm text-zinc-900 dark:text-white`}
                />
                {errors.name && (
                    <span className="text-[10px] text-red-500 mt-2 ml-1 flex items-center gap-1 font-bold animate-in fade-in slide-in-from-left-2">
                        <AlertCircle size={10} /> {errors.name.message}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categoria */}
                <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                        <Dumbbell size={12} /> {t('categoryLabel')}
                    </label>
                    <div className="relative">
                        <select
                            {...register("category")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-lime-400 shadow-sm text-zinc-900 dark:text-white"
                        >
                            {categories.map(c => (
                                <option key={c} value={c}>
                                    {tc(c).toUpperCase()}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                            <Dumbbell size={16} />
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                        <TagIcon size={12} /> {t('tagsLabel')}
                    </label>
                    <input
                        {...register("tags")}
                        placeholder={t('tagsPlaceholder')}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none shadow-sm text-zinc-900 dark:text-white"
                    />
                </div>
            </div>

            {/* Descrição Curta */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <AlignLeft size={12} /> {t('descriptionLabel')}
                </label>
                <textarea
                    {...register("description")}
                    rows={2}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-none shadow-sm text-zinc-900 dark:text-white"
                />
            </div>

            {/* Instruções de Execução (How To) */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <ListOrdered size={12} /> {t('howToLabel')}
                </label>
                <textarea
                    {...register("howTo")}
                    rows={5}
                    placeholder={t('howToPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-y min-h-[120px] shadow-sm text-zinc-900 dark:text-white"
                />
                <p className="text-[9px] text-zinc-500 mt-2 ml-1 italic">
                    {t('howToHint')}
                </p>
            </div>

            {/* Configurações Avançadas (Apenas Admin) */}
            {showAdminFields && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-zinc-50 dark:bg-zinc-900/30 p-6 rounded-3xl border border-zinc-150 dark:border-zinc-900">
                    {/* Dificuldade */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1">
                            Dificuldade
                        </label>
                        <select
                            {...register("level")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 shadow-sm text-zinc-900 dark:text-white"
                        >
                            <option value="beginner">Iniciante</option>
                            <option value="intermediate">Intermediário</option>
                            <option value="advanced">Avançado</option>
                        </select>
                    </div>

                    {/* Equipamento */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1">
                            Equipamento
                        </label>
                        <select
                            {...register("equipment")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 shadow-sm text-zinc-900 dark:text-white"
                        >
                            <option value="none">Nenhum</option>
                            <option value="barbell">Barra</option>
                            <option value="dumbbell">Halter</option>
                            <option value="machine">Máquina</option>
                            <option value="cable">Polia / Cabo</option>
                            <option value="bodyweight">Peso Corporal</option>
                            <option value="smith">Smith / Guiado</option>
                            <option value="kettlebell">Kettlebell</option>
                        </select>
                    </div>

                    {/* Modo de Execução */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1">
                            Modo de Execução
                        </label>
                        <select
                            {...register("executionMode")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 shadow-sm text-zinc-900 dark:text-white"
                        >
                            <option value="bilateral">Bilateral</option>
                            <option value="unilateral">Unilateral</option>
                            <option value="alternating">Alternado</option>
                        </select>
                    </div>

                    {/* Mecânica */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1">
                            Mecânica
                        </label>
                        <select
                            {...register("mechanics")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 shadow-sm text-zinc-900 dark:text-white"
                        >
                            <option value="compound">Composto</option>
                            <option value="isolation">Isolador</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Seletor e Campo de Mídia */}
            <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase text-zinc-400 ml-1 flex items-center gap-2">
                    <Video size={12} /> {t('mediaLabel')}
                </label>

                {/* Abas Animadas */}
                <div className="flex bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-xl w-fit">
                  <button
                    type="button"
                    onClick={() => {
                        setMediaType('upload');
                        setPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : (initialData?.mediaUrl && initialData.mediaUrl.includes('supabase.co/storage') ? initialData.mediaUrl : null));
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      mediaType === 'upload' 
                        ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-500/10' 
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Upload Local
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                        setMediaType('url');
                        setPreviewUrl(initialData?.mediaUrl && !initialData.mediaUrl.includes('supabase.co/storage') ? initialData.mediaUrl : '');
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      mediaType === 'url' 
                        ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-500/10' 
                        : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    Link Externo
                  </button>
                </div>

                {mediaType === 'upload' ? (
                    <div className="space-y-4">
                        {previewUrl ? (
                            /* Pré-visualização do Arquivo */
                            <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-2 flex flex-col items-center group">
                                {isVideo(previewUrl) ? (
                                    <video src={previewUrl} controls className="w-full max-h-56 rounded-2xl object-contain bg-black" />
                                ) : (
                                    <img src={previewUrl} alt="Visualização do exercício" className="w-full max-h-56 rounded-2xl object-contain bg-black" />
                                )}
                                
                                <button
                                    type="button"
                                    onClick={handleRemoveMedia}
                                    className="absolute top-4 right-4 p-2.5 rounded-xl bg-zinc-950/80 hover:bg-red-500 border border-white/10 text-white transition-all shadow-xl active:scale-95 cursor-pointer"
                                    title="Remover mídia"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ) : (
                            /* Campo de Drag and Drop */
                            <div className="relative border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 text-center hover:border-lime-500/50 transition-all cursor-pointer group bg-white dark:bg-zinc-900/20">
                                <input 
                                    type="file" 
                                    accept="image/*,video/*" 
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                />
                                <UploadCloud className="mx-auto text-zinc-400 group-hover:text-lime-400 transition-colors mb-3" size={32} />
                                <span className="text-xs text-zinc-500 group-hover:text-zinc-400 font-bold block uppercase tracking-wider transition-colors">
                                    Arraste ou clique para enviar foto/vídeo
                                </span>
                                <span className="text-[10px] text-zinc-400 dark:text-zinc-650 block mt-1 font-medium">
                                    Suporta arquivos MP4, WEBM, GIF, PNG ou JPG de até 15MB
                                </span>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Campo de URL do Vídeo */
                    <div className="relative">
                        <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            {...register("mediaUrl")}
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none shadow-sm text-zinc-900 dark:text-white"
                        />
                    </div>
                )}
            </div>

            {/* Seção de Visibilidade / Compartilhamento */}
            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-150 dark:border-zinc-800 p-6 rounded-3xl space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 ml-1">
                    Visibilidade / Compartilhamento
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {/* Opção Privado */}
                    <button
                        type="button"
                        onClick={() => setVisibility('private')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            visibility === 'private'
                                ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold shadow-md shadow-lime-500/10'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 hover:border-zinc-350 dark:hover:border-zinc-700'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">Privado</span>
                        <span className="text-[9px] mt-1 opacity-75 leading-tight">Apenas eu vejo</span>
                    </button>

                    {/* Opção Todos Alunos (se for treinador) ou Conexões */}
                    <button
                        type="button"
                        onClick={() => setVisibility('students')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            visibility === 'students'
                                ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold shadow-md shadow-lime-500/10'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 hover:border-zinc-350 dark:hover:border-zinc-700'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">
                            {activeUser?.role === 'trainer' ? 'Meus Alunos' : 'Conexões'}
                        </span>
                        <span className="text-[9px] mt-1 opacity-75 leading-tight">
                            {activeUser?.role === 'trainer' ? 'Todos alunos ativos' : 'Treinadores ativos'}
                        </span>
                    </button>

                    {/* Opção Restrito */}
                    <button
                        type="button"
                        onClick={() => setVisibility('restricted')}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                            visibility === 'restricted'
                                ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold shadow-md shadow-lime-500/10'
                                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 hover:border-zinc-350 dark:hover:border-zinc-700'
                        }`}
                    >
                        <span className="text-xs font-black uppercase tracking-wider">Restrito</span>
                        <span className="text-[9px] mt-1 opacity-75 leading-tight">Selecionar específicos</span>
                    </button>

                    {/* Opção Público (Apenas Admin) */}
                    {(showAdminFields || visibility === 'public') && (
                        <button
                            type="button"
                            onClick={() => setVisibility('public')}
                            className={`flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                                visibility === 'public'
                                    ? 'bg-lime-400 border-lime-400 text-zinc-950 font-bold shadow-md shadow-lime-500/10'
                                    : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-450 hover:border-zinc-350 dark:hover:border-zinc-700'
                            }`}
                        >
                            <span className="text-xs font-black uppercase tracking-wider">Público</span>
                            <span className="text-[9px] mt-1 opacity-75 leading-tight">Catálogo geral</span>
                        </button>
                    )}
                </div>

                {/* Lista de seleção de alunos se for Restrito */}
                {visibility === 'restricted' && (
                    <div className="mt-4 border-t border-zinc-150 dark:border-zinc-800 pt-4 space-y-3">
                        <label className="block text-[10px] font-black uppercase tracking-wider text-zinc-400 ml-1">
                            Selecione os Alunos com Acesso:
                        </label>
                        {loadingConnections ? (
                            <div className="text-xs text-zinc-500 animate-pulse">Carregando conexões...</div>
                        ) : connections.length === 0 ? (
                            <div className="text-xs text-zinc-500">Nenhum aluno ativo conectado para compartilhar.</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                                {connections.map(conn => {
                                    const isChecked = sharedWith.includes(conn.id);
                                    return (
                                        <label
                                            key={conn.id}
                                            className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer select-none transition-all ${
                                                isChecked
                                                    ? 'bg-lime-400/10 border-lime-400/30 text-zinc-900 dark:text-white font-bold'
                                                    : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    if (isChecked) {
                                                        setSharedWith(prev => prev.filter(id => id !== conn.id));
                                                    } else {
                                                        setSharedWith(prev => [...prev, conn.id]);
                                                    }
                                                }}
                                                className="w-4 h-4 rounded text-lime-400 focus:ring-lime-400 bg-white dark:bg-zinc-900 accent-lime-400 cursor-pointer"
                                            />
                                            {conn.avatar ? (
                                                <img src={conn.avatar} alt={conn.name} className="w-6 h-6 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs text-zinc-500 font-bold">
                                                    {conn.name.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <span className="text-xs uppercase">{conn.name}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Botão de Envio */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                >
                    {isLoading || isUploading ? (
                        <>
                            <div className="w-5 h-5 border-3 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                            <span>{isUploading ? 'ENVIANDO MÍDIA...' : 'SALVANDO...'}</span>
                        </>
                    ) : (
                        <>
                            <Save size={22} />
                            {t('saveButton').toUpperCase()}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}