import { X, Info, Zap, Layers, RefreshCcw, Activity, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const GroupTypeHelpModal = ({ isOpen, onClose }: {
    isOpen: boolean,
    onClose: () => void
}) => {
    const t = useTranslations('WorkoutForm.groupTypesHelp');
    const tg = useTranslations('WorkoutForm.groupTypes');

    if (!isOpen) return null;

    const groupTypes = [
        { id: 'straight', icon: Play, color: 'text-blue-500 dark:text-blue-400', bg: 'bg-blue-500/10' },
        { id: 'bi_set', icon: Zap, color: 'text-amber-500 dark:text-amber-400', bg: 'bg-amber-500/10' },
        { id: 'tri_set', icon: Layers, color: 'text-orange-500 dark:text-orange-400', bg: 'bg-orange-500/10' },
        { id: 'giant_set', icon: Activity, color: 'text-red-500 dark:text-red-400', bg: 'bg-red-500/10' },
        { id: 'circuit', icon: RefreshCcw, color: 'text-lime-500 dark:text-lime-400', bg: 'bg-lime-500/10' },
    ];

    return (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-950 w-full max-w-lg h-[80vh] sm:h-auto sm:max-h-[85vh] rounded-t-[32px] sm:rounded-[32px] flex flex-col overflow-hidden shadow-2xl border dark:border-zinc-800 animate-in slide-in-from-bottom-10 duration-300">
                
                {/* Header */}
                <div className="p-6 border-b dark:border-zinc-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-lime-400/20 flex items-center justify-center">
                            <Info className="text-lime-600 dark:text-lime-400" size={20} />
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight dark:text-white">
                            {t('title')}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-full transition-colors cursor-pointer"
                    >
                        <X size={24} className="text-zinc-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {groupTypes.map(({ id, icon: Icon, color, bg }) => (
                        <div key={id} className="flex gap-4 group">
                            <div className={`w-12 h-12 shrink-0 rounded-2xl ${bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                                <Icon className={color} size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="font-black text-sm uppercase tracking-wider dark:text-white">
                                    {tg(id)}
                                </h4>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                                    {t(id)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="p-6 border-t dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <button
                        onClick={onClose}
                        className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity cursor-pointer"
                    >
                        Entendi
                    </button>
                </div>
            </div>
        </div>
    );
};
