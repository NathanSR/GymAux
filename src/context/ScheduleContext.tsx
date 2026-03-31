"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Schedule } from '@/config/types';
import { ScheduleService } from '@/services/scheduleService';

interface ScheduleContextType {
    schedules: Schedule[];
    loading: boolean;
    error: string | null;
    fetchSchedules: (userId: string, force?: boolean) => Promise<void>;
    seedSchedules: (initialSchedules: Schedule[]) => void;
    getScheduleById: (id: string) => Promise<Schedule | null>;
    addSchedule: (schedule: Schedule) => void;
    updateScheduleState: (id: string, updates: Partial<Schedule>) => void;
    removeSchedule: (id: string) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchSchedules = useCallback(async (userId: string, force = false) => {
        if (hasLoaded && !force) return;

        setLoading(true);
        setError(null);
        try {
            const result = await ScheduleService.getSchedulesByUserId(userId, '', { page: 1, limit: 100 });
            setSchedules(result.schedules);
            setHasLoaded(true);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch schedules');
        } finally {
            setLoading(false);
        }
    }, [hasLoaded]);

    const seedSchedules = useCallback((initialSchedules: Schedule[]) => {
        setSchedules((prev: Schedule[]) => {
            const newSchedules = [...prev];
            initialSchedules.forEach(s => {
                if (!newSchedules.find(existing => existing.id === s.id)) {
                    newSchedules.push(s);
                }
            });
            return newSchedules;
        });
        setHasLoaded(true);
    }, []);

    const getScheduleById = useCallback(async (id: string): Promise<Schedule | null> => {
        const existing = schedules.find(s => s.id === id);
        if (existing) return existing;

        try {
            const schedule = await ScheduleService.getScheduleById(id);
            if (schedule) {
                setSchedules((prev: Schedule[]) => [...prev.filter(s => s.id !== id), schedule]);
            }
            return schedule;
        } catch (err) {
            return null;
        }
    }, [schedules]);

    const addSchedule = useCallback((schedule: Schedule) => {
        setSchedules((prev: Schedule[]) => [schedule, ...prev]);
    }, []);

    const updateScheduleState = useCallback((id: string, updates: Partial<Schedule>) => {
        setSchedules((prev: Schedule[]) => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    }, []);

    const removeSchedule = useCallback((id: string) => {
        setSchedules((prev: Schedule[]) => prev.filter(s => s.id !== id));
    }, []);

    return (
        <ScheduleContext.Provider value={{
            schedules,
            loading,
            error,
            fetchSchedules,
            seedSchedules,
            getScheduleById,
            addSchedule,
            updateScheduleState,
            removeSchedule
        }}>
            {children}
        </ScheduleContext.Provider>
    );
};

export const useSchedules = () => {
    const context = useContext(ScheduleContext);
    if (!context) {
        throw new Error('useSchedules must be used within a ScheduleProvider');
    }
    return context;
};
