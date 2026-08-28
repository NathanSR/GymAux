import React, { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
    id?: string;
    autoClose?: number | false;
    title?: ReactNode;
    style?: React.CSSProperties;
    className?: string;
    onClick?: () => void;
    isLoading?: boolean;
    position?: string;
    theme?: string;
    hideProgressBar?: boolean;
    pauseOnHover?: boolean;
    draggable?: boolean;
    closeOnClick?: boolean;
    [key: string]: any;
}

export interface UpdateToastOptions {
    render?: ReactNode;
    type?: ToastType;
    isLoading?: boolean;
    autoClose?: number | false;
    title?: ReactNode;
    style?: React.CSSProperties;
    onClick?: () => void;
    position?: string;
    [key: string]: any;
}

export interface ToastData {
    id: string;
    type: ToastType;
    content: ReactNode;
    title?: ReactNode;
    createdAt: number;
    autoClose?: number | false;
    isLoading?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
}

type Listener = (toasts: ToastData[]) => void;

class ToastManager {
    private toasts: ToastData[] = [];
    private listeners: Set<Listener> = new Set();
    private collapseTimers: Map<string, NodeJS.Timeout> = new Map();
    private dismissTimers: Map<string, NodeJS.Timeout> = new Map();
    private idCounter = 0;

    private notify() {
        const snapshot = [...this.toasts];
        this.listeners.forEach((listener) => listener(snapshot));
    }

    public subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        listener([...this.toasts]);
        return () => {
            this.listeners.delete(listener);
        };
    }

    private generateId(): string {
        this.idCounter += 1;
        return `gymaux-toast-${Date.now()}-${this.idCounter}`;
    }

    private clearTimers(id: string) {
        if (this.collapseTimers.has(id)) {
            clearTimeout(this.collapseTimers.get(id));
            this.collapseTimers.delete(id);
        }
        if (this.dismissTimers.has(id)) {
            clearTimeout(this.dismissTimers.get(id));
            this.dismissTimers.delete(id);
        }
    }

    public show(content: ReactNode, type: ToastType = 'info', options: ToastOptions = {}): string {
        const id = options.id || this.generateId();
        this.clearTimers(id);

        const isPending = type === 'loading';
        const autoClose = options.autoClose !== undefined
            ? options.autoClose
            : isPending
                ? false
                : 3500;

        const newToast: ToastData = {
            id,
            type,
            content,
            title: options.title,
            createdAt: Date.now(),
            autoClose,
            isLoading: isPending,
            isCollapsed: false,
            onClick: options.onClick
        };

        // If exists, replace; otherwise append (limit to 3 active toasts)
        const index = this.toasts.findIndex((t) => t.id === id);
        if (index !== -1) {
            this.toasts[index] = newToast;
        } else {
            this.toasts = [newToast, ...this.toasts].slice(0, 4);
        }

        // Setup auto-collapse for loading toasts after 3.5 seconds
        if (isPending) {
            const timer = setTimeout(() => {
                this.collapseToast(id, true);
            }, 3500);
            this.collapseTimers.set(id, timer);
        } else if (autoClose && typeof autoClose === 'number') {
            const timer = setTimeout(() => {
                this.dismiss(id);
            }, autoClose);
            this.dismissTimers.set(id, timer);
        }

        this.notify();
        return id;
    }

    public success(content: ReactNode, options?: ToastOptions): string {
        return this.show(content, 'success', options);
    }

    public error(content: ReactNode, options?: ToastOptions): string {
        return this.show(content, 'error', options);
    }

    public warning(content: ReactNode, options?: ToastOptions): string {
        return this.show(content, 'warning', options);
    }

    public info(content: ReactNode, options?: ToastOptions): string {
        return this.show(content, 'info', options);
    }

    public loading(content: ReactNode, options?: ToastOptions): string {
        return this.show(content, 'loading', options);
    }

    public update(id: string, options: UpdateToastOptions) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast) return;

        this.clearTimers(id);

        const newType = options.type || (options.isLoading === false ? 'success' : toast.type);
        const isLoading = options.isLoading !== undefined ? options.isLoading : newType === 'loading';
        const content = options.render !== undefined ? options.render : toast.content;

        toast.type = newType;
        toast.content = content;
        toast.isLoading = isLoading;
        toast.isCollapsed = false; // Always re-expand on update so the user sees result!
        if (options.title !== undefined) toast.title = options.title;
        if (options.onClick !== undefined) toast.onClick = options.onClick;

        const autoClose = options.autoClose !== undefined
            ? options.autoClose
            : isLoading
                ? false
                : 2500;

        toast.autoClose = autoClose;

        if (isLoading) {
            const timer = setTimeout(() => {
                this.collapseToast(id, true);
            }, 3500);
            this.collapseTimers.set(id, timer);
        } else if (autoClose && typeof autoClose === 'number') {
            const timer = setTimeout(() => {
                this.dismiss(id);
            }, autoClose);
            this.dismissTimers.set(id, timer);
        }

        this.notify();
    }

    public collapseToast(id: string, isCollapsed?: boolean) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast || !toast.isLoading) return;

        toast.isCollapsed = isCollapsed !== undefined ? isCollapsed : !toast.isCollapsed;
        this.notify();
    }

    public toggleCollapse(id: string) {
        const toast = this.toasts.find((t) => t.id === id);
        if (!toast) return;
        toast.isCollapsed = !toast.isCollapsed;
        this.notify();
    }

    public dismiss(id?: string) {
        if (!id) {
            this.toasts.forEach((t) => this.clearTimers(t.id));
            this.toasts = [];
        } else {
            this.clearTimers(id);
            this.toasts = this.toasts.filter((t) => t.id !== id);
        }
        this.notify();
    }
}

export const toastManager = new ToastManager();

export const toast = {
    success: (content: ReactNode, options?: ToastOptions) => toastManager.success(content, options),
    error: (content: ReactNode, options?: ToastOptions) => toastManager.error(content, options),
    warning: (content: ReactNode, options?: ToastOptions) => toastManager.warning(content, options),
    info: (content: ReactNode, options?: ToastOptions) => toastManager.info(content, options),
    loading: (content: ReactNode, options?: ToastOptions) => toastManager.loading(content, options),
    update: (id: string, options: UpdateToastOptions) => toastManager.update(id, options),
    dismiss: (id?: string) => toastManager.dismiss(id),
    toggleCollapse: (id: string) => toastManager.toggleCollapse(id)
};

export default toast;
