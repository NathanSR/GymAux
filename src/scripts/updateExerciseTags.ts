import fs from 'fs';
import path from 'path';
import { Exercise } from '../config/types';

const norm = (str: string) => str.toLowerCase().trim();

/**
 * Professional tag assignment logic for each exercise.
 * Returns an array of 3 to 7 concise, highly accurate translation keys.
 */
export function generateTagsForExercise(ex: Exercise): string[] {
    const tags = new Set<string>();
    const name = norm(ex.name);
    const cat = norm(ex.category);
    const equip = norm(ex.equipment || '');
    const mech = norm(ex.mechanics || '');
    const execMode = norm(ex.executionMode || '');
    const level = norm(ex.level || '');

    // 1. Primary Muscle & Category Tag
    switch (cat) {
        case 'chest':
            tags.add('chest');
            if (name.includes('incline')) {
                tags.add('upper_chest');
                tags.add('incline_bench');
            } else if (name.includes('decline')) {
                tags.add('lower_chest');
            } else if (name.includes('fly') || name.includes('crossover') || name.includes('pec_deck') || name.includes('pullover')) {
                tags.add('inner_chest');
                tags.add('maximum_stretch');
            } else if (name.includes('push_up') || name.includes('flexao')) {
                tags.add('push_up');
                tags.add('core_strength');
            } else {
                tags.add('middle_chest');
            }
            if (mech === 'compound' && !name.includes('push_up')) {
                tags.add('bench');
                tags.add('hypertrophy');
            }
            break;

        case 'back':
            tags.add('back');
            if (name.includes('pull_up') || name.includes('chin_up') || name.includes('pulldown') || name.includes('puxada')) {
                tags.add('latissimus');
                tags.add('vertical_pull');
                tags.add('width');
                if (equip === 'bodyweight' || name.includes('pull_up')) tags.add('pull_up_bar');
            } else if (name.includes('row') || name.includes('remada') || name.includes('t_bar')) {
                tags.add('latissimus');
                tags.add('horizontal_pull');
                tags.add('thickness');
            } else if (name.includes('shrug') || name.includes('encolhimento')) {
                tags.add('traps');
                tags.add('heavy_load');
            } else if (name.includes('hyperextension') || name.includes('good_morning') || name.includes('lumbar') || name.includes('extension')) {
                tags.add('lower_back');
                tags.add('posture');
                tags.add('posterior_chain');
            } else if (name.includes('deadlift') || name.includes('terra')) {
                tags.add('posterior_chain');
                tags.add('heavy_load');
                tags.add('full_body');
            } else {
                tags.add('latissimus');
                tags.add('upper_back');
            }
            break;

        case 'shoulders':
            tags.add('shoulders');
            if (name.includes('press') || name.includes('arnold') || name.includes('military') || name.includes('desenvolvimento')) {
                tags.add('anterior_deltoid');
                tags.add('full_shoulder');
            } else if (name.includes('lateral') || name.includes('elevação_lateral')) {
                tags.add('medial_deltoid');
                tags.add('shaping');
            } else if (name.includes('rear') || name.includes('face_pull') || name.includes('reverse_fly') || name.includes('posterior')) {
                tags.add('posterior_deltoid');
                tags.add('rear_delts');
                tags.add('shoulder_health');
            } else if (name.includes('rotator') || name.includes('cuban') || name.includes('rotation')) {
                tags.add('rotator_cuff');
                tags.add('shoulder_health');
                tags.add('prehab');
            } else {
                tags.add('full_shoulder');
            }
            break;

        case 'biceps':
            tags.add('biceps');
            tags.add('arms');
            if (name.includes('scott') || name.includes('preacher')) {
                tags.add('preacher_bench');
                tags.add('peak_contraction');
            } else if (name.includes('incline')) {
                tags.add('long_head');
                tags.add('maximum_stretch');
            } else if (name.includes('hammer') || name.includes('martelo') || name.includes('reverse')) {
                tags.add('brachialis');
                tags.add('biceps_forearm');
                tags.add('grip');
            } else if (name.includes('concentration') || name.includes('spider') || name.includes('cable')) {
                tags.add('peak_contraction');
                tags.add('constant_tension');
            } else {
                tags.add('hypertrophy');
            }
            break;

        case 'triceps':
            tags.add('triceps');
            tags.add('arms');
            if (name.includes('skull') || name.includes('french') || name.includes('testa') || name.includes('overhead')) {
                tags.add('skull_crusher');
                tags.add('long_head');
                tags.add('maximum_stretch');
            } else if (name.includes('pushdown') || name.includes('pulley') || name.includes('corda') || name.includes('rope')) {
                tags.add('lateral_head');
                tags.add('constant_tension');
            } else if (name.includes('dip') || name.includes('paralelas') || name.includes('close_grip')) {
                tags.add('heavy');
                tags.add('strength');
            } else if (name.includes('kickback') || name.includes('coice')) {
                tags.add('kickback');
                tags.add('peak_contraction');
            } else {
                tags.add('lateral_head');
            }
            break;

        case 'forearms':
            tags.add('forearms');
            tags.add('arms');
            if (name.includes('flex') || name.includes('wrist_curl')) {
                tags.add('flexors');
                tags.add('wrists');
                tags.add('grip');
            } else if (name.includes('exten') || name.includes('reverse')) {
                tags.add('extensors');
                tags.add('wrists');
                tags.add('biceps_forearm');
            } else if (name.includes('farmer') || name.includes('pinch') || name.includes('hang')) {
                tags.add('grip');
                tags.add('grip_strength');
                tags.add('heavy_load');
            } else {
                tags.add('grip_strength');
                tags.add('wrists');
            }
            break;

        case 'quadriceps':
            tags.add('quads');
            tags.add('quad_dominant');
            tags.add('legs');
            if (name.includes('squat') || name.includes('agachamento')) {
                tags.add('heavy_load');
                tags.add('strength');
            } else if (name.includes('leg_press') || name.includes('hack') || name.includes('pendulum')) {
                tags.add('machine');
                tags.add('knee_friendly');
            } else if (name.includes('extension') || name.includes('extensora')) {
                tags.add('constant_tension');
                tags.add('definition');
            } else if (name.includes('lunge') || name.includes('split') || name.includes('afundo') || name.includes('passada') || name.includes('step')) {
                tags.add('unilateral');
                tags.add('balance');
            }
            break;

        case 'hamstrings':
            tags.add('hamstrings');
            tags.add('posterior_chain');
            tags.add('legs');
            if (name.includes('stiff') || name.includes('romanian') || name.includes('rdl') || name.includes('good_morning')) {
                tags.add('maximum_stretch');
                tags.add('glutes_hamstrings');
            } else if (name.includes('curl') || name.includes('flexora')) {
                tags.add('constant_tension');
                tags.add('knee_friendly');
            } else if (name.includes('nordic') || name.includes('glute_ham')) {
                tags.add('eccentric_strength');
                tags.add('joint_health');
            } else {
                tags.add('glutes_hamstrings');
            }
            break;

        case 'glutes':
            tags.add('glutes');
            tags.add('legs');
            if (name.includes('thrust') || name.includes('bridge') || name.includes('elevação_pélvica')) {
                tags.add('heavy_load');
                tags.add('maximum_peak');
                tags.add('posterior_chain');
            } else if (name.includes('kickback') || name.includes('coice') || name.includes('donkey')) {
                tags.add('upper_glute');
                tags.add('peak_contraction');
            } else if (name.includes('abduction') || name.includes('abdução') || name.includes('clamshell') || name.includes('fire_hydrant')) {
                tags.add('glute_medius');
                tags.add('outer_glute');
            } else {
                tags.add('posterior_chain');
            }
            break;

        case 'calves':
            tags.add('calves');
            tags.add('legs');
            if (name.includes('seated') || name.includes('sentado')) {
                tags.add('soleus');
                tags.add('seated');
            } else if (name.includes('standing') || name.includes('em_pé') || name.includes('donkey') || name.includes('leg_press')) {
                tags.add('standing');
                tags.add('gastrocnemius');
            } else if (name.includes('tibialis') || name.includes('shin') || name.includes('anterior')) {
                tags.add('shin');
                tags.add('knee_friendly');
            } else {
                tags.add('definition');
            }
            break;

        case 'adductors':
            tags.add('adductors');
            tags.add('inner_thigh');
            tags.add('legs');
            tags.add('hips');
            break;

        case 'abductors':
            tags.add('glute_medius');
            tags.add('outer_glute');
            tags.add('legs');
            tags.add('hips');
            break;

        case 'core':
            tags.add('core');
            tags.add('abs');
            if (name.includes('plank') || name.includes('prancha') || name.includes('rollout') || name.includes('hollow')) {
                tags.add('anti_extension');
                tags.add('stability');
                tags.add('isometric');
            } else if (name.includes('twist') || name.includes('woodchopper') || name.includes('bicycle') || name.includes('oblique')) {
                tags.add('obliques');
                tags.add('rotation');
            } else if (name.includes('hanging') || name.includes('leg_raise') || name.includes('elevação_pernas') || name.includes('reverse')) {
                tags.add('lower_abs');
                tags.add('psoas');
            } else {
                tags.add('core_strength');
            }
            break;

        case 'cardio':
            tags.add('cardio');
            if (name.includes('run') || name.includes('corrida') || name.includes('treadmill')) {
                tags.add('running');
                tags.add('endurance');
                tags.add('stamina');
            } else if (name.includes('bike') || name.includes('cycling') || name.includes('bicicleta')) {
                tags.add('cycling');
                tags.add('low_impact');
                tags.add('stamina');
            } else if (name.includes('row') || name.includes('remo')) {
                tags.add('full_body');
                tags.add('stamina');
            } else {
                tags.add('hiit');
                tags.add('high_intensity');
                tags.add('metabolic');
            }
            break;

        case 'stretching':
            tags.add('stretch');
            tags.add('mobility');
            tags.add('flexibility');
            tags.add('relaxation');
            tags.add('warm_up');
            break;

        case 'full_body':
            tags.add('full_body');
            if (name.includes('clean') || name.includes('snatch') || name.includes('jerk') || name.includes('arranco') || name.includes('arremesso')) {
                tags.add('olympic');
                tags.add('explosive');
                tags.add('power');
            } else if (name.includes('thruster') || name.includes('wall_ball') || name.includes('swing')) {
                tags.add('functional');
                tags.add('high_intensity');
                tags.add('power');
            } else {
                tags.add('functional');
                tags.add('strength');
            }
            break;
    }

    // 2. Equipment Tag
    if (equip === 'barbell') tags.add('barbell');
    else if (equip === 'dumbbells') tags.add('dumbbells');
    else if (equip === 'cables') tags.add('cables');
    else if (equip === 'machine') tags.add('machine');
    else if (equip === 'smith_machine') tags.add('smith');
    else if (equip === 'bodyweight') { tags.add('bodyweight'); tags.add('home'); }
    else if (equip === 'ez_bar') tags.add('ez_bar');
    else if (equip === 'kettlebell') tags.add('kettlebell');
    else if (equip === 'resistance_band') tags.add('bands');
    else if (equip === 'plate') tags.add('plate');
    else if (equip === 'landmine') tags.add('landmine');

    // 3. Mechanics Tag
    if (mech === 'compound') tags.add('compound');
    else if (mech === 'isolation') tags.add('isolation');

    // 4. Execution Mode
    if (execMode === 'unilateral') tags.add('unilateral');

    return Array.from(tags);
}
