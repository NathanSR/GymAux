"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Exercise } from '@/config/types';
import { ExerciseService } from '@/services/exerciseService';

interface ExerciseContextType {
    exercises: Exercise[];
    loading: boolean;
    error: string | null;
    getExercises: (params: any, force?: boolean) => Promise<void>;
    seedExercises: (initialExercises: Exercise[]) => void;
    getExerciseById: (id: number) => Promise<Exercise | null>;
    addExercise: (exercise: Exercise) => void;
    updateExerciseState: (id: number, updates: Partial<Exercise>) => void;
    removeExercise: (id: number) => void;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

export const ExerciseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const getExercises = useCallback(async (params: any, force = false) => {
        if (hasLoaded && !force && !params.searchQuery && params.category === 'all') return;

        setLoading(true);
        setError(null);
        try {
            const result = await ExerciseService.getAllExercises(params);
            setExercises(prev => {
                const newExercises = [...prev];
                (result.exercises as Exercise[]).forEach((ex: Exercise) => {
                    const idx = newExercises.findIndex(e => e.id === ex.id);
                    if (idx >= 0) newExercises[idx] = ex;
                    else newExercises.push(ex);
                });
                return newExercises;
            });
            if (!params.searchQuery && params.category === 'all') {
                setHasLoaded(true);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch exercises');
        } finally {
            setLoading(false);
        }
    }, [hasLoaded]);

    const seedExercises = useCallback((initialExercises: Exercise[]) => {
        setExercises((prev: Exercise[]) => {
            const newExercises = [...prev];
            initialExercises.forEach(ex => {
                if (!newExercises.find(existing => existing.id === ex.id)) {
                    newExercises.push(ex);
                }
            });
            return newExercises;
        });
        setHasLoaded(true);
    }, []);

    const getExerciseById = useCallback(async (id: number): Promise<Exercise | null> => {
        const existing = exercises.find(ex => ex.id === id);
        if (existing) return existing;

        try {
            const exercise = await ExerciseService.getExerciseById(id);
            if (exercise) {
                setExercises((prev: Exercise[]) => [...prev.filter(ex => ex.id !== id), exercise]);
            }
            return exercise;
        } catch (err) {
            return null;
        }
    }, [exercises]);

    const addExercise = useCallback((exercise: Exercise) => {
        setExercises((prev: Exercise[]) => [exercise, ...prev]);
    }, []);

    const updateExerciseState = useCallback((id: number, updates: Partial<Exercise>) => {
        setExercises((prev: Exercise[]) => prev.map(ex => ex.id === id ? { ...ex, ...updates } : ex));
    }, []);

    const removeExercise = useCallback((id: number) => {
        setExercises((prev: Exercise[]) => prev.filter(ex => ex.id !== id));
    }, []);

    return (
        <ExerciseContext.Provider value={{
            exercises,
            loading,
            error,
            getExercises,
            seedExercises,
            getExerciseById,
            addExercise,
            updateExerciseState,
            removeExercise
        }}>
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercises = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercises must be used within an ExerciseProvider');
    }
    return context;
};
