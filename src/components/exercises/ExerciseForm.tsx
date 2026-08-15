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
    User as UserIcon,
    Layers,
    Image as ImageIcon,
    Plus,
    Link as LinkIcon
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { CATEGORIES, EQUIPMENT } from '@/config/constants';
import { DEFAULT_EXERCISES } from '@/config/seeds';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';
import { User, GalleryItem, Exercise, ExerciseTranslations, ExerciseCategory, ExerciseEquipment } from '@/config/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { connectionService } from '@/services/connectionService';
import { taxonomyService } from '@/services/taxonomyService';
import { Globe } from 'lucide-react';

const SUPPORTED_LOCALES = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const;

type LocaleCode = typeof SUPPORTED_LOCALES[number]['code'];

interface ExerciseFormProps {
    initialData?: {
        id?: number;
        name?: string;
        category?: any;
        description?: string;
        howTo?: string;
        imageUrl?: string;
        mediaUrl?: string; // Legacy fallback
        videoUrl?: string;
        tags?: string[] | string;
        level?: 'beginner' | 'intermediate' | 'advanced';
        isPublic?: boolean;
        equipment?: any;
        executionMode?: 'unilateral' | 'bilateral';
        mechanics?: 'compound' | 'isolation';
        parentId?: number | null;
        created_by?: string;
        created_by_type?: 'system' | 'user' | 'trainer';
        secondaryMuscles?: any[];
        gallery?: GalleryItem[];
        visibility?: 'public' | 'private' | 'students' | 'restricted';
        shared_with?: string[];
        translations?: ExerciseTranslations;
    };
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    showAdminFields?: boolean;
    users?: User[];
    existingExercises?: Exercise[];
}

