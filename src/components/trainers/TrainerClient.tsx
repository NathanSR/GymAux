'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { createClient } from '@/lib/supabase/client';
import { connectionService } from '@/services/connectionService';
import { userService } from '@/services/userService';
import { toast } from 'react-toastify';
import {
    Users,
    QrCode,
    X,
    Camera,
} from 'lucide-react';
import { Student, StudentCard } from './StudentCard';
import { TrainerHeader } from './TrainerHeader';
import { QuickActionCard } from './QuickActionCard';
import { EmailLinkCard } from './EmailLinkCard';


interface TrainerClientProps {
    trainerId: string;
    initialStudents: Student[];
}

// --- Main Component ---

export default function TrainerClient({ trainerId, initialStudents }: TrainerClientProps) {
    const t = useTranslations('Trainer');
    const supabase = createClient();
    const [students] = useState<Student[]>(initialStudents);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [isLinking, setIsLinking] = useState(false);

    useEffect(() => {
        let scanner: Html5QrcodeScanner | null = null;
        if (isScannerOpen) {
            scanner = new Html5QrcodeScanner(
                'qr-reader',
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scanner.render(onScanSuccess, onScanError);
        }
        return () => {
            if (scanner) scanner.clear().catch(console.error);
        };
    }, [isScannerOpen]);

    const onScanSuccess = useCallback(async (decodedText: string) => {
        setIsScannerOpen(false);
        await linkStudent(decodedText);
    }, []);

    const onScanError = useCallback(() => { }, []);

    const handleManualLink = useCallback(async () => {
        if (!emailInput.trim() || !emailInput.includes('@')) {
            toast.error(t('invalidEmail'));
            return;
        }
        await linkStudent(emailInput.trim(), 'email');
    }, [emailInput, t]);

    const linkStudent = async (input: string, type: 'email' | 'id' = 'id') => {
        setIsLinking(true);
        try {
            let finalId = '';
            if (type === 'email') {
                const user = await userService.getUserByEmail(input, supabase);
                if (!user?.id) return toast.error(t('userNotFound'));
                finalId = user.id;
            } else {
                if (input.includes('USER-') || input.length < 36) {
                    const user = await userService.getUserByGymauxId(input, supabase);
                    if (!user?.id) return toast.error(t('userNotFound'));
                    finalId = user.id;
                } else finalId = input;
            }

            await connectionService.createConnection(trainerId, finalId, supabase);
            toast.success(t('requestSent'));
            setEmailInput('');
        } catch (error: any) {
            toast.error(t('requestError'));
        } finally {
            setIsLinking(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white p-6 lg:p-10 pb-32 transition-colors duration-300 font-sans max-w-4xl mx-auto space-y-12 overflow-x-hidden">
            <TrainerHeader t={t} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickActionCard
                    onClick={() => setIsScannerOpen(true)}
                    icon={QrCode}
                    label={t('linkStudent')}
                    t={t}
                />
                <EmailLinkCard
                    emailInput={emailInput}
                    setEmailInput={setEmailInput}
                    onLink={handleManualLink}
                    isLinking={isLinking}
                    t={t}
                />
            </div>

            <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        {t('activeStudents')}
                        <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-[10px] px-2 py-0.5 rounded-full border border-zinc-200 dark:border-white/5 uppercase">
                            {students.length} Total
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {students.length > 0 ? (
                            students.map(student => (
                                <StudentCard key={student.id} student={student} />
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="col-span-full py-16 text-center bg-zinc-50 dark:bg-zinc-900/20 rounded-[40px] border-2 border-dashed border-zinc-200 dark:border-zinc-800"
                            >
                                <Users className="w-12 h-12 text-zinc-300 dark:text-zinc-800 mx-auto mb-4" />
                                <p className="text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-[0.2em] text-[10px]">{t('noStudents')}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <AnimatePresence>
                {isScannerOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-zinc-950/80"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 border-b border-zinc-100 dark:border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-lime-400/10 rounded-2xl">
                                        <Camera className="w-6 h-6 text-lime-600 dark:text-lime-400" />
                                    </div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-100">{t('scanTitle')}</h3>
                                </div>
                                <button
                                    onClick={() => setIsScannerOpen(false)}
                                    className="p-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-2xl transition-colors border border-zinc-200 dark:border-white/5"
                                >
                                    <X className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                                </button>
                            </div>
                            <div className="p-8">
                                <div id="qr-reader" className="w-full overflow-hidden rounded-[32px] border-2 border-lime-500/20 dark:border-lime-400/20 bg-zinc-50 dark:bg-black/40 shadow-inner" />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
