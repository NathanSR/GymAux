"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Save,
    Dumbbell,
    Video,
    Tag as TagIcon,
    Type,
    AlignLeft,
    ListOrdered,
    Trash2,
    Check,
    User as UserIcon,
    Layers,
    Image as ImageIcon,
    Plus,
    Globe,
    Sparkles
} from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { DEFAULT_EXERCISES } from '@/config/seeds';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/utils/toast';
import { User, GalleryItem, Exercise, ExerciseTranslations, ExerciseCategory, ExerciseEquipment } from '@/config/types';
import { useSession } from '@/hooks/useSession';
import { connectionService } from '@/services/connectionService';
import { taxonomyService } from '@/services/taxonomyService';
import { getExerciseLocalized } from '@/utils/exerciseLocalization';

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
        mediaUrl?: string;
        videoUrl?: string;
        tags?: string[] | string;
        level?: 'beginner' | 'intermediate' | 'advanced';
        isPublic?: boolean;
        equipment?: any;
        executionMode?: 'unilateral' | 'bilateral' | 'alternating';
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

    // Mídia principal
    const initialImg = initialData?.imageUrl || initialData?.mediaUrl || '';
    const initialVid = initialData?.videoUrl || '';

    const [mediaType] = useState<'upload' | 'url'>(
        initialImg && !initialImg.includes('supabase.co/storage') ? 'url' : 'upload'
    );
    const [selectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // Idioma ativo nas abas de tradução
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

    // Músculos Secundários & Galeria
    const [selectedSecondaryMuscles, setSelectedSecondaryMuscles] = useState<string[]>(
        initialData?.secondaryMuscles || []
    );
    const [gallery, setGallery] = useState<GalleryItem[]>(initialData?.gallery || []);
    const [newGalleryUrl, setNewGalleryUrl] = useState('');
    const [newGalleryType, setNewGalleryType] = useState<'image' | 'video'>('image');
    const [newGalleryTitle, setNewGalleryTitle] = useState('');

    // Exercício Pai
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

    const { activeUser } = useSession();
    const [, setConnections] = useState<{ id: string; name: string; avatar: string | null; type: 'student' | 'trainer' }[]>([]);
    const [, setLoadingConnections] = useState(false);

    const [visibility, setVisibility] = useState<'public' | 'private' | 'students' | 'restricted'>(
        initialData?.visibility || (initialData?.isPublic ? 'public' : 'private')
    );
    const [sharedWith] = useState<string[]>(initialData?.shared_with || []);

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

    const toggleSecondaryMuscle = (muscleKey: string) => {
        if (muscleKey === selectedCategory) return;
        if (selectedSecondaryMuscles.includes(muscleKey as any)) {
            setSelectedSecondaryMuscles(selectedSecondaryMuscles.filter(m => m !== muscleKey));
        } else {
            setSelectedSecondaryMuscles([...selectedSecondaryMuscles, muscleKey as any]);
        }
    };

    const handleAddGalleryItem = () => {
        if (!newGalleryUrl.trim()) {
            toast.error(t('galleryUrlRequired'));
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

    const handleRemoveGalleryItem = (index: number) => {
        setGallery(gallery.filter((_, i) => i !== index));
    };

    const handleFormSubmit = async (data: any) => {
        if (showAdminFields && createdByOption === 'user' && !selectedUser) {
            toast.error(t('selectUserRequired'));
            return;
        }

        const ptName = translationsState.pt.name.trim();
        const enName = translationsState.en.name.trim();
        const esName = translationsState.es.name.trim();

        const baseName = ptName || enName || esName || data.name?.trim();

        if (!baseName || baseName.length < 2) {
            toast.error(t('nameMinLength'));
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
                if (typeof window !== 'undefined' && !navigator.onLine) {
                    finalImageUrl = URL.createObjectURL(selectedFile);
                } else {
                    const supabase = createClient();
                    const fileExt = selectedFile.name.split('.').pop();
                    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                    const filePath = `exercises/${fileName}`;

                    try {
                        const { error: uploadError } = await supabase.storage
                            .from('exercise-media')
                            .upload(filePath, selectedFile, {
                                cacheControl: '3600',
                                upsert: false
                            });

                        if (!uploadError) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('exercise-media')
                                .getPublicUrl(filePath);
                            finalImageUrl = publicUrl;
                        }
                    } catch (uploadErr) {
                        console.warn('[ExerciseForm] Upload falhou (provavelmente offline):', uploadErr);
                        finalImageUrl = URL.createObjectURL(selectedFile);
                    }
                }
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
            toast.error(t('saveError'));
        } finally {
            setIsUploading(false);
        }
    };

    const inputClass = "w-full h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all shadow-xs";
    const selectClass = "w-full h-12 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 text-sm text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all shadow-xs cursor-pointer";
    const textareaClass = "w-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3.5 text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all resize-none shadow-xs";

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* 1. SEÇÃO MULTILÍNGUE (Nome, Descrição, Instruções e Tags por Idioma) */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-6 space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/80 pb-4">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-lime-400/20 text-lime-600 dark:text-lime-400 flex items-center justify-center shrink-0">
                            <Globe size={18} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 truncate">
                                {t('contentTitle')}
                            </h3>
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate mt-0.5">
                                {t('contentSubtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Tabs de Seleção de Idioma */}
                    <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shrink-0">
                        {SUPPORTED_LOCALES.map((loc) => {
                            const isCurrent = activeLang === loc.code;
                            const hasContent = Boolean(translationsState[loc.code]?.name?.trim());
                            return (
                                <button
                                    type="button"
                                    key={loc.code}
                                    onClick={() => setActiveLang(loc.code)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                                        isCurrent
                                            ? 'bg-lime-400 text-zinc-950 shadow-sm shadow-lime-400/20 scale-[1.02]'
                                            : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
                                    }`}
                                >
                                    <span className="text-sm leading-none">{loc.flag}</span>
                                    <span>{loc.label}</span>
                                    {hasContent && (
                                        <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-zinc-950' : 'bg-lime-500'}`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Campos do Idioma Ativo */}
                <div className="space-y-4 pt-1">
                    {/* Nome do Exercício */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                            <span className="flex items-center gap-2">
                                <Type size={14} className="text-lime-500" />
                                {t('nameLanguageLabel', { lang: SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label || '' })}
                                {activeLang === 'pt' && (
                                    <span className="text-lime-600 dark:text-lime-400 text-[10px] lowercase font-semibold">
                                        {t('required')}
                                    </span>
                                )}
                            </span>
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                                {activeLang.toUpperCase()}
                            </span>
                        </label>
                        <input
                            type="text"
                            value={translationsState[activeLang].name}
                            onChange={(e) => handleTranslationChange('name', e.target.value)}
                            placeholder={activeLang === 'pt' ? 'Ex: Supino Reto com Barra' : activeLang === 'en' ? 'Ex: Barbell Bench Press' : 'Ej: Press de Banca con Barra'}
                            className={inputClass}
                        />
                    </div>

                    {/* Descrição */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <AlignLeft size={14} className="text-lime-500" />
                            {t('descriptionLanguageLabel', { lang: SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label || '' })}
                        </label>
                        <textarea
                            value={translationsState[activeLang].description}
                            onChange={(e) => handleTranslationChange('description', e.target.value)}
                            rows={2}
                            placeholder={t('descriptionLanguagePlaceholder', { lang: SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label || '' })}
                            className={textareaClass}
                        />
                    </div>

                    {/* Instruções de Execução */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <ListOrdered size={14} className="text-lime-500" />
                            {t('howToLanguageLabel', { lang: SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label || '' })}
                        </label>
                        <textarea
                            value={translationsState[activeLang].howTo}
                            onChange={(e) => handleTranslationChange('howTo', e.target.value)}
                            rows={3}
                            placeholder={t('howToLanguagePlaceholder')}
                            className={`${textareaClass} font-mono text-xs`}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <TagIcon size={14} className="text-lime-500" />
                            {t('tagsLanguageLabel', { lang: SUPPORTED_LOCALES.find(l => l.code === activeLang)?.label || '' })}
                        </label>
                        <input
                            type="text"
                            value={translationsState[activeLang].tags}
                            onChange={(e) => handleTranslationChange('tags', e.target.value)}
                            placeholder={t('tagsLanguagePlaceholder')}
                            className={inputClass}
                        />
                    </div>
                </div>
            </div>

            {/* 2. SEÇÃO DE CLASSIFICAÇÃO & BIOMECÂNICA */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1 px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('classificationTitle')}
                    </h3>
                </div>

                {/* Categoria Principal & Exercício Pai */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Dumbbell size={14} className="text-lime-500" />
                            {t('mainCategory')}
                        </label>
                        <select
                            {...register('category')}
                            className={selectClass}
                        >
                            {categoriesList.map(cat => (
                                <option key={cat.slug} value={cat.slug}>
                                    {taxonomyService.getCategoryLocalizedName(cat, activeLocale) || (tc.has(cat.slug) ? tc(cat.slug) : cat.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Layers size={14} className="text-lime-500" />
                            {t('parentExercise')}
                        </label>
                        <select
                            value={parentId !== null ? parentId : ''}
                            onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : null)}
                            className={selectClass}
                        >
                            <option value="">{t('parentNone')}</option>
                            {existingExercises.map(ex => (
                                <option key={ex.id} value={ex.id}>
                                    {getExerciseLocalized(ex, activeLocale).name || ex.name} ({ex.category})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Músculos Secundários / Sinergistas */}
                <div className="space-y-2 pt-2">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Dumbbell size={14} className="text-lime-500" />
                        {t('secondaryMuscles')}
                    </label>
                    <div className="flex flex-wrap gap-2 p-3 bg-zinc-100/80 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-h-36 overflow-y-auto">
                        {categoriesList.map(cat => {
                            const isMainCategory = cat.slug === selectedCategory;
                            const isSelected = selectedSecondaryMuscles.includes(cat.slug as any);

                            if (isMainCategory) return null;

                            return (
                                <button
                                    type="button"
                                    key={cat.slug}
                                    onClick={() => toggleSecondaryMuscle(cat.slug)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95 cursor-pointer ${
                                        isSelected
                                            ? 'bg-lime-500/20 text-lime-600 dark:text-lime-400 border-lime-500/40 shadow-xs'
                                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-white'
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Dumbbell size={14} className="text-lime-500" />
                            {t('equipment')}
                        </label>
                        <select
                            {...register('equipment')}
                            className={selectClass}
                        >
                            {equipmentList.map(eq => (
                                <option key={eq.slug} value={eq.slug}>
                                    {taxonomyService.getEquipmentLocalizedName(eq, activeLocale) || (teq.has(eq.slug) ? teq(eq.slug) : eq.name)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <AlignLeft size={14} className="text-lime-500" />
                            {t('executionMode')}
                        </label>
                        <select
                            {...register('executionMode')}
                            className={selectClass}
                        >
                            <option value="bilateral">{t('executionModeOptions.bilateral')}</option>
                            <option value="unilateral">{t('executionModeOptions.unilateral')}</option>
                            <option value="alternating">{t('executionModeOptions.alternating')}</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Layers size={14} className="text-lime-500" />
                            {t('mechanics')}
                        </label>
                        <select
                            {...register('mechanics')}
                            className={selectClass}
                        >
                            <option value="compound">{t('mechanicsOptions.compound')}</option>
                            <option value="isolation">{t('mechanicsOptions.isolation')}</option>
                        </select>
                    </div>
                </div>

                {/* Nível de Dificuldade */}
                <div className="space-y-2 pt-2">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <Sparkles size={14} className="text-lime-500" />
                        {t('difficultyLevel')}
                    </label>
                    <select
                        {...register('level')}
                        className={selectClass}
                    >
                        <option value="beginner">{t('levels.beginner')}</option>
                        <option value="intermediate">{t('levels.intermediate')}</option>
                        <option value="advanced">{t('levels.advanced')}</option>
                    </select>
                </div>
            </div>

            {/* 3. SEÇÃO DE MÍDIA DEMONSTRATIVA */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1 px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('mediaTitle')}
                    </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <ImageIcon size={14} className="text-lime-500" />
                            {t('imageUrl')}
                        </label>
                        <input
                            {...register('imageUrl')}
                            placeholder={t('imageUrlPlaceholder')}
                            className={inputClass}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <Video size={14} className="text-lime-500" />
                            {t('videoUrl')}
                        </label>
                        <input
                            {...register('videoUrl')}
                            placeholder={t('videoUrlPlaceholder')}
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Galeria de Mídia Builder */}
                <div className="space-y-3 bg-zinc-100/80 dark:bg-zinc-950/60 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl mt-2">
                    <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                        <ImageIcon size={14} className="text-lime-500" />
                        {t('galleryTitle')}
                    </label>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="text"
                            value={newGalleryUrl}
                            onChange={(e) => setNewGalleryUrl(e.target.value)}
                            placeholder={t('galleryUrlPlaceholder')}
                            className={`${inputClass} flex-1`}
                        />
                        <select
                            value={newGalleryType}
                            onChange={(e) => setNewGalleryType(e.target.value as any)}
                            className="h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-3 text-xs text-zinc-900 dark:text-white font-bold"
                        >
                            <option value="image">{t('galleryImage')}</option>
                            <option value="video">{t('galleryVideo')}</option>
                        </select>
                        <button
                            type="button"
                            onClick={handleAddGalleryItem}
                            className="h-12 bg-lime-400 hover:bg-lime-300 text-zinc-950 px-5 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm shadow-lime-400/20"
                        >
                            <Plus size={15} />
                            <span>{t('galleryAdd')}</span>
                        </button>
                    </div>

                    {/* Itens da Galeria */}
                    {gallery.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                            {gallery.map((item, idx) => (
                                <div key={idx} className="relative group bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 truncate pr-6">
                                        {item.type === 'image' ? <ImageIcon size={14} className="text-lime-500 shrink-0" /> : <Video size={14} className="text-blue-500 shrink-0" />}
                                        <span className="truncate text-[11px] font-medium">{item.title || item.url}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveGalleryItem(idx)}
                                        className="p-1 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 4. SEÇÃO DE VISIBILIDADE & PROPRIEDADE */}
            <div className="bg-white dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-4 sm:p-6 space-y-4 shadow-xs">
                <div className="flex items-center gap-2 mb-1 px-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-lime-500" />
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
                        {t('visibilityTitle')}
                    </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { id: 'public', label: t('visibility.public'), desc: t('visibility.publicDesc') },
                        { id: 'private', label: t('visibility.private'), desc: t('visibility.privateDesc') },
                        { id: 'students', label: t('visibility.students'), desc: t('visibility.studentsDesc') },
                        { id: 'restricted', label: t('visibility.restricted'), desc: t('visibility.restrictedDesc') }
                    ].map(opt => (
                        <button
                            type="button"
                            key={opt.id}
                            onClick={() => setVisibility(opt.id as any)}
                            className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer active:scale-95 ${
                                visibility === opt.id
                                    ? 'bg-lime-500/10 border-lime-500/50 text-zinc-950 dark:text-white shadow-sm'
                                    : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                            }`}
                        >
                            <p className="text-xs font-black uppercase tracking-wider">{opt.label}</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">{opt.desc}</p>
                        </button>
                    ))}
                </div>

                {/* Seção Admin */}
                {showAdminFields && (
                    <div className="space-y-3 bg-zinc-100/80 dark:bg-zinc-950/60 p-4 border border-zinc-200 dark:border-zinc-800 rounded-2xl mt-4">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <UserIcon size={14} className="text-lime-500" />
                            {t('adminOwnershipTitle')}
                        </label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setCreatedByOption('system');
                                    setSelectedUser(null);
                                }}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                    createdByOption === 'system'
                                        ? 'bg-amber-500/15 border-amber-400 text-amber-600 dark:text-amber-400 shadow-sm'
                                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                                }`}
                            >
                                {t('systemExercise')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setCreatedByOption('user')}
                                className={`flex-1 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer ${
                                    createdByOption === 'user'
                                        ? 'bg-blue-500/15 border-blue-400 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                                }`}
                            >
                                {t('userLink')}
                            </button>
                        </div>

                        {createdByOption === 'user' && (
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
                                    {t('selectUserLabel')}
                                </label>
                                <select
                                    value={selectedUser?.id || ''}
                                    onChange={(e) => {
                                        const u = users.find(usr => usr.id === e.target.value);
                                        setSelectedUser(u || null);
                                    }}
                                    className={selectClass}
                                >
                                    <option value="">{t('selectUserPlaceholder')}</option>
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

            {/* 5. BOTÃO DE ENVIO */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full h-12 bg-lime-400 hover:bg-lime-300 text-zinc-950 font-black uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-lime-400/20 cursor-pointer active:scale-95"
                >
                    <Save size={18} />
                    <span>{isLoading || isUploading ? t('saving') : t('save')}</span>
                </button>
            </div>
        </form>
    );
}