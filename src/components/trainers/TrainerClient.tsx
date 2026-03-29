'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { createClient } from '@/lib/supabase/client';
import { connectionService } from '@/services/connectionService';
import { userService } from '@/services/userService';
import { toast } from 'react-toastify';
import {
    Users,
    UserPlus,
    QrCode,
    Search,
    X,
    Check,
    User,
    ChevronRight,
    Camera,
    ArrowLeft
} from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface Student {
    id: string;
    name: string;
    avatar: string | null;
}

interface TrainerClientProps {
    trainerId: string;
    initialStudents: Student[];
}

export default function TrainerClient({ trainerId, initialStudents }: TrainerClientProps) {
    const t = useTranslations('Trainer');
    const supabase = createClient();
    const [students, setStudents] = useState<Student[]>(initialStudents);
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
            if (scanner) {
                scanner.clear().catch(console.error);
            }
        };
    }, [isScannerOpen]);

    async function onScanSuccess(decodedText: string) {
        setIsScannerOpen(false);
        await linkStudent(decodedText);
    }

    function onScanError(error: any) {
        // Suppress scanner errors to avoid too many logs
    }

    async function handleManualLink() {
        if (!emailInput.trim() || !emailInput.includes('@')) {
            toast.error(t('invalidEmail'));
            return;
        }
        await linkStudent(emailInput.trim(), 'email');
    }

    async function linkStudent(input: string, type: 'email' | 'id' = 'id') {
        setIsLinking(true);
        try {
            let finalStudentId = '';

            if (type === 'email') {
                const foundUser = await userService.getUserByEmail(input, supabase);
                if (!foundUser || !foundUser.id) {
                    toast.error(t('userNotFound'));
                    return;
                }
                finalStudentId = foundUser.id;
            } else {
                // Se o ID não for um UUID (padrão simples: checar por hífen de UUID)
                // Ou se tiver o prefixo que geramos
                if (input.includes('USER-') || input.length < 36) {
                    const foundUser = await userService.getUserByGymauxId(input, supabase);
                    if (!foundUser || !foundUser.id) {
                        toast.error(t('userNotFound'));
                        return;
                    }
                    finalStudentId = foundUser.id;
                } else {
                    finalStudentId = input;
                }
            }

            if (!finalStudentId) throw new Error('Could not determine student ID');

            await connectionService.createConnection(trainerId, finalStudentId, supabase);
            toast.success(t('requestSent'));
            setEmailInput('');
        } catch (error: any) {
            console.error(error);
            toast.error(t('requestError'));
        } finally {
            setIsLinking(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Link href="/home" className="p-3 bg-zinc-800 rounded-2xl">
                        <ArrowLeft className="w-6 h-6 text-zinc-100" />
                    </Link>
                    <div className="p-3 bg-lime-400 rounded-2xl">
                        <Users className="w-6 h-6 text-zinc-950" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100">{t('title')}</h1>
                        <p className="text-zinc-400">{t('activeStudents')}</p>
                    </div>
                </div>
            </header>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsScannerOpen(true)}
                    className="flex flex-col items-center justify-center p-8 bg-zinc-900 border border-zinc-800 rounded-[32px] hover:border-lime-400/50 transition-colors group"
                >
                    <div className="p-4 bg-lime-400/10 rounded-full mb-4 group-hover:bg-lime-400/20 transition-colors">
                        <QrCode className="w-8 h-8 text-lime-400" />
                    </div>
                    <span className="font-semibold text-zinc-200">{t('linkStudent')}</span>
                </motion.button>

                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-[32px] space-y-4 shadow-xl">
                    <div className="flex items-center gap-2 text-zinc-400 text-sm font-medium">
                        <Search className="w-4 h-4 text-lime-400" />
                        <span>{t('linkByEmail')}</span>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualLink()}
                            placeholder={t('idPlaceholder')}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400/20 transition-all"
                        />
                        <button
                            onClick={handleManualLink}
                            disabled={!emailInput || isLinking}
                            className="p-3 bg-lime-400 rounded-2xl disabled:opacity-50 disabled:grayscale transition-all hover:brightness-110 active:scale-95 flex items-center justify-center min-w-[50px]"
                        >
                            {isLinking ? (
                                <div className="w-6 h-6 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
                            ) : (
                                <Check className="w-6 h-6 text-zinc-950" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Students List */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold text-zinc-100 px-2">{t('activeStudents')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <AnimatePresence mode="popLayout">
                        {students.length > 0 ? (
                            students.map((student) => (
                                <Link key={student.id} href={`/trainer/${student.id}`}>
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="p-4 bg-zinc-900/50 border border-zinc-800/50 rounded-[32px] flex items-center gap-4 hover:border-lime-400/30 hover:bg-zinc-900 transition-all group cursor-pointer"
                                    >
                                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                                        {student.avatar ? (
                                            <Image
                                                src={student.avatar}
                                                alt={student.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-lime-400/10">
                                                <User className="w-8 h-8 text-lime-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-zinc-100 truncate">{student.name}</h3>
                                        <p className="text-sm text-zinc-500 truncate">ID: {student.id.split('-')[0]}...</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-zinc-700 group-hover:text-lime-400 transition-colors" />
                                    </motion.div>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-zinc-900/30 rounded-[32px] border-2 border-dashed border-zinc-800">
                                <p className="text-zinc-500">{t('noStudents')}</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Scanner Modal */}
            <AnimatePresence>
                {isScannerOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm"
                            onClick={() => setIsScannerOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                                <div className="flex items-center gap-3">
                                    <Camera className="w-5 h-5 text-lime-400" />
                                    <h3 className="font-bold text-zinc-100">{t('scanTitle')}</h3>
                                </div>
                                <button
                                    onClick={() => setIsScannerOpen(false)}
                                    className="p-2 hover:bg-zinc-800 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5 text-zinc-400" />
                                </button>
                            </div>
                            <div className="p-6">
                                <div id="qr-reader" className="w-full overflow-hidden rounded-2xl border border-lime-400/20" />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
