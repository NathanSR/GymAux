'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { connectionService, Connection } from '@/services/connectionService';
import { toast } from 'react-toastify';
import { 
    UserPlus, 
    Check, 
    X, 
    ShieldAlert,
    Loader2
} from 'lucide-react';

interface ConnectionConfirmationModalProps {
    userId: string;
}

export default function ConnectionConfirmationModal({ userId }: ConnectionConfirmationModalProps) {
    const t = useTranslations('Connection');
    const supabase = createClient();
    const [pendingConnection, setPendingConnection] = useState<(Connection & { trainer: { name: string } }) | null>(null);
    const [isResponding, setIsResponding] = useState(false);

    useEffect(() => {
        if (!userId) return;

        // Initial check
        checkPending();

        // Real-time subscription for new requests
        const channel = supabase
            .channel('connections_changes')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'connections',
                    filter: `student_id=eq.${userId}`
                },
                (payload) => {
                    if (payload.new.status === 'pending') {
                        checkPending();
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId]);

    async function checkPending() {
        try {
            const pending = await connectionService.getPendingConnectionForStudent(userId, supabase);
            setPendingConnection(pending);
        } catch (error) {
            console.error('Error checking pending connection:', error);
        }
    }

    async function handleResponse(status: 'active' | 'revoked') {
        if (!pendingConnection) return;

        setIsResponding(true);
        try {
            await connectionService.respondToConnection(pendingConnection.id, status, supabase);
            toast.success(status === 'active' ? t('accepted') : t('declined'));
            setPendingConnection(null);
        } catch (error) {
            console.error('Error responding to connection:', error);
            toast.error(t('error'));
        } finally {
            setIsResponding(false);
        }
    }

    return (
        <AnimatePresence>
            {pendingConnection && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl"
                    >
                        <div className="p-8 text-center space-y-6">
                            <div className="mx-auto w-20 h-20 bg-lime-400/10 rounded-full flex items-center justify-center relative">
                                <UserPlus className="w-10 h-10 text-lime-400" />
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-lime-400 rounded-full flex items-center justify-center animate-bounce">
                                    <span className="w-2 h-2 bg-zinc-950 rounded-full" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-zinc-100 italic uppercase">
                                    {t('pendingTitle')}
                                </h3>
                                <p className="text-zinc-400 text-sm leading-relaxed px-4">
                                    {t('pendingDescription', { name: pendingConnection.trainer.name })}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <button
                                    disabled={isResponding}
                                    onClick={() => handleResponse('revoked')}
                                    className="p-4 bg-zinc-800 border border-zinc-700 rounded-2xl font-bold text-zinc-300 hover:bg-zinc-700 hover:border-zinc-600 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    {t('decline')}
                                </button>
                                <button
                                    disabled={isResponding}
                                    onClick={() => handleResponse('active')}
                                    className="p-4 bg-lime-400 rounded-2xl font-bold text-zinc-950 hover:bg-lime-300 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isResponding ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Check className="w-5 h-5" />
                                    )}
                                    {t('accept')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
