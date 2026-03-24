import { useTheme } from '@/context/ThemeContext';
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

export const useAlerts = () => {
    const { isDark } = useTheme();

    const baseOptions: SweetAlertOptions = {
        background: isDark ? '#18181b' : '#ffffff',
        color: isDark ? '#f4f4f5' : '#18181b',
        confirmButtonColor: '#a3e635', // lime-400
        cancelButtonColor: '#3f3f46',  // zinc-700
        customClass: {
            popup: 'rounded-[32px] border border-zinc-200 dark:border-zinc-800 shadow-2xl',
            confirmButton: 'rounded-2xl px-6 py-3 font-black uppercase text-xs tracking-widest',
            cancelButton: 'rounded-2xl px-6 py-3 font-black uppercase text-xs tracking-widest',
        },
    };

    const confirm = async (options: {
        title: string;
        text?: string;
        icon?: SweetAlertIcon;
        confirmText?: string;
        cancelText?: string;
        danger?: boolean;
    }) => {
        return Swal.fire({
            ...baseOptions,
            title: options.title,
            text: options.text,
            icon: options.icon || 'question',
            showCancelButton: true,
            confirmButtonText: options.confirmText || 'Confirmar',
            cancelButtonText: options.cancelText || 'Cancelar',
            confirmButtonColor: options.danger ? '#ef4444' : baseOptions.confirmButtonColor,
        });
    };

    const success = (title: string, text?: string) => {
        return Swal.fire({
            ...baseOptions,
            title,
            text,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    };

    const error = (title: string, text?: string) => {
        return Swal.fire({
            ...baseOptions,
            title,
            text,
            icon: 'error',
        });
    };

    const info = (title: string, text?: string) => {
        return Swal.fire({
            ...baseOptions,
            title,
            text,
            icon: 'info',
        });
    };

    return {
        confirm,
        success,
        error,
        info,
        Swal, // Exposé for custom cases
    };
};
