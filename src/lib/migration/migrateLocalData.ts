import { db as dexie } from "../../config/db";
import { createClient } from "../supabase/client";

export async function migrateLocalData() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("No user found in Supabase Auth.");

  // Check if already migrated
  if (localStorage.getItem("gymaux_migrated") === "true") return;

  // 1. Migrate Profile
  const localUser = await dexie.users.toCollection().first();
  if (localUser) {
    await supabase.from("profiles").update({
      name: localUser.name,
      avatar: localUser.avatar,
      weight: localUser.weight,
      height: localUser.height,
      goal: localUser.goal,
    }).eq("id", user.id);
  }

  // 2. Migrate Exercises (Only those with id >= 1000)
  const userExercises = await dexie.exercises.where("id").aboveOrEqual(1000).toArray();
  if (userExercises.length > 0) {
    const exercisesForSupabase = userExercises.map((e) => ({
      id: e.id, // Explicitly preserve numeric ID
      name: e.name,
      description: e.description,
      category: e.category,
      tags: e.tags,
      how_to: e.howTo,
      media_url: e.mediaUrl,
      level: e.level,
      created_by: user.id,
      created_by_type: 'user',
      is_public: false
    }));
    await supabase.from("exercises").insert(exercisesForSupabase);
  }

  // 3. Migrate Workouts (and collect ID mapping)
  const localWorkouts = await dexie.workouts.toArray();
  const workoutIdMap = new Map<number, string>();

  if (localWorkouts.length > 0) {
    for (const w of localWorkouts) {
      const { data, error } = await supabase.from("workouts").insert({
        user_id: user.id,
        name: w.name,
        description: w.description,
        exercises: w.exercises, // JSON field (contains exercise IDs)
        created_at: new Date(w.createdAt).toISOString()
      }).select("id").single();

      if (data && w.id) {
        workoutIdMap.set(w.id, data.id);
      } else if (error) {
        console.error(`Error migrating workout ${w.name}:`, error);
      }
    }
  }

  // 4. Migrate Schedules (using mapped workout UUIDs)
  const localSchedules = await dexie.schedules.toArray();
  if (localSchedules.length > 0) {
    const schedulesForSupabase = localSchedules.map((s) => ({
      user_id: user.id,
      name: s.name,
      // Map Dexie workout IDs (number) to Supabase workout IDs (UUID)
      workouts: s.workouts.map(id => id ? (workoutIdMap.get(id) || null) : null),
      start_date: new Date(s.startDate).toISOString(),
      end_date: s.endDate ? new Date(s.endDate).toISOString() : null,
      active: s.active,
      last_completed: s.lastCompleted
    }));
    await supabase.from("schedules").insert(schedulesForSupabase);
  }

  // 5. Migrate History (using mapped workout UUIDs)
  const localHistories = await dexie.history.toArray();
  if (localHistories.length > 0) {
    const historyForSupabase = localHistories.map((h) => ({
      user_id: user.id,
      workout_id: workoutIdMap.get(h.workoutId) || null,
      workout_name: h.workoutName,
      date: new Date(h.date).toISOString(),
      executions: h.executions, // JSON field
      weight: h.weight,
      description: h.description,
      duration: h.duration,
      end_date: h.endDate ? new Date(h.endDate).toISOString() : null,
      using_creatine: h.usingCreatine
    }));
    await supabase.from("history").insert(historyForSupabase);
  }

  // 6. Migrate Sessions (using mapped workout UUIDs)
  const localSessions = await dexie.sessions.toArray();
  if (localSessions.length > 0) {
    const sessionsForSupabase = localSessions.map((s) => ({
      user_id: user.id,
      workout_id: workoutIdMap.get(s.workoutId) || null,
      workout_name: s.workoutName,
      created_at: new Date(s.createdAt).toISOString(),
      exercises_to_do: s.exercisesToDo, // JSON field
      exercises_done: s.exercisesDone, // JSON field
      current_step: s.current, // JSON field
      duration: s.duration,
      paused_at: s.pausedAt ? new Date(s.pausedAt).toISOString() : null,
      resumed_at: s.resumedAt ? new Date(s.resumedAt).toISOString() : null
    }));
    await supabase.from("sessions").insert(sessionsForSupabase);
  }

  // Mark as migrated
  localStorage.setItem("gymaux_migrated", "true");
}
