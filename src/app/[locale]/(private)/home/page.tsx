import HomeClient from '@/components/home/HomeClient';
import { createClient } from '@/lib/supabase/server';
import { userService } from '@/services/userService';
import { ScheduleService } from '@/services/scheduleService';
import { WorkoutService } from '@/services/workoutService';
import { HistoryService } from '@/services/historyService';
import { SessionService } from '@/services/sessionService';
import { Workout, Schedule, History, Session } from '@/config/types';

export default async function HomePage() {
    const supabase = await createClient();
    
    // 1. Authenticated User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const activeUser = await userService.getUserById(user.id, supabase);
    if (!activeUser) return null;

    // 2. Initial Data Fetching
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endTodayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Fetch active schedule
    const activeSchedule = await ScheduleService.getActiveSchedule(activeUser.id, supabase);
    
    let todayWorkout: Workout | null = null;
    let todayHistory: History | null = null;

    if (activeSchedule?.workouts?.[dayOfWeek]) {
        todayWorkout = await WorkoutService.getWorkoutById(activeSchedule.workouts[dayOfWeek]!, supabase);
        
        if (todayWorkout?.id) {
            const history = await HistoryService.getHistoryByRange(activeUser.id, startTodayDate, endTodayDate, supabase);
            todayHistory = history.find(h => h.workoutId === todayWorkout?.id) || null;
        }
    }

    // Recent History
    const historyList = await HistoryService.getUserHistory(activeUser.id, 1, 4, supabase);

    // Open Sessions
    const sessionList = await SessionService.getSessionsByUserId(activeUser.id, supabase);

    return (
        <HomeClient 
            activeUser={activeUser}
            initialActiveSchedule={activeSchedule}
            initialTodayWorkout={todayWorkout}
            initialTodayHistory={todayHistory}
            initialHistoryList={historyList}
            initialSessionList={sessionList}
        />
    );
}