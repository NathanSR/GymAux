"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Workout } from '@/config/types';
import { WorkoutService } from '@/services/workoutService';

interface WorkoutContextType {
    workouts: Workout[];
    loading: boolean;
    error: string | null;
    fetchWorkouts: (userId: string, force?: boolean) => Promise<void>;
    seedWorkouts: (initialWorkouts: Workout[]) => void;
    getWorkoutById: (id: string) => Promise<Workout | null>;
    addWorkout: (workout: Workout) => void;
    updateWorkoutState: (id: string, updates: Partial<Workout>) => void;
    removeWorkout: (id: string) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasLoaded, setHasLoaded] = useState(false);

    const fetchWorkouts = useCallback(async (userId: string, force = false) => {
        if (hasLoaded && !force) return;

        setLoading(true);
        setError(null);
        try {
            const result = await WorkoutService.getWorkoutsByUserId(userId, '', { page: 1, limit: 100 });
            // result is { workouts, totalCount } when pagination is provided
            const fetchedWorkouts = Array.isArray(result) ? result : result.workouts;
            setWorkouts(fetchedWorkouts);
            setHasLoaded(true);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch workouts');
        } finally {
            setLoading(false);
        }
    }, [hasLoaded]);

    const seedWorkouts = useCallback((initialWorkouts: Workout[]) => {
        setWorkouts((prev: Workout[]) => {
            const newWorkouts = [...prev];
            initialWorkouts.forEach(w => {
                if (!newWorkouts.find(existing => existing.id === w.id)) {
                    newWorkouts.push(w);
                }
            });
            return newWorkouts;
        });
        setHasLoaded(true);
    }, []);

    const getWorkoutById = useCallback(async (id: string): Promise<Workout | null> => {
        const existing = workouts.find(w => w.id === id);
        if (existing) return existing;

        try {
            const workout = await WorkoutService.getWorkoutById(id);
            if (workout) {
                setWorkouts((prev: Workout[]) => [...prev.filter(w => w.id !== id), workout]);
            }
            return workout;
        } catch (err) {
            return null;
        }
    }, [workouts]);

    const addWorkout = useCallback((workout: Workout) => {
        setWorkouts((prev: Workout[]) => [workout, ...prev]);
    }, []);

    const updateWorkoutState = useCallback((id: string, updates: Partial<Workout>) => {
        setWorkouts((prev: Workout[]) => prev.map(w => w.id === id ? { ...w, ...updates } : w));
    }, []);

    const removeWorkout = useCallback((id: string) => {
        setWorkouts((prev: Workout[]) => prev.filter(w => w.id !== id));
    }, []);

    return (
        <WorkoutContext.Provider value={{
            workouts,
            loading,
            error,
            fetchWorkouts,
            seedWorkouts,
            getWorkoutById,
            addWorkout,
            updateWorkoutState,
            removeWorkout
        }}>
            {children}
        </WorkoutContext.Provider>
    );
};

export const useWorkouts = () => {
    const context = useContext(WorkoutContext);
    if (!context) {
        throw new Error('useWorkouts must be used within a WorkoutProvider');
    }
    return context;
};
