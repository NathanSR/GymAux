import { RxJsonSchema } from 'rxdb';

// --- User Schema ---
export const userSchema: RxJsonSchema<any> = {
    title: 'user schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        name: { type: 'string' },
        email: { type: 'string' },
        avatar: { type: 'string' },
        weight: { type: 'number' },
        height: { type: 'number' },
        goal: { type: 'string' },
        role: { type: 'string' },
        createdAt: { type: 'string' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'name', 'role']
};

// --- Exercise Schema ---
export const exerciseSchema: RxJsonSchema<any> = {
    title: 'exercise schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        created_by: { type: 'string' },
        created_by_type: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
        category: { type: 'string' },
        tags: {
            type: 'array',
            items: { type: 'string' }
        },
        howTo: { type: 'string' },
        mediaUrl: { type: 'string' },
        level: { type: 'string' },
        isPublic: { type: 'boolean' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'name', 'category', 'created_by_type']
};

// --- Workout Schema ---
export const workoutSchema: RxJsonSchema<any> = {
    title: 'workout schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        userId: { type: 'string' },
        createdBy: { type: 'string' },
        createdByType: { type: 'string' },
        name: { type: 'string' },
        createdAt: { type: 'string' },
        exercises: { type: 'array' }, // JSON representing ExerciseGroup[]
        description: { type: 'string' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'userId', 'name']
};

// --- Schedule Schema ---
export const scheduleSchema: RxJsonSchema<any> = {
    title: 'schedule schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        name: { type: 'string' },
        userId: { type: 'string' },
        createdBy: { type: 'string' },
        createdByType: { type: 'string' },
        workouts: {
            type: 'array',
            items: { type: ['string', 'null'] }
        },
        startDate: { type: 'string' },
        endDate: { type: 'string' },
        active: { type: 'boolean' },
        lastCompleted: { type: 'number' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'name', 'userId', 'startDate', 'active']
};

// --- History Schema ---
export const historySchema: RxJsonSchema<any> = {
    title: 'history schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        userId: { type: 'string' },
        workoutId: { type: 'string' },
        workoutName: { type: 'string' },
        date: { type: 'string' },
        executions: { type: 'array' }, // JSON representing ExecutedGroup[]
        weight: { type: 'number' },
        description: { type: 'string' },
        duration: { type: 'number' },
        endDate: { type: 'string' },
        usingCreatine: { type: 'boolean' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'userId', 'workoutId', 'workoutName', 'date']
};

// --- Session Schema ---
export const sessionSchema: RxJsonSchema<any> = {
    title: 'session schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        userId: { type: 'string' },
        workoutId: { type: 'string' },
        workoutName: { type: 'string' },
        createdAt: { type: 'string' },
        exercisesToDo: { type: 'array' }, // JSON representing ExerciseGroup[]
        exercisesDone: { type: 'array' }, // JSON representing ExecutedGroup[]
        current: {
            type: 'object',
            properties: {
                step: { type: 'string' },
                groupIndex: { type: 'number' },
                exerciseIndex: { type: 'number' },
                setIndex: { type: 'number' },
                roundIndex: { type: 'number' }
            },
            required: ['step', 'groupIndex', 'exerciseIndex', 'setIndex', 'roundIndex']
        },
        duration: { type: 'number' },
        pausedAt: { type: ['string', 'null'] },
        resumedAt: { type: ['string', 'null'] },
        isFinishedLocally: { type: 'boolean' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'userId', 'workoutId', 'workoutName', 'createdAt', 'current', 'duration']
};

// --- Connection Schema ---
export const connectionSchema: RxJsonSchema<any> = {
    title: 'connection schema',
    version: 0,
    primaryKey: 'id',
    type: 'object',
    properties: {
        id: { type: 'string', maxLength: 128 },
        trainer_id: { type: 'string' },
        student_id: { type: 'string' },
        status: { type: 'string' },
        permissions: {
            type: 'object',
            properties: {
                manage_workouts: { type: 'boolean' },
                manage_schedules: { type: 'boolean' },
                view_history: { type: 'boolean' },
                view_sessions: { type: 'boolean' }
            },
            required: ['manage_workouts', 'manage_schedules', 'view_history', 'view_sessions']
        },
        created_at: { type: 'string' },
        updated_at: { type: 'string' }
    },
    required: ['id', 'trainer_id', 'student_id', 'status', 'permissions', 'created_at']
};