export default function ExerciseForm({ 
    initialData, 
    onSubmit, 
    isLoading = false,
    showAdminFields = false,
    users = [],
    existingExercises = DEFAULT_EXERCISES
}: ExerciseFormProps) {
    const activeLocale = useLocale();
    const t = useTranslations('ExerciseForm');
    const tc = useTranslations('Categories');
    const teq = useTranslations('Equipment');
    const tw = useTranslations('WorkoutForm');

    // Mídia principal (Imagem & Vídeo)
    const initialImg = initialData?.imageUrl || initialData?.mediaUrl || '';
    const initialVid = initialData?.videoUrl || '';
    
    const [mediaType, setMediaType] = useState<'upload' | 'url'>(
        initialImg && !initialImg.includes('supabase.co/storage') ? 'url' : 'upload'
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImg || null);
    const [isUploading, setIsUploading] = useState(false);

    // Estados de Tradução Multilíngue
    const [activeLang, setActiveLang] = useState<LocaleCode>('pt');

    const parseInitialTags = (tagsVal: any): string => {
        if (Array.isArray(tagsVal)) return tagsVal.join(', ');
        return typeof tagsVal === 'string' ? tagsVal : '';
    };

    const [translationsState, setTranslationsState] = useState<Record<LocaleCode, {
        name: string;
        description: string;
        howTo: string;
        tags: string;
    }>>({
        pt: {
            name: initialData?.translations?.pt?.name || initialData?.name || '',
            description: initialData?.translations?.pt?.description || initialData?.description || '',
            howTo: initialData?.translations?.pt?.howTo || initialData?.howTo || '',
            tags: parseInitialTags(initialData?.translations?.pt?.tags ?? initialData?.tags)
        },
        en: {
            name: initialData?.translations?.en?.name || '',
            description: initialData?.translations?.en?.description || '',
            howTo: initialData?.translations?.en?.howTo || '',
            tags: parseInitialTags(initialData?.translations?.en?.tags)
        },
        es: {
            name: initialData?.translations?.es?.name || '',
            description: initialData?.translations?.es?.description || '',
            howTo: initialData?.translations?.es?.howTo || '',
            tags: parseInitialTags(initialData?.translations?.es?.tags)
        }
    });

    // Atualiza estado de traduções quando initialData carrega
    useEffect(() => {
        if (initialData) {
            setTranslationsState({
                pt: {
                    name: initialData?.translations?.pt?.name || initialData?.name || '',
                    description: initialData?.translations?.pt?.description || initialData?.description || '',
                    howTo: initialData?.translations?.pt?.howTo || initialData?.howTo || '',
                    tags: parseInitialTags(initialData?.translations?.pt?.tags ?? initialData?.tags)
                },
                en: {
                    name: initialData?.translations?.en?.name || '',
                    description: initialData?.translations?.en?.description || '',
                    howTo: initialData?.translations?.en?.howTo || '',
                    tags: parseInitialTags(initialData?.translations?.en?.tags)
                },
                es: {
                    name: initialData?.translations?.es?.name || '',
                    description: initialData?.translations?.es?.description || '',
                    howTo: initialData?.translations?.es?.howTo || '',
                    tags: parseInitialTags(initialData?.translations?.es?.tags)
                }
            });
        }
    }, [initialData]);

    const handleTranslationChange = (field: 'name' | 'description' | 'howTo' | 'tags', value: string) => {
        setTranslationsState(prev => ({
            ...prev,
            [activeLang]: {
                ...prev[activeLang],
                [field]: value
            }
        }));

        if (activeLang === 'pt' && field === 'name') {
            setValue('name', value);
        }
    };

    // Novos Estados: SecondaryMuscles & Gallery
    const [selectedSecondaryMuscles, setSelectedSecondaryMuscles] = useState<string[]>(
        initialData?.secondaryMuscles || []
    );
    const [gallery, setGallery] = useState<GalleryItem[]>(initialData?.gallery || []);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newGalleryType, setNewGalleryType] = useState<'image' | 'video'>('image');
    const [newGalleryTitle, setNewGalleryTitle] = useState('');

    // Estado Exercício Pai
    const [parentId, setParentId] = useState<number | null>(
        initialData?.parentId !== undefined ? initialData.parentId : null
    );

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
        watch,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: initialData?.translations?.pt?.name || initialData?.name || '',
            category: initialData?.category || 'chest',
            description: initialData?.translations?.pt?.description || initialData?.description || '',
            howTo: initialData?.translations?.pt?.howTo || initialData?.howTo || '',
            imageUrl: initialImg,
            videoUrl: initialVid,
            tags: parseInitialTags(initialData?.translations?.pt?.tags ?? initialData?.tags),
            level: initialData?.level || 'beginner',
            isPublic: initialData?.isPublic ?? true,
            equipment: initialData?.equipment || 'none',
            executionMode: initialData?.executionMode || 'bilateral',
            mechanics: initialData?.mechanics || 'compound'
        }
    });

    const selectedCategory = watch('category');

    const [categoriesList, setCategoriesList] = useState<ExerciseCategory[]>([]);
    const [equipmentList, setEquipmentList] = useState<ExerciseEquipment[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function loadTaxonomy() {
            try {
                const [cats, eqs] = await Promise.all([
                    taxonomyService.getCategories(activeLocale),
                    taxonomyService.getEquipment(activeLocale)
                ]);
                if (isMounted) {
                    setCategoriesList(cats);
                    setEquipmentList(eqs);
                }
            } catch (err) {
                console.error('[ExerciseForm] Error loading taxonomy:', err);
            }
        }
        loadTaxonomy();
        return () => { isMounted = false; };
    }, [activeLocale]);

    // Toggle de músculo secundário
    const toggleSecondaryMuscle = (muscleKey: string) => {
        if (muscleKey === selectedCategory) return;
        if (selectedSecondaryMuscles.includes(muscleKey as any)) {
            setSelectedSecondaryMuscles(selectedSecondaryMuscles.filter(m => m !== muscleKey));
        } else {
            setSelectedSecondaryMuscles([...selectedSecondaryMuscles, muscleKey as any]);
        }
    };

    // Adiciona item na Galeria
    const handleAddGalleryItem = () => {
        if (!newGalleryUrl.trim()) {
            toast.error('Informe a URL do item da galeria.');
            return;
        }
        const item: GalleryItem = {
            url: newGalleryUrl.trim(),
            type: newGalleryType,
            title: newGalleryTitle.trim() || undefined
        };
        setGallery([...gallery, item]);
        setNewGalleryUrl('');
        setNewGalleryTitle('');
    };

    // Remove item da Galeria
    const handleRemoveGalleryItem = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (data: any) => {
        if (showAdminFields && createdByOption === 'user' && !selectedUser) {
            toast.error('Por favor, selecione um aluno para vincular este exercício.');
            return;
        }

        const ptName = translationsState.pt.name.trim();
        const enName = translationsState.en.name.trim();
        const esName = translationsState.es.name.trim();

        const baseName = ptName || enName || esName || data.name?.trim();

        if (!baseName || baseName.length < 2) {
            toast.error('O nome do exercício precisa ter no mínimo 2 caracteres.');
            return;
        }

        const parseTags = (str: string) => str.split(',').map(t => t.trim()).filter(Boolean);

        const finalTranslations: ExerciseTranslations = {
            pt: {
                name: ptName || baseName,
                description: translationsState.pt.description.trim() || undefined,
                howTo: translationsState.pt.howTo.trim() || undefined,
                tags: parseTags(translationsState.pt.tags)
            },
            en: {
                name: enName || ptName || baseName,
                description: translationsState.en.description.trim() || undefined,
                howTo: translationsState.en.howTo.trim() || undefined,
                tags: parseTags(translationsState.en.tags)
            },
            es: {
                name: esName || ptName || baseName,
                description: translationsState.es.description.trim() || undefined,
                howTo: translationsState.es.howTo.trim() || undefined,
                tags: parseTags(translationsState.es.tags)
            }
        };

        let finalImageUrl = data.imageUrl;
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

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('exercise-media')
                    .getPublicUrl(filePath);

                finalImageUrl = publicUrl;
            }

            onSubmit({
                ...data,
                name: baseName,
                description: translationsState.pt.description.trim() || data.description?.trim() || null,
                howTo: translationsState.pt.howTo.trim() || data.howTo?.trim() || null,
                tags: parseTags(translationsState.pt.tags).length > 0 ? parseTags(translationsState.pt.tags) : parseTags(data.tags || ''),
                translations: finalTranslations,
                imageUrl: finalImageUrl || null,
                videoUrl: data.videoUrl || null,
                secondaryMuscles: selectedSecondaryMuscles,
                gallery,
                parentId,
                created_by: showAdminFields ? (createdByOption === 'user' ? selectedUser?.id : null) : undefined,
                created_by_type: showAdminFields ? createdByOption : undefined,
                visibility,
                shared_with: visibility === 'restricted' ? sharedWith : [],
            });
        } catch (err: any) {
            console.error('[ExerciseForm] Submission error:', err);
            toast.error('Erro ao salvar o exercício. Tente novamente.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* --- SEÇÃO MULTILÍNGUE (Nome, Descrição, Instruções e Tags por Idioma) --- */}
            <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-3xl p-5 space-y-5 shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-lime-400/10 border border-lime-400/20 flex items-center justify-center text-lime-400">
                            <Globe size={18} />
                        </div>
                        <div>
                            <h3 className="text-sm font-black uppercase tracking-wider text-white">Conteúdo do Exercício</h3>
                            <p className="text-[11px] font-semibold text-zinc-400">Cadastre e traduza as informações em múltiplos idiomas</p>
                        </div>
                    </div>

                    {/* Tabs de Seleção de Idioma */}
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-950 rounded-2xl border border-zinc-800/80">
                        {SUPPORTED_LOCALES.map((loc) => {
                            const isCurrent = activeLang === loc.code;
                            const hasContent = Boolean(translationsState[loc.code]?.name?.trim());
                            return (
                                <button
                                    type="button"
                                    key={loc.code}
                                    onClick={() => setActiveLang(loc.code)}
                                    className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                                        isCurrent
                                            ? 'bg-lime-400 text-zinc-950 shadow-md shadow-lime-400/10 scale-[1.02]'
                                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                    }`}
                                >
                                    <span className="text-sm leading-none">{loc.flag}</span>
                                    <span>{loc.label}</span>
                                    {hasContent && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-zinc-950' : 'bg-lime-400'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Campos do Idioma Ativo */}
                <div className="space-y-4 pt-1">
                    {/* Nome do Exercício no Idioma */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Type size={14} className="text-lime-400" />
                                Nome do Exercício ({SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label})
                                {activeLang === 'pt' && <span className="text-lime-400 text-[10px] lowercase font-semibold">(obrigatório)</span>}
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                                {activeLang.toUpperCase()}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={translationsState[activeLang].name}
                            onChange={(e) => handleTranslationChange('name', e.target.value)}
                            placeholder={`Ex: ${activeLang === 'pt' ? 'Supino Reto com Barra' : activeLang === 'en' ? 'Barbell Bench Press' : 'Press de Banca con Barra'}`}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors shadow-inner"
                        />
                    </div>

                    {/* Descrição no Idioma */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <AlignLeft size={14} className="text-lime-400" />
                            Descrição ({SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label})
                        </label>
                        <textarea
                            value={translationsState[activeLang].description}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            rows={2}
                            placeholder={`Resumo ou benefícios do exercício em ${SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label}...`}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors resize-none shadow-inner"
                        />
                    </div>

                    {/* Instruções de Execução no Idioma */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <ListOrdered size={14} className="text-lime-400" />
                            Instruções / Modo de Fazer ({SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label})
                        </label>
                        <textarea
                            value={translationsState[activeLang].howTo}
                            onChange={(e) => handleTranslationChange('howTo', e.target.value)}
                            rows={3}
                            placeholder={"1. Passo um...\n2. Passo dois...\n3. Passo três..."}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors resize-none shadow-inner font-mono text-xs"
                        />
                    </div>

                    {/* Tags no Idioma */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <TagIcon size={14} className="text-lime-400" />
                            Tags ({SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label} - separadas por vírgula)
                        </label>
                        <input
                            type="text"
                            value={translationsState[activeLang].tags}
                            onChange={(e) => handleTranslationChange('tags', e.target.value)}
                            placeholder="peito, supino, composto, hipertrofia"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400 transition-colors shadow-inner"
                        />
                    </div>
                </div>
            </div>

            {/* Categoria Principal & Exercício Pai */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Dumbbell size={16} className="text-lime-400" />
                        {t('category')}
                    </label>
                    <select
                        {...register('category')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors capitalize"
                    >
                        {categoriesList.map(cat => (
                            <option key={cat.slug} value={cat.slug}>
                                {taxonomyService.getCategoryLocalizedName(cat, activeLocale) || (tc.has(cat.slug) ? tc(cat.slug) : cat.name)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Layers size={16} className="text-lime-400" />
                        {tw.has('parentIdLabel') ? tw('parentIdLabel') : 'Exercício Pai (Variante)'}
                    </label>
                    <select
                        value={parentId !== null ? parentId : ''}
                        onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                    >
                        <option value="">{tw.has('parentIdNone') ? tw('parentIdNone') : 'Exercício Principal (Sem Pai)'}</option>
                        {existingExercises.map(ex => (
                            <option key={ex.id} value={ex.id}>
                                {ex.name} ({ex.category})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Músculos Secundários / Sinergistas (Multiselect Chips) */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Dumbbell size={16} className="text-lime-400" />
                    {tw.has('secondaryMusclesLabel') ? tw('secondaryMusclesLabel') : 'Músculos Secundários / Sinergistas'}
                </label>
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl max-h-36 overflow-y-auto">
                    {categoriesList.map(cat => {
                        const isMainCategory = cat.slug === selectedCategory;
                        const isSelected = selectedSecondaryMuscles.includes(cat.slug as any);

                        if (isMainCategory) return null;

                        return (
                            <button
                                type="button"
                                key={cat.slug}
                                onClick={() => toggleSecondaryMuscle(cat.slug)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-lime-500/20 text-lime-400 border-lime-500/40'
                                        : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                {isSelected && <Check size={12} />}
                                {taxonomyService.getCategoryLocalizedName(cat, activeLocale) || (tc.has(cat.slug) ? tc(cat.slug) : cat.name)}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Equipamento, Modo e Mecânica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Dumbbell size={16} className="text-lime-400" />
                        {tw.has('equipmentLabel') ? tw('equipmentLabel') : 'Equipamento'}
                    </label>
                    <select
                        {...register('equipment')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors capitalize"
                    >
                        {equipmentList.map(eq => (
                            <option key={eq.slug} value={eq.slug}>
                                {taxonomyService.getEquipmentLocalizedName(eq, activeLocale) || (teq.has(eq.slug) ? teq(eq.slug) : eq.name)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <AlignLeft size={16} className="text-lime-400" />
                        {tw.has('executionModeLabel') ? tw('executionModeLabel') : 'Modo de Execução'}
                    </label>
                    <select
                        {...register('executionMode')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                    >
                        <option value="bilateral">Bilateral</option>
                        <option value="unilateral">Unilateral</option>
                        <option value="alternating">Alternado</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Layers size={16} className="text-lime-400" />
                        {tw.has('mechanicsLabel') ? tw('mechanicsLabel') : 'Mecânica'}
                    </label>
                    <select
                        {...register('mechanics')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                    >
                        <option value="compound">Multiarticular (Composto)</option>
                        <option value="isolation">Monoarticular (Isolado)</option>
                    </select>
                </div>
            </div>

            {/* Mídia Principal: Imagem & Vídeo URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <ImageIcon size={16} className="text-lime-400" />
                        {tw.has('imageUrlLabel') ? tw('imageUrlLabel') : 'URL da Imagem'}
                    </label>
                    <input
                        {...register('imageUrl')}
                        placeholder="https://.../imagem.jpg"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <Video size={16} className="text-lime-400" />
                        {tw.has('videoUrlLabel') ? tw('videoUrlLabel') : 'URL do Vídeo'}
                    </label>
                    <input
                        {...register('videoUrl')}
                        placeholder="https://youtube.com/... ou .mp4"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                    />
                </div>
            </div>

            {/* Galeria de Mídia Builder */}
            <div className="space-y-3 bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-xl">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <ImageIcon size={16} className="text-lime-400" />
                    {tw.has('galleryLabel') ? tw('galleryLabel') : 'Galeria de Mídia (Imagens/Vídeos)'}
                </label>

                <div className="flex flex-col md:flex-row gap-2">
                    <input
                        type="text"
                        value={newGalleryUrl}
                        onChange={(e) => setNewGalleryUrl(e.target.value)}
                        placeholder="https://.../midia.png"
                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500"
                    />
                    <select
                        value={newGalleryType}
                        onChange={(e) => setNewGalleryType(e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white"
                    >
                        <option value="image">Imagem</option>
                        <option value="video">Vídeo</option>
                    </select>
                    <button
                        type="button"
                        onClick={handleAddGalleryItem}
                        className="bg-lime-500 hover:bg-lime-600 text-zinc-950 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                        <Plus size={14} /> Adicionar
                    </button>
                </div>

                {/* Render da Lista da Galeria */}
                {gallery.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {gallery.map((item, idx) => (
                            <div key={idx} className="relative group bg-zinc-950 border border-zinc-800 rounded-lg p-2 flex flex-col items-center justify-between text-xs">
                                <div className="flex items-center gap-1.5 text-zinc-300 truncate w-full">
                                    {item.type === 'image' ? <ImageIcon size={12} className="text-lime-400" /> : <Video size={12} className="text-blue-400" />}
                                    <span className="truncate">{item.title || item.url}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveGalleryItem(idx)}
                                    className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors cursor-pointer"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Nível de Dificuldade */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Layers size={16} className="text-lime-400" />
                    {tw.has('levelLabel') ? tw('levelLabel') : 'Nível de Dificuldade'}
                </label>
                <select
                    {...register('level')}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                >
                    <option value="beginner">Iniciante</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                </select>
            </div>

            {/* Visibilidade & Associação de Usuário (Apenas Admin/Moderador ou Usuário com Alunos) */}
            <div className="space-y-4 pt-2 border-t border-zinc-800/80">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                        <Layers size={14} className="text-lime-400" />
                        Visibilidade do Exercício
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                            { id: 'public', label: 'Público', desc: 'Todos os usuários' },
                            { id: 'private', label: 'Privado', desc: 'Apenas eu' },
                            { id: 'students', label: 'Alunos', desc: 'Meus alunos' },
                            { id: 'restricted', label: 'Restrito', desc: 'Selecionados' }
                        ].map(opt => (
                            <button
                                type="button"
                                key={opt.id}
                                onClick={() => setVisibility(opt.id as any)}
                                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                    visibility === opt.id
                                        ? 'bg-lime-500/10 border-lime-400 text-white shadow-md shadow-lime-400/5'
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                                }`}
                            >
                                <p className="text-xs font-black uppercase tracking-wider">{opt.label}</p>
                                <p className="text-[10px] text-zinc-500 font-medium">{opt.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Se for Admin e tiver showAdminFields */}
                {showAdminFields && (
                    <div className="space-y-3 bg-zinc-900/40 p-4 border border-zinc-800/80 rounded-2xl">
                        <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                            <UserIcon size={14} className="text-lime-400" />
                            Propriedade do Exercício (Admin)
                        </label>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setCreatedByOption('system');
                                    setSelectedUser(null);
                                }}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                    createdByOption === 'system'
                                        ? 'bg-amber-500/10 border-amber-400 text-amber-400 shadow-md'
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Exercício do Sistema (Oficial)
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreatedByOption('user')}
                                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                    createdByOption === 'user'
                                        ? 'bg-blue-500/10 border-blue-400 text-blue-400 shadow-md'
                                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                                }`}
                            >
                                Vincular a Usuário
                            </button>
                        </div>

                        {createdByOption === 'user' && (
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-zinc-400">Selecione o Usuário:</label>
                                <select
                                    value={selectedUser?.id || ''}
                                    onChange={(e) => {
                                        const u = users.find(usr => usr.id === e.target.value);
                                        setSelectedUser(u || null);
                                    }}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-lime-400"
                                >
                                    <option value="">Selecione um usuário...</option>
                                    {users.map(u => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email || u.role})
                                        </option>
                                    ))}
                                </select>
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
                    className="w-full bg-lime-500 hover:bg-lime-600 text-zinc-950 font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-lime-500/20 cursor-pointer active:scale-[0.99]"
                >
                    <Save size={18} />
                    {isLoading || isUploading ? 'Salvando...' : t('save')}
                </button>
            </div>
        </form>
    );
}