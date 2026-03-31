"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { History } from '@/config/types';
import { HistoryService } from '@/services/historyService';

interface HistoryContextType {
    history: History[];
    loading: boolean;
    error: string | null;
    fetchHistory: (userId: string, page?: number, force?: boolean) => Promise<void>;
    seedHistory: (initialHistory: History[]) => void;
    getHistoryById: (id: string) => Promise<History | null>;
    addHistoryEntry: (entry: History) => void;
    updateHistoryState: (id: string, updates: Partial<History>) => void;
    removeHistoryEntry: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [history, setHistory] = useState<History[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadedPages, setLoadedPages] = useState<Set<number>>(new Set());

    const fetchHistory = useCallback(async (userId: string, page = 1, force = false) => {
        if (loadedPages.has(page) && !force) return;

        setLoading(true);
        setError(null);
        try {
            const result = await HistoryService.getUserHistory(userId, page);
            setHistory(prev => {
                const newHistory = [...prev];
                (result as History[]).forEach((item: History) => {
                    const idx = newHistory.findIndex(h => h.id === item.id);
                    if (idx >= 0) newHistory[idx] = item;
                    else newHistory.push(item);
                });
                return newHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
            });
            setLoadedPages(prev => new Set(prev).add(page));
        } catch (err: any) {
            setError(err.message || 'Failed to fetch history');
        } finally {
            setLoading(false);
        }
    }, [loadedPages]);

    const seedHistory = useCallback((initialHistory: History[]) => {
        setHistory((prev: History[]) => {
            const newHistory = [...prev];
            initialHistory.forEach(item => {
                if (!newHistory.find(existing => existing.id === item.id)) {
                    newHistory.push(item);
                }
            });
            return newHistory.sort((a, b) => b.date.getTime() - a.date.getTime());
        });
    }, []);

    const getHistoryById = useCallback(async (id: string): Promise<History | null> => {
        const existing = history.find(h => h.id === id);
        if (existing) return existing;

        try {
            const entry = await HistoryService.getHistoryById(id);
            if (entry) {
                setHistory((prev: History[]) => [...prev.filter(h => h.id !== id), entry].sort((a, b) => b.date.getTime() - a.date.getTime()));
            }
            return entry;
        } catch (err) {
            return null;
        }
    }, [history]);

    const addHistoryEntry = useCallback((entry: History) => {
        setHistory((prev: History[]) => [entry, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
    }, []);

    const updateHistoryState = useCallback((id: string, updates: Partial<History>) => {
        setHistory((prev: History[]) => prev.map(h => h.id === id ? { ...h, ...updates } : h));
    }, []);

    const removeHistoryEntry = useCallback((id: string) => {
        setHistory((prev: History[]) => prev.filter(h => h.id !== id));
    }, []);

    return (
        <HistoryContext.Provider value={{
            history,
            loading,
            error,
            fetchHistory,
            seedHistory,
            getHistoryById,
            addHistoryEntry,
            updateHistoryState,
            removeHistoryEntry
        }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => {
    const context = useContext(HistoryContext);
    if (!context) {
        throw new Error('useHistory must be used within a HistoryProvider');
    }
    return context;
};
