'use client';

import { useState } from 'react';
import { ExerciseCategory } from '@/config/types';
import { taxonomyService } from '@/services/taxonomyService';
import { createClient } from '@/lib/supabase/client';
import { toast } from '@/utils/toast';
import { Plus, Edit2, Trash2, Check, X, Globe, Layers, ArrowLeft } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { Modal } from '@/components/ui/Modal';
import { numberInputUtils } from '@/utils/numberUtil';

const SUPPORTED_LOCALES = [
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
] as const;

type LocaleCode = typeof SUPPORTED_LOCALES[number]['code'];

interface AdminCategoriesClientProps {
    initialCategories: ExerciseCategory[];
}

export default function AdminCategoriesClient({ initialCategories }: AdminCategoriesClientProps) {
    const [categories, setCategories] = useState<ExerciseCategory[]>(initialCategories);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ExerciseCategory | null>(null);
    const [activeTab, setActiveTab] = useState<LocaleCode>('pt');
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [slug, setSlug] = useState('');
    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [color, setColor] = useState('#a3e635');
    const [displayOrder, setDisplayOrder] = useState<number | ''>(0);
    const [isActive, setIsActive] = useState(true);
    const [translations, setTranslations] = useState<Record<string, string>>({
        pt: '',
        en: '',
        es: ''
    });

    const openCreateModal = () => {
        setEditingCategory(null);
        setSlug('');
        setName('');
        setImageUrl('');
        setColor('#a3e635');
        setDisplayOrder(categories.length + 1);
        setIsActive(true);
        setTranslations({ pt: '', en: '', es: '' });
        setActiveTab('pt');
        setIsModalOpen(true);
    };

    const openEditModal = (cat: ExerciseCategory) => {
        setEditingCategory(cat);
        setSlug(cat.slug);
        setName(cat.name);
        setImageUrl(cat.imageUrl || '');
        setColor(cat.color || '#a3e635');
        setDisplayOrder(cat.displayOrder || 0);
        setIsActive(cat.isActive ?? true);
        setTranslations({
            pt: cat.translations?.pt || cat.name || '',
            en: cat.translations?.en || '',
            es: cat.translations?.es || ''
        });
        setActiveTab('pt');
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!slug.trim()) {
            toast.error('O slug é obrigatório (ex: chest, trapezius).');
            return;
        }

        const resolvedName = translations.pt?.trim() || name.trim() || slug.trim();

        setIsSaving(true);
        try {
            const supabase = createClient();
            const payload: Partial<ExerciseCategory> = {
                slug: slug.trim().toLowerCase().replace(/\s+/g, '_'),
                name: resolvedName,
                imageUrl: imageUrl.trim() || null,
                color: color || '#a3e635',
                displayOrder: Number(displayOrder) || 0,
                isActive,
                translations: {
                    pt: translations.pt?.trim() || resolvedName,
                    en: translations.en?.trim() || '',
                    es: translations.es?.trim() || ''
                }
            };

            if (editingCategory && editingCategory.id) {
                await taxonomyService.updateCategoryAdmin(editingCategory.id, payload, supabase);
                toast.success('Categoria atualizada com sucesso!');
            } else {
                const created = await taxonomyService.createCategoryAdmin(payload, supabase);
                payload.id = created.id;
                toast.success('Categoria criada com sucesso!');
            }

            // Recarrega lista
            const updated = await taxonomyService.getAllCategoriesAdmin(supabase);
            setCategories(updated);
            setIsModalOpen(false);
        } catch (err: any) {
            console.error('[AdminCategoriesClient] Error saving category:', err);
            toast.error(err.message || 'Erro ao salvar categoria.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        if (!confirm('Tem certeza de que deseja remover esta categoria? Isso pode afetar exercícios vinculados a ela.')) {
            return;
        }

        try {
            const supabase = createClient();
            await taxonomyService.deleteCategoryAdmin(id, supabase);
            toast.success('Categoria excluída!');
            setCategories(categories.filter(c => c.id !== id));
        } catch (err: any) {
            console.error('[AdminCategoriesClient] Error deleting category:', err);
            toast.error(err.message || 'Erro ao excluir categoria.');
        }
    };

    return (
        <div className="p-6 md:p-10 space-y-8 text-white">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
                <div className="space-y-1">
                    <Link
                        href="/admin"
                        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors mb-2"
                    >
                        <ArrowLeft size={14} />
                        Voltar ao Painel
                    </Link>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-3">
                        <Layers className="text-lime-400" />
                        Categorias e Grupos Musculares
                    </h1>
                    <p className="text-zinc-500 text-sm">
                        Cadastre, edite ou traduza as categorias do sistema dinamicamente.
                    </p>
                </div>
                <button
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-lime-500/10 transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={16} />
                    Nova Categoria
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => (
                    <div
                        key={cat.slug}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                            cat.isActive
                                ? 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                                : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                        }`}
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                    Ordem #{cat.displayOrder}
                                </span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        cat.isActive
                                            ? 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                                            : 'bg-zinc-800 text-zinc-500 border border-zinc-700'
                                    }`}
                                >
                                    {cat.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                {cat.imageUrl ? (
                                    <img
                                        src={cat.imageUrl}
                                        alt={cat.name}
                                        className="w-12 h-12 rounded-xl object-contain bg-zinc-800/50 p-1 border border-zinc-700/50"
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-zinc-950"
                                        style={{ backgroundColor: cat.color || '#a3e635' }}
                                    >
                                        {cat.slug.slice(0, 2).toUpperCase()}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-base text-white">{cat.name}</h3>
                                    <code className="text-xs text-zinc-400 font-mono">slug: {cat.slug}</code>
                                </div>
                            </div>

                            {/* Translations Preview */}
                            <div className="space-y-1 pt-2 border-t border-zinc-800/50 text-xs">
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <span>🇧🇷</span>
                                    <span>{cat.translations?.pt || cat.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <span>🇺🇸</span>
                                    <span>{cat.translations?.en || <em className="text-zinc-600">Não traduzido</em>}</span>
                                </div>
                                <div className="flex items-center gap-2 text-zinc-400">
                                    <span>🇪🇸</span>
                                    <span>{cat.translations?.es || <em className="text-zinc-600">Não traduzido</em>}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-zinc-800/50">
                            <button
                                onClick={() => openEditModal(cat)}
                                className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                                title="Editar"
                            >
                                <Edit2 size={14} />
                            </button>
                            {cat.id && (
                                <button
                                    onClick={() => handleDelete(cat.id)}
                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                                    title="Excluir"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Criação / Edição */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => !isSaving && setIsModalOpen(false)}
                title={editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                maxWidth="max-w-lg"
            >
                <form onSubmit={handleSave} className="space-y-5 p-6 text-white">
                    {/* Slug & Ordem */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-300 uppercase">Slug Único</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="ex: chest, trapezius"
                                disabled={!!editingCategory}
                                required
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-lime-400 disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-300 uppercase">Ordem de Exibição</label>
                            <input
                                type="number"
                                value={numberInputUtils.formatValue(displayOrder)}
                                onFocus={numberInputUtils.onFocus}
                                onChange={(e) => numberInputUtils.onChange(e, (val) => setDisplayOrder(val))}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
                            />
                        </div>
                    </div>

                    {/* Image URL & Color */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <label className="text-xs font-bold text-zinc-300 uppercase">URL da Imagem / Ícone</label>
                            <input
                                type="text"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="/images/categories/chest.png"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-lime-400"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-zinc-300 uppercase">Cor Destaque</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={color}
                                    onChange={(e) => setColor(e.target.value)}
                                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                                />
                                <span className="text-xs font-mono text-zinc-400">{color}</span>
                            </div>
                        </div>
                    </div>

                    {/* Abas de Idioma */}
                    <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-zinc-300 uppercase flex items-center gap-2">
                            <Globe size={14} className="text-lime-400" />
                            Traduções do Nome
                        </label>
                        <div className="flex gap-1.5 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                            {SUPPORTED_LOCALES.map((loc) => (
                                <button
                                    key={loc.code}
                                    type="button"
                                    onClick={() => setActiveTab(loc.code)}
                                    className={`flex-1 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                                        activeTab === loc.code
                                            ? 'bg-lime-400 text-zinc-950 shadow-md font-black'
                                            : 'text-zinc-400 hover:text-white'
                                    }`}
                                >
                                    <span>{loc.flag}</span>
                                    <span>{loc.label}</span>
                                </button>
                            ))}
                        </div>

                        <div>
                            <input
                                type="text"
                                value={translations[activeTab] || ''}
                                onChange={(e) => setTranslations({ ...translations, [activeTab]: e.target.value })}
                                placeholder={`Nome da categoria em ${SUPPORTED_LOCALES.find(l => l.code === activeTab)?.label}...`}
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400"
                            />
                        </div>
                    </div>

                    {/* Status Ativo */}
                    <div className="flex items-center gap-3 pt-2">
                        <input
                            type="checkbox"
                            id="catIsActive"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 rounded text-lime-400 focus:ring-lime-400 bg-zinc-900 border-zinc-700"
                        />
                        <label htmlFor="catIsActive" className="text-xs font-bold text-zinc-300 cursor-pointer">
                            Categoria Ativa no Sistema
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isSaving}
                            className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-500 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                        >
                            <Check size={14} />
                            {isSaving ? 'Salvando...' : 'Salvar Categoria'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
