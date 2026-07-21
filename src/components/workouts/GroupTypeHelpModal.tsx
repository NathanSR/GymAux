import { Info, Zap, Layers, RefreshCcw, Activity, Play, Repeat } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Modal } from '@/components/ui/Modal';

export const GroupTypeHelpModal = ({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: () => void
}) => {
    const t = useTranslations('WorkoutForm.groupTypesHelp');
    const tg = useTranslations('WorkoutForm.groupTypes');

    const groupTypes = [
        { id: 'straight', icon: Play, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10 dark:bg-blue-500/20' },
        { id: 'bi_set', icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10 dark:bg-amber-500/20' },
        { id: 'tri_set', icon: Layers, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10 dark:bg-orange-500/20' },
        { id: 'giant_set', icon: Activity, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10 dark:bg-red-500/20' },
        { id: 'circuit', icon: RefreshCcw, color: 'text-lime-500 dark:text-lime-400', bg: 'bg-lime-500/10 dark:bg-lime-500/20' },
        { id: 'superset', icon: Repeat, color: 'text-purple-500 dark:text-purple-400', bg: 'bg-purple-500/10 dark:bg-purple-500/20' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('title')} zIndex="z-[200]">
            <div className="p-5 sm:p-6 space-y-5">
                <div className="space-y-4">
                    {groupTypes.map(({ id, icon: Icon, color, bg }) => (
                        <div key={id} className="flex gap-3.5 items-start group">
                            <div className={`w-10 h-10 shrink-0 rounded-xl ${bg} flex items-center justify-center transition-transform group-hover:scale-105 mt-0.5`}>
                                <Icon className={color} size={20} />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="font-black text-xs uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                                    {tg(id)}
                                </h4>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                    {t(id)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full py-3.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-md"
                    >
                        {t('gotIt')}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

