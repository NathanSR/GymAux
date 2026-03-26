'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
    const t = useTranslations('Marketing');
    // Estado para controlar qual item está aberto
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    // Configuração para o surgimento da lista (entrada inicial)
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 } // Efeito de cascata na entrada
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section id="faq" className="max-w-4xl mx-auto py-32 mb-20 px-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <span className="text-brand font-black tracking-widest text-xs uppercase italic">{t('FAQ.title')}</span>
                <h2 className="text-5xl font-black italic uppercase tracking-tighter mt-4 text-zinc-100">FREQUENTLY ASKED</h2>
            </motion.div>

            <motion.div
                className="grid grid-cols-1 gap-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                {[1, 2, 3].map((num) => {
                    const isOpen = activeIndex === num;

                    return (
                        <motion.div
                            key={num}
                            variants={itemVariants}
                            layout // Faz os outros itens deslizarem suavemente ao abrir
                            onClick={() => toggleAccordion(num)}
                            className={`cursor-pointer group border rounded-3xl p-8 transition-colors duration-300 ${isOpen ? 'bg-white/10 border-brand' : 'bg-white/5 border-white/10 hover:bg-white/[0.07]'
                                }`}
                        >
                            <div className="flex items-center justify-between w-full text-left">
                                <h4 className={`text-lg font-bold italic uppercase tracking-tight transition-colors ${isOpen ? 'text-brand' : 'text-white group-hover:text-brand'
                                    }`}>
                                    {t(`FAQ.q${num}.q`)}
                                </h4>
                                <motion.div
                                    animate={{ rotate: isOpen ? 180 : 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-brand' : 'text-zinc-500'}`} />
                                </motion.div>
                            </div>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }} // Curva de arpejo (suave/elástica)
                                        className="overflow-hidden"
                                    >
                                        <p className="mt-4 text-zinc-400 leading-relaxed font-medium">
                                            {t(`FAQ.q${num}.a`)}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}