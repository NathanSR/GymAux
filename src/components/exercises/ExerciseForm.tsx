"use client";

import { useForm } from 'react-hook-form';
import {
    Save,
    Dumbbell,
    Video,
    Tag as TagIcon,
    AlertCircle,
    Type,
    AlignLeft,
    ListOrdered // Importado para o campo How To
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { CATEGORIES } from '@/config/constants';
import { useMemo } from 'react';

interface ExerciseFormProps {
    initialData?: {
        name: string;
        category: string;
        description: string;
        howTo: string; // Novo campo
        mediaUrl: string;
        tags: string;
    };
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}

export default function ExerciseForm({ initialData, onSubmit, isLoading }: ExerciseFormProps) {
    const t = useTranslations('ExerciseForm');
    const tc = useTranslations('Categories');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: initialData || {
            name: '',
            category: 'chest',
            description: '',
            howTo: '', // Inicializado vazio
            mediaUrl: '',
            tags: ''
        }
    });

    const categories = useMemo(() => {
        return [...CATEGORIES];
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome do Exercício */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <Type size={12} /> {t('nameLabel')}
                </label>
                <input
                    {...register("name", { required: t('nameRequired') })}
                    placeholder={t('namePlaceholder')}
                    className={`w-full bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none transition-all shadow-sm`}
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
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-lime-400 shadow-sm"
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
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none shadow-sm"
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
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-none shadow-sm"
                />
            </div>

            {/* Instruções de Execução (How To) - NOVO CAMPO */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <ListOrdered size={12} /> {t('howToLabel')}
                </label>
                <textarea
                    {...register("howTo")}
                    rows={5}
                    placeholder={t('howToPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-y min-h-[120px] shadow-sm"
                />
                <p className="text-[9px] text-zinc-500 mt-2 ml-1 italic">
                    {t('howToHint')} {/* Dica: Pressione Enter para criar novos parágrafos */}
                </p>
            </div>

            {/* Media URL */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <Video size={12} /> {t('mediaLabel')}
                </label>
                <div className="relative">
                    <Video className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        {...register("mediaUrl")}
                        placeholder="https://youtube.com/..."
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none shadow-sm"
                    />
                </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-lime-400 hover:bg-lime-500 text-zinc-950 py-5 rounded-[28px] font-black flex items-center justify-center gap-3 shadow-xl shadow-lime-500/20 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-zinc-950 border-t-transparent rounded-full animate-spin" />
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