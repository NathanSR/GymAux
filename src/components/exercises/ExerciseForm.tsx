import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Save,
    Dumbbell,
    Video,
    Tag as TagIcon,
    AlertCircle,
    Type,
    AlignLeft
} from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Nota: A importação de 'next-intl' foi comentada para garantir o funcionamento do Preview.
 * Em seu ambiente local, descomente a linha abaixo.
 */
// import { useTranslations } from 'next-intl';

/**
 * Componente reutilizável para Criar e Editar exercícios.
 * @param {Object} initialData - Dados iniciais (para edição)
 * @param {Function} onSubmit - Função de callback ao enviar
 * @param {boolean} isLoading - Estado de carregamento do botão
 */
export default function ExerciseForm({ initialData, onSubmit, isLoading }: {
    initialData?: {
        name: string;
        category: string;
        description: string;
        mediaUrl: string;
        tags: string;
    };
    onSubmit: (data: any) => void;
    isLoading?: boolean;
}) {

    const t = useTranslations('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: initialData || {
            name: '',
            category: 'chest',
            description: '',
            mediaUrl: '',
            tags: ''
        }
    });

    const categories = ["chest", "back", "legs", "shoulders", "arms", "core", "cardio"];

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
                                <option key={c} value={c}>{t(`categories.${c}`).toUpperCase()}</option>
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

            {/* Descrição */}
            <div>
                <label className="block text-[10px] font-black uppercase text-zinc-400 mb-2 ml-1 flex items-center gap-2">
                    <AlignLeft size={12} /> {t('descriptionLabel')}
                </label>
                <textarea
                    {...register("description")}
                    rows={3}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-4 text-sm font-bold focus:ring-2 focus:ring-lime-400 outline-none resize-none shadow-sm"
                />
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