'use client'

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    ChevronLeft,
    Camera,
    Save,
    User as UserIcon,
    Scale,
    Ruler,
    Target,
    AlertCircle,
    Loader2
} from "lucide-react";
import { User } from "@/config/types";
import { useSession } from "@/hooks/useSession";
import Loading from "@/app/[locale]/loading";
import { toast } from 'react-toastify';
import { useRouter } from "@/i18n/routing";
import { userService } from "@/services/userService";

export default function EditProfilePage() {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { activeUser, loading } = useSession()


    // Inicialização do React Hook Form
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<User>({
        defaultValues: {
            name: "",
            weight: 0,
            height: 0,
            goal: "Manutenção",
            avatar: ""
        }
    });

    // Sincroniza o formulário quando o activeUser for carregado
    useEffect(() => {
        if (activeUser) {
            reset(activeUser);
            if (activeUser.avatar) {
                setAvatarPreview(activeUser.avatar);
            }
        }
    }, [activeUser, reset]);

    // Função para processar o upload do avatar
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setAvatarPreview(base64String);
                setValue('avatar', base64String); // Atualiza o valor no hook form
            };
            reader.readAsDataURL(file);
        }
    };

    // Submissão do formulário
    const onSubmit = async (data: User) => {
        setIsSaving(true);

        await userService
            .updateUser(activeUser?.id as number, data)
            .then(() => toast.success('Perfil atualizado com sucesso!'))
            .finally(() => setIsSaving(false))

    };

    if (loading || !activeUser) return <Loading />

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-white pb-10 transition-colors">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900 px-6 py-4">
                <div className="flex items-center justify-between max-w-lg mx-auto">
                    <button
                        type="button"
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                        onClick={() => router.push("/home")}>
                        <ChevronLeft size={24} />
                    </button>
                    <h1 className="font-black text-lg uppercase tracking-tight italic">Editar Perfil</h1>
                    <div className="w-10"></div>
                </div>
            </header>

            <main className="p-6 max-w-lg mx-auto">
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
                        <p className="mt-4 text-[10px] font-black uppercase text-zinc-400 tracking-widest">Alterar foto de perfil</p>
                    </div>

                    {/* Form Controls */}
                    <div className="space-y-5">
                        {/* Nome */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">Nome Completo</label>
                            <div className="relative">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <input
                                    {...register("name", { required: "O nome é obrigatório" })}
                                    className={`w-full bg-white dark:bg-zinc-900 border ${errors.name ? 'border-red-500' : 'border-zinc-100 dark:border-zinc-800'} rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all`}
                                    placeholder="Seu nome"
                                />
                            </div>
                            {errors.name && <span className="text-[10px] text-red-500 ml-4 font-bold">{errors.name.message}</span>}
                        </div>

                        {/* Weight & Height Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">Peso (kg)</label>
                                <div className="relative">
                                    <Scale className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="number"
                                        step="0.1"
                                        {...register("weight", {
                                            required: true,
                                            min: 20,
                                            valueAsNumber: true
                                        })}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                    />
                                </div>
                                {errors.weight && <span className="text-[10px] text-red-500 ml-4 font-bold">Peso inválido</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">Altura (cm)</label>
                                <div className="relative">
                                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                    <input
                                        type="number"
                                        {...register("height", {
                                            required: true,
                                            min: 50,
                                            valueAsNumber: true
                                        })}
                                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 focus:ring-lime-400 transition-all"
                                    />
                                </div>
                                {errors.height && <span className="text-[10px] text-red-500 ml-4 font-bold">Altura inválida</span>}
                            </div>
                        </div>

                        {/* Goal */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-4 italic">Objetivo</label>
                            <div className="relative">
                                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                                <select
                                    {...register("goal")}
                                    className="w-full bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl py-4 pl-12 pr-4 text-sm font-bold outline-none appearance-none focus:ring-2 focus:ring-lime-400 transition-all cursor-pointer"
                                >
                                    <option value="Perda de Peso">Perda de Peso</option>
                                    <option value="Hipertrofia">Hipertrofia</option>
                                    <option value="Condicionamento">Condicionamento</option>
                                    <option value="Manutenção">Manutenção</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <ChevronLeft size={16} className="rotate-[270deg] text-zinc-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full py-5 rounded-3xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-lime-500/10
                            ${isSaving
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                                : 'bg-lime-400 text-zinc-950 hover:bg-lime-300'}`}
                    >
                        {isSaving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                <Save size={18} />
                                Guardar Perfil
                            </>
                        )}
                    </button>

                    {/* Tip Card */}
                    <div className="p-5 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-[32px] border border-zinc-200/50 dark:border-zinc-800/50 flex gap-4">
                        <AlertCircle className="text-zinc-400 shrink-0" size={20} />
                        <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                            Mantenha seu peso e altura atualizados para que possamos calcular suas métricas de progresso com maior precisão.
                        </p>
                    </div>
                </form>
            </main>
        </div>
    );
}