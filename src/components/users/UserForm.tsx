'use client'

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from 'next-intl'; // Importação adicionada
import {
    Camera,
    Save,
    User as UserIcon,
    Scale,
    Ruler,
    Target,
    ChevronLeft,
    Loader2,
} from "lucide-react";
import { User } from "@/config/types";

interface UserFormProps {
    initialData?: User;
    onSubmit: (data: User) => void;
    isLoading?: boolean;
    submitLabel?: string;
}

export default function UserForm({ initialData, onSubmit, isLoading, submitLabel }: UserFormProps) {
    const t = useTranslations('UserForm'); // Hook de tradução
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<User>({
        defaultValues: initialData || {
            name: "",
            weight: 0,
            height: 0,
            goal: "maintenance", // Valor padrão agora em inglês para bater com as chaves do JSON
            avatar: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            reset(initialData);
            if (initialData.avatar) setAvatarPreview(initialData.avatar);
        }
    }, [initialData, reset]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                setValue('avatar', base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
                <div className="relative group">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-32 h-32 rounded-[40px] bg-zinc-200 dark:bg-zinc-800 overflow-hidden border-4 border-white dark:border-zinc-900 shadow-xl cursor-pointer transition-transform active:scale-95"
                    >
                        {avatarPreview || watch('avatar') ? (
                            <img
                                src={avatarPreview || watch('avatar')}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                                <UserIcon size={48} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <Camera className="text-white" size={24} />
                        </div>
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />
                </div>
                <p className="mt-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">{t('profilePicture')}</p>
            </div>

            {/* Campos do Formulário */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">{t('fullName')}</label>
                    <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                            {...register("name", { required: t('nameRequired') })}
                            className={`w-full bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all`}
                            placeholder={t('fullNamePlaceholder')}
                        />
                    </div>
                    {errors.name && <span className="text-[10px] text-red-500 ml-4 font-bold">{errors.name.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">{t('weight')}</label>
                        <div className="relative">
                            <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="number" step="0.1"
                                {...register("weight", { required: true, min: 20, valueAsNumber: true })}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">{t('height')}</label>
                        <div className="relative">
                            <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                            <input
                                type="number"
                                {...register("height", { required: true, min: 50, valueAsNumber: true })}
                                className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">{t('goal')}</label>
                    <div className="relative">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <select
                            {...register("goal")}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-lime-400 transition-all cursor-pointer"
                        >
                            <option value="weight_loss">{t('goals.weight_loss')}</option>
                            <option value="muscle">{t('goals.muscle')}</option>
                            <option value="condition">{t('goals.condition')}</option>
                            <option value="maintenance">{t('goals.maintenance')}</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <ChevronLeft size={16} className="rotate-[270deg] text-zinc-400" />
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-lime-500/10
                    ${isLoading
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                        : 'bg-lime-400 text-zinc-950 hover:bg-lime-300'}`}
            >
                {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                ) : (
                    <>
                        <Save size={18} />
                        {submitLabel || t('saveProfile')}
                    </>
                )}
            </button>
        </form>
    );
}