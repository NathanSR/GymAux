'use client';

import { useEffect, useRef } from 'react';

export type OverlayType = 'modal' | 'drawer' | 'dialog' | 'popover';

interface OverlayItem {
    id: string;
    type: OverlayType;
    onClose: () => void;
    pushHistory?: boolean;
}

class Manager {
    private stack: OverlayItem[] = [];
    private ignoreNextPopState = false;
    private initialized = false;
    private pushedIds: string[] = [];

    public hasOpenOverlays(): boolean {
        return this.stack.length > 0;
    }

    public register(item: OverlayItem) {
        if (!this.initialized && typeof window !== 'undefined') {
            this.initListeners();
            this.initialized = true;
        }

        const existingIdx = this.stack.findIndex(o => o.id === item.id);
        if (existingIdx !== -1) {
            this.stack[existingIdx] = item;
            return;
        }

        this.stack.push(item);
        this.updateBodyLock();

        if (item.pushHistory && typeof window !== 'undefined') {
            const newState = { ...window.history.state, __overlayId: item.id };
            window.history.pushState(newState, '');
            this.pushedIds.push(item.id);
        }
    }

    public unregister(id: string, isPopState = false) {
        const index = this.stack.findIndex(o => o.id === id);
        if (index === -1) return;

        const item = this.stack[index];
        this.stack.splice(index, 1);
        this.updateBodyLock();

        if (item.pushHistory && typeof window !== 'undefined') {
            const pushedIdx = this.pushedIds.indexOf(id);
            if (pushedIdx !== -1) {
                this.pushedIds.splice(pushedIdx, 1);
            }

            // Se o overlay foi fechado pela UI (não pelo back button),
            // precisamos limpar a entrada correspondente no histórico.
            if (!isPopState && window.history.state && window.history.state.__overlayId === id) {
                this.ignoreNextPopState = true;
                window.history.back();
            }
        }
    }

    private updateBodyLock() {
        if (typeof document === 'undefined') return;
        
        const needsLock = this.stack.some(o => o.type !== 'popover');
        
        if (needsLock) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('overlay-open');
        } else {
            document.body.style.overflow = 'unset';
            document.body.classList.remove('overlay-open');
            document.body.classList.remove('modal-open');
            document.body.classList.remove('drawer-open');
        }
    }

    private initListeners() {
        if (typeof window === 'undefined') return;

        window.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (this.stack.length > 0) {
                    // Check if an input is focused, let it handle ESC first
                    const activeElement = document.activeElement as HTMLElement | null;
                    if (activeElement) {
                        const tagName = activeElement.tagName;
                        const isInput = tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT' || activeElement.isContentEditable;
                        if (isInput) {
                            activeElement.blur();
                            e.preventDefault();
                            return;
                        }
                    }

                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    
                    const topmost = this.stack[this.stack.length - 1];
                    topmost.onClose();
                }
            }
        }, true);

        window.addEventListener('popstate', (e: PopStateEvent) => {
            if (this.ignoreNextPopState) {
                this.ignoreNextPopState = false;
                return;
            }
            
            const historyItems = this.stack.filter(o => o.pushHistory);
            if (historyItems.length > 0) {
                const topmost = historyItems[historyItems.length - 1];
                
                if (!e.state || e.state.__overlayId !== topmost.id) {
                    this.unregister(topmost.id, true);
                    topmost.onClose();
                }
            }
        });
    }
}

export const OverlayStackManager = new Manager();

export function useOverlayStack(options: {
    id: string;
    isOpen: boolean;
    onClose: () => void;
    type: OverlayType;
    pushHistory?: boolean;
}) {
    const { id, isOpen, onClose, type, pushHistory = false } = options;
    
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;

    useEffect(() => {
        if (isOpen) {
            OverlayStackManager.register({
                id,
                type,
                pushHistory,
                onClose: () => onCloseRef.current()
            });
        } else {
            OverlayStackManager.unregister(id, false);
        }

        return () => {
            OverlayStackManager.unregister(id, false);
        };
    }, [isOpen, id, type, pushHistory]);
}
