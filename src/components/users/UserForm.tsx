'use client';

import { userService } from '@/services/userService';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

export default function UserForm({ onCancel }: { onCancel?: () => void }) {
    const t = useTranslations('UserRegister');
    const { register, handleSubmit } = useForm();

    const onSubmit = async (data: any) => {
        await userService.createUser({
            name: data.name,
            weight: Number(data.weight),
            height: Number(data.height),
        });
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            <div>
                <label className="block text-sm font-medium mb-1 dark:text-zinc-300">{t('nameLabel')}</label>
                <input
                    {...register('name', { required: true })}
                    className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 focus:ring-2 focus:ring-lime-500 outline-none"
                    placeholder="Ex: João Silva"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-zinc-300">{t('weightLabel')}</label>
                    <input
                        type="number"
                        {...register('weight')}
                        className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-zinc-300">{t('heightLabel')}</label>
                    <input
                        type="number"
                        {...register('height')}
                        className="w-full p-3 rounded-xl border dark:bg-zinc-900 dark:border-zinc-800 outline-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-lime-500/20"
            >
                {t('createButton')}
            </button>

            {onCancel && (
                <button onClick={onCancel} type="button" className="w-full text-zinc-500 text-sm">
                    Cancelar
                </button>
            )}
        </form>
    );
}