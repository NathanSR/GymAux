import { Exercise } from '../types';
import { CHEST_EXERCISES } from './chest';
import { BACK_EXERCISES } from './back';
import { SHOULDERS_EXERCISES } from './shoulders';
import { BICEPS_EXERCISES } from './biceps';
import { TRICEPS_EXERCISES } from './triceps';
import { FOREARM_EXERCISES } from './forearms';
import { QUADRICEPS_EXERCISES } from './quadriceps';
import { HAMSTRING_EXERCISES } from './hamstrings';
import { GLUTE_EXERCISES } from './glutes';
import { CALF_EXERCISES } from './calves';
import { ADDUCTOR_EXERCISES } from './adductors';
import { ABDUCTOR_EXERCISES } from './abductors';
import { CORE_EXERCISES } from './core';
import { CARDIO_EXERCISES } from './cardio';
import { STRETCHING_EXERCISES } from './stretching';
import { FULL_BODY_EXERCISES } from './fullBody';

export * from './chest';
export * from './back';
export * from './shoulders';
export * from './biceps';
export * from './triceps';
export * from './forearms';
export * from './quadriceps';
export * from './hamstrings';
export * from './glutes';
export * from './calves';
export * from './adductors';
export * from './abductors';
export * from './core';
export * from './cardio';
export * from './stretching';
export * from './fullBody';
export * from './categories';
export * from './equipments';

export const DEFAULT_EXERCISES: Exercise[] = [
    ...CHEST_EXERCISES,
    ...BACK_EXERCISES,
    ...SHOULDERS_EXERCISES,
    ...BICEPS_EXERCISES,
    ...TRICEPS_EXERCISES,
    ...FOREARM_EXERCISES,
    ...QUADRICEPS_EXERCISES,
    ...HAMSTRING_EXERCISES,
    ...GLUTE_EXERCISES,
    ...CALF_EXERCISES,
    ...ADDUCTOR_EXERCISES,
    ...ABDUCTOR_EXERCISES,
    ...CORE_EXERCISES,
    ...CARDIO_EXERCISES,
    ...STRETCHING_EXERCISES,
    ...FULL_BODY_EXERCISES
];

