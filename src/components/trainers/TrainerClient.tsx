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
    Search,
    X,
    Check,
    User,
    ChevronRight,
    Camera,
    ArrowLeft,
    Plus
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

// --- Types ---
interface Student {
    id: string;
    name: string;
    avatar: string | null;
}

interface TrainerClientProps {
    trainerId: string;
    initialStudents: Student[];
}

// --- Sub-components (Memoized for Performance) ---

const Header = memo(({ t }: { t: any }) => (
    <header className="flex items-center gap-4 mb-10">
        <Link
            href="/home"
            className="group p-3 bg-white dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200 dark:border-white/5 rounded-2xl hover:border-lime-400/50 transition-all duration-300 shadow-sm dark:shadow-none"
        >
            <ArrowLeft className="w-5 h-5 text-zinc-500 dark:text-zinc-400 group-hover:text-lime-500 dark:group-hover:text-lime-400 transition-colors" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
            <div className="relative">
                <div className="absolute inset-0 bg-lime-400 blur-xl opacity-20 animate-pulse" />
                <div className="relative p-3 bg-lime-400 rounded-2xl shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                    <Users className="w-6 h-6 text-zinc-950" />
                </div>
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    {t('title')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">{t('activeStudents')}</p>
            </div>
        </div>
    </header>
));
Header.displayName = 'Header';

const QuickActionCard = memo(({ onClick, icon: Icon, label, t }: { onClick: () => void, icon: any, label: string, t: any }) => (
    <motion.button
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="flex flex-col items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[32px] hover:border-lime-500 dark:hover:border-lime-400/30 transition-all group overflow-hidden relative shadow-sm dark:shadow-none"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="p-4 bg-lime-400/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-8 h-8 text-lime-600 dark:text-lime-400" />
        </div>
        <span className="font-bold uppercase italic tracking-tighter text-zinc-700 dark:text-zinc-200 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{label}</span>
    </motion.button>
));
QuickActionCard.displayName = 'QuickActionCard';

const EmailLinkCard = memo(({ emailInput, setEmailInput, onLink, isLinking, t }: any) => (
    <div className="p-7 bg-zinc-50 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200 dark:border-white/5 rounded-[32px] space-y-5 shadow-sm dark:shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <div className="w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,1)]" />
            <span>{t('linkByEmail')}</span>
        </div>
        <div className="flex gap-2">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-600 group-focus-within:text-lime-600 dark:group-focus-within:text-lime-400 transition-colors" />
                <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onLink()}
                    placeholder={t('idPlaceholder')}
                    className="w-full bg-white dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 rounded-2xl pl-11 pr-4 py-3.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:border-lime-500/50 dark:focus:border-lime-400/50 focus:ring-4 focus:ring-lime-500/5 dark:focus:ring-lime-400/5 transition-all outline-none"
                />
            </div>
            <button
                onClick={onLink}
                disabled={!emailInput || isLinking}
                className="px-5 bg-lime-400 text-zinc-950 rounded-2xl disabled:opacity-30 disabled:grayscale transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.4)] active:scale-90 flex items-center justify-center min-w-[56px]"
            >
                {isLinking ? (
                    <div className="w-5 h-5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                ) : (
                    <Plus className="w-6 h-6 stroke-[2.5px]" />
                )}
            </button>
        </div>
    </div>
));
EmailLinkCard.displayName = 'EmailLinkCard';

const StudentCard = memo(({ student }: { student: Student }) => (
    <Link href={`/trainer/${student.id}`}>
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -2 }}
            className="p-4 bg-white dark:bg-zinc-900/30 backdrop-blur-sm border border-zinc-200 dark:border-white/5 rounded-[28px] flex items-center gap-4 hover:border-lime-500/30 dark:hover:border-lime-400/20 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-all group shadow-sm dark:shadow-none"
        >
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 border border-zinc-200 dark:border-white/5 group-hover:border-lime-500/20 dark:group-hover:border-lime-400/20 transition-colors">
                {student.avatar ? (
                    <Image src={student.avatar} alt={student.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <User className="w-7 h-7 text-zinc-400 dark:text-zinc-600 group-hover:text-lime-600 dark:group-hover:text-lime-400 transition-colors duration-300" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-black italic uppercase tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-lime-600 dark:group-hover:text-white transition-colors truncate">{student.name}</h3>
                <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-mono tracking-tight opacity-60">#{student.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 flex items-center justify-center border border-zinc-200 dark:border-white/5 group-hover:bg-lime-400 transition-all duration-300 shadow-sm dark:shadow-lg">
                <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 group-hover:translate-x-0.5 transition-all" />
            </div>
        </motion.div>
    </Link>
));
StudentCard.displayName = 'StudentCard';

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
            <Header t={t} />

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
