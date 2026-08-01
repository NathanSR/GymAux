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
import { useTranslations } from 'next-intl';
import { CATEGORIES, EQUIPMENT } from '@/config/constants';
import { DEFAULT_EXERCISES } from '@/config/seedExercises';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'react-toastify';
import { User, GalleryItem, Exercise } from '@/config/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '@/hooks/useSession';
import { connectionService } from '@/services/connectionService';

interface ExerciseFormProps {
    initialData?: {
        name: string;
        category: string;
        secondaryMuscles?: string[];
        description: string;
        howTo: string;
        imageUrl?: string;
        videoUrl?: string;
        mediaUrl?: string; // Legacy fallback
        gallery?: GalleryItem[];
        parentId?: number | null;
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
    existingExercises?: Exercise[];
}

export default function ExerciseForm({ 
    initialData, 
    onSubmit, 
    isLoading,
    showAdminFields = false,
    users = [],
    existingExercises = DEFAULT_EXERCISES
}: ExerciseFormProps) {
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
            name: initialData?.name || '',
            category: initialData?.category || 'chest',
            description: initialData?.description || '',
            howTo: initialData?.howTo || '',
            imageUrl: initialImg,
            videoUrl: initialVid,
            tags: initialData?.tags ? (Array.isArray(initialData.tags) ? initialData.tags.join(', ') : initialData.tags) : '',
            level: initialData?.level || 'beginner',
            isPublic: initialData?.isPublic ?? true,
            equipment: initialData?.equipment || 'none',
            executionMode: initialData?.executionMode || 'bilateral',
            mechanics: initialData?.mechanics || 'compound'
        }
    });

    const selectedCategory = watch('category');

    const categories = useMemo(() => {
        return [...CATEGORIES];
    }, []);

    // Toggle de músculo secundário
    const toggleSecondaryMuscle = (muscleKey: string) => {
        if (muscleKey === selectedCategory) return;
        if (selectedSecondaryMuscles.includes(muscleKey)) {
            setSelectedSecondaryMuscles(selectedSecondaryMuscles.filter(m => m !== muscleKey));
        } else {
            setSelectedSecondaryMuscles([...selectedSecondaryMuscles, muscleKey]);
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
            {/* Nome do Exercício */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <Type size={16} className="text-lime-400" />
                    {t('name')}
                </label>
                <input
                    {...register('name', { required: t('nameRequired') })}
                    placeholder={t('namePlaceholder')}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                />
                {errors.name && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {errors.name.message as string}
                    </p>
                )}
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
                        {categories.map(cat => (
                            <option key={cat} value={cat}>
                                {tc.has(cat) ? tc(cat) : cat}
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
                    {categories.map(cat => {
                        const isMainCategory = cat === selectedCategory;
                        const isSelected = selectedSecondaryMuscles.includes(cat);

                        if (isMainCategory) return null;

                        return (
                            <button
                                type="button"
                                key={cat}
                                onClick={() => toggleSecondaryMuscle(cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5 ${
                                    isSelected
                                        ? 'bg-lime-500/20 text-lime-400 border-lime-500/40'
                                        : 'bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800 hover:text-white'
                                }`}
                            >
                                {isSelected && <Check size={12} />}
                                {tc.has(cat) ? tc(cat) : cat}
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
                        {EQUIPMENT.map(eq => (
                            <option key={eq} value={eq}>
                                {teq.has(eq) ? teq(eq) : eq}
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

            {/* Descrição & Modo de Fazer */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <AlignLeft size={16} className="text-lime-400" />
                    {t('description')}
                </label>
                <textarea
                    {...register('description')}
                    rows={2}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                    <ListOrdered size={16} className="text-lime-400" />
                    {t('howTo')}
                </label>
                <textarea
                    {...register('howTo')}
                    rows={3}
                    placeholder={t('howToPlaceholder')}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors resize-none"
                />
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
                        className="bg-lime-500 hover:bg-lime-600 text-zinc-950 px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
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
                                    className="absolute top-1 right-1 p-1 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Nível de Dificuldade & Tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-300 flex items-center gap-2">
                        <TagIcon size={16} className="text-lime-400" />
                        {t('tags')}
                    </label>
                    <input
                        {...register('tags')}
                        placeholder={t('tagsPlaceholder')}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-lime-500 transition-colors"
                    />
                </div>
            </div>

            {/* Botão de Envio */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading || isUploading}
                    className="w-full bg-lime-500 hover:bg-lime-600 text-zinc-950 font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-lime-500/20"
                >
                    <Save size={18} />
                    {isLoading || isUploading ? 'Salvando...' : t('save')}
                </button>
            </div>
        </form>
    );
}