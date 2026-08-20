import { Exercise } from '../types';

export const BICEPS_EXERCISES: Exercise[] = [
    {
        "id": 130,
        "name": "barbell_curl_straight_bar",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/barbell_curl_straight_bar.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Curl Straight Bar (Barbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Hold the bar with palms up at shoulder width.\n2. Keep your elbows tucked to your sides.\n3. Curl the bar toward your chest and lower it slowly.",
                "description": "The classic mass builder for the biceps."
            },
            "es": {
                "name": "Curl de Bíceps (Barra Recta)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta la barra con palmas hacia arriba al ancho de hombros.\n2. Mantén los codos pegados a los costados.\n3. Flexiona los brazos llevando la barra al pecho y baja despacio.",
                "description": "El constructor de masa clásico para el bíceps."
            },
            "pt": {
                "name": "Rosca Direta (Barra Reta)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Segure a barra com as palmas para cima na largura dos ombros.\n2. Mantenha os cotovelos fixos ao lado do corpo.\n3. Flexione os braços levando a barra até o peito e desça devagar.",
                "description": "O construtor clássico de massa para o bíceps."
            }
        }
    },
    {
        "id": 131,
        "name": "ez_bar_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/ez_bar_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Ez Bar Curl",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ],
                "howTo": "1. Grip the EZ bar on the outer curves.\n2. Keep a slight bend in your knees for stability.\n3. Lift the bar focusing on biceps contraction and control the descent.",
                "description": "Variation that reduces stress on the wrists."
            },
            "es": {
                "name": "Curl de Bíceps (Barra EZ)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta la barra EZ en las curvas externas.\n2. Mantén una leve flexión de rodillas para mayor estabilidad.\n3. Levanta la barra enfocándote en la contracción y controla el descenso.",
                "description": "Variación que reduce el estrés en las muñecas."
            },
            "pt": {
                "name": "Rosca Direta (Barra EZ)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ],
                "howTo": "1. Segure a barra EZ nas curvaturas externas.\n2. Mantenha uma leve flexão nos joelhos para estabilidade.\n3. Levante a barra focando na contração do bíceps e controle a descida.",
                "description": "Variação que reduz o estresse nos punhos."
            }
        }
    },
    {
        "id": 132,
        "name": "barbell_preacher_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/barbell_preacher_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Preacher Curl (Barbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Rest your arms fully on the preacher bench.\n2. Lower the bar to full extension without locking your elbows.\n3. Pull the bar back up forcefully, keeping your chest against the pad.",
                "description": "Total isolation that prevents the use of momentum."
            },
            "es": {
                "name": "Preacher Curl (Barra)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Apoya los brazos totalmente en el banco Scott.\n2. Baja la barra hasta estirar casi por completo sin bloquear codos.\n3. Tira de la barra hacia arriba con fuerza manteniendo el pecho apoyado.",
                "description": "Aislamiento total que impide el uso de impulso."
            },
            "pt": {
                "name": "Rosca Scott (Barra EZ)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Apoie os braços totalmente no banco Scott.\n2. Desça a barra até o alongamento máximo sem travar os cotovelos.\n3. Puxe a barra de volta com força, mantendo o peito no banco.",
                "description": "Isolamento total que impede o uso de impulso (roubo)."
            }
        }
    },
    {
        "id": 133,
        "name": "drag_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/drag_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Drag Curl (Barbell)",
                "tags": [
                    "Biceps",
                    "Long Head",
                    "Biceps Peak",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Keep the barbell in contact with or very close to your body.\n2. As you curl, drive your elbows backward rather than forward.\n3. Drag the bar up your torso to lower chest level.\n4. Lower under control along the same path.",
                "description": "Targets the long head of the biceps by driving elbows backward and dragging the barbell up the torso."
            },
            "es": {
                "name": "Curl Drag (Barra)",
                "tags": [
                    "Bíceps",
                    "Cabeza Larga",
                    "Pico del Bíceps",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Mantén la barra pegada al torso durante todo el movimiento.\n2. Al flexionar los brazos, lleva los codos hacia atrás.\n3. La barra debe deslizarse por el abdomen hasta el pecho.\n4. Baja de forma controlada manteniendo la barra cerca del cuerpo.",
                "description": "Enfocado en la cabeza larga del bíceps, llevando los codos hacia atrás para aumentar el pico del brazo."
            },
            "pt": {
                "name": "Rosca Drag (Barra)",
                "tags": [
                    "Bíceps",
                    "Cabeça Longa",
                    "Pico do Bíceps",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Mantenha a barra em contato ou bem rente ao corpo durante todo o movimento.\n2. Ao flexionar os braços, puxe os cotovelos para trás.\n3. A barra deve deslizar (arrastar) pelo abdômen até a linha do peito.\n4. Desça controlando o peso mantendo a barra rente ao corpo.",
                "description": "Variação que foca intensamente na cabeça longa do bíceps puxando os cotovelos para trás ao longo do tronco."
            }
        }
    },
    {
        "id": 134,
        "name": "spider_curl_barbell",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/spider_curl_barbell.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Spider Curl (Barbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Lie face down on a bench inclined at 45 degrees.\n2. Let your arms hang vertically.\n3. Curl the bar while keeping your elbows stationary and pointing to the floor.",
                "description": "Excellent for peak contraction in the front part of the biceps."
            },
            "es": {
                "name": "Spider Curl (Barra)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Túmbate boca abajo en un banco inclinado a 45 grados.\n2. Deja que los brazos cuelguen verticalmente.\n3. Flexiona los brazos manteniendo los codos inmóviles apuntando al suelo.",
                "description": "Excelente para el pico de contracción frontal."
            },
            "pt": {
                "name": "Rosca Aranha (Barra)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Deite de bruços em um banco inclinado a 45 graus.\n2. Deixe os braços pendurados verticalmente.\n3. Flexione os braços mantendo os cotovelos imóveis apontados para o chão.",
                "description": "Excelente para o pico de contração na parte frontal."
            }
        }
    },
    {
        "id": 135,
        "name": "dumbbell_alternate_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "alternating",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/dumbbell_alternate_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Alternate Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ],
                "howTo": "1. Hold dumbbells at your sides, palms facing your thighs.\n2. Rotate your wrist upward as you lift the weight (supination).\n3. Alternate arms in a controlled manner.",
                "description": "Works each arm individually to correct imbalances."
            },
            "es": {
                "name": "Curl Alterno (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta las mancuernas a los lados, palmas hacia los muslos.\n2. Gira la muñeca hacia arriba mientras levantas el peso (supinación).\n3. Alterna los brazos de forma controlada.",
                "description": "Trabaja cada brazo individualmente para corregir asimetrías."
            },
            "pt": {
                "name": "Rosca Alternada (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ],
                "howTo": "1. Segure os halteres ao lado do corpo, palmas voltadas para as coxas.\n2. Gire o punho para cima conforme levanta o peso (supinação).\n3. Alterne os braços de forma controlada.",
                "description": "Trabalha cada braço individualmente para corrigir assimetrias."
            }
        }
    },
    {
        "id": 136,
        "name": "dumbbell_hammer_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 135,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/dumbbell_hammer_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Hammer Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ],
                "howTo": "1. Hold dumbbells with a neutral grip (palms facing each other).\n2. Lift the weight while maintaining this 'hammer' position.\n3. Do not rotate your wrists during the movement.",
                "description": "Targets the brachialis, providing lateral thickness to the arm."
            },
            "es": {
                "name": "Curl Martillo (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta las mancuernas con agarre neutro (palmas enfrentadas).\n2. Levanta el peso manteniendo esta posición de 'martillo'.\n3. No gires las muñecas durante el movimiento.",
                "description": "Trabaja el braquial, dando grosor lateral al brazo."
            },
            "pt": {
                "name": "Rosca Martelo (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ],
                "howTo": "1. Segure os halteres com a pegada neutra (palmas viradas uma para a outra).\n2. Levante o peso mantendo essa posição de 'martelo'.\n3. Não gire os punhos durante o movimento.",
                "description": "Trabalha o braquial, dando espessura lateral ao braço."
            }
        }
    },
    {
        "id": 137,
        "name": "incline_dumbbell_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 135,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/incline_dumbbell_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Long Head",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Sit on an inclined bench (45-60 degrees).\n2. Let your arms hang back behind your torso.\n3. Curl the weights while keeping your shoulders back and fixed.",
                "description": "Places the biceps in maximum stretch due to the bench angle."
            },
            "es": {
                "name": "Incline Curl (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Cabeza Larga",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Siéntate en un banco inclinado (45-60 grados).\n2. Deja que los brazos caigan por detrás del tronco.\n3. Flexiona los brazos manteniendo los hombros atrás y fijos.",
                "description": "Estiramiento máximo del bíceps debido al ángulo del banco."
            },
            "pt": {
                "name": "Rosca Inclinada (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Cabeça Longa",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Sente-se em um banco inclinado (45-60 graus).\n2. Deixe os braços caírem para trás da linha do tronco.\n3. Flexione os braços mantendo os ombros para trás e fixos.",
                "description": "Coloca o bíceps em alongamento máximo devido ao ângulo do banco."
            }
        }
    },
    {
        "id": 138,
        "name": "concentration_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 135,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/concentration_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Concentration Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation",
                    "Unilateral"
                ],
                "howTo": "1. Seated, rest your elbow on the inside of your thigh.\n2. Extend your arm fully and pull toward your shoulder.\n3. Avoid using your torso to help the movement.",
                "description": "Maximum isolation for detailing and biceps peak."
            },
            "es": {
                "name": "Concentration Curl (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento",
                    "Unilateral"
                ],
                "howTo": "1. Sentado, apoya el codo en la parte interna del muslo.\n2. Estira el brazo totalmente y tira hacia el hombro.\n3. Evita usar el tronco para ayudar en el movimiento.",
                "description": "Aislamiento máximo para detalle y pico del bíceps."
            },
            "pt": {
                "name": "Rosca Concentrada (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado",
                    "Unilateral"
                ],
                "howTo": "1. Sentado, apoie o cotovelo na parte interna da coxa.\n2. Estenda o braço totalmente e puxe em direção ao ombro.\n3. Evite usar o tronco para ajudar no movimento.",
                "description": "Isolamento máximo para detalhamento e pico do bíceps."
            }
        }
    },
    {
        "id": 139,
        "name": "dumbbell_preacher_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 135,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/dumbbell_preacher_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Preacher Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Isolation",
                    "Unilateral"
                ],
                "howTo": "1. Rest one arm on the preacher bench holding the dumbbell.\n2. Lower slowly and lift while squeezing the biceps at the top.\n3. Use your free hand to stabilize your body.",
                "description": "Allows full focus on each biceps separately on the preacher bench."
            },
            "es": {
                "name": "Preacher Curl (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Aislamiento",
                    "Unilateral"
                ],
                "howTo": "1. Apoya un brazo en el banco Scott sujetando la mancuerna.\n2. Baja lentamente y sube apretando el bíceps arriba.\n3. Usa la mano libre para estabilizar el cuerpo.",
                "description": "Enfoque total en cada bíceps por separado en banco Scott."
            },
            "pt": {
                "name": "Rosca Scott (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Isolado",
                    "Unilateral"
                ],
                "howTo": "1. Apoie um braço no banco Scott segurando o halter.\n2. Desça lentamente e suba apertando o bíceps no topo.\n3. Use a mão livre para estabilizar o corpo.",
                "description": "Permite foco total em cada bíceps separadamente no banco Scott."
            }
        }
    },
    {
        "id": 140,
        "name": "zotterman_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/zotterman_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Zotterman Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ],
                "howTo": "1. Curl the weight up with palms facing up.\n2. At the top, rotate your wrists 180 degrees (palms down).\n3. Lower the weight slowly with the reverse grip.",
                "description": "Advanced exercise that works both biceps and forearms."
            },
            "es": {
                "name": "Zotterman Curl (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ],
                "howTo": "1. Sube el peso con las palmas hacia arriba.\n2. Arriba, gira las muñecas 180 grados (palmas hacia abajo).\n3. Baja el peso despacio con el agarre invertido.",
                "description": "Ejercicio avanzado que trabaja bíceps y antebrazo a la vez."
            },
            "pt": {
                "name": "Rosca Zottman (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ],
                "howTo": "1. Suba o peso com as palmas para cima (rosca normal).\n2. No topo, gire os punhos 180 graus (palmas para baixo).\n3. Desça o peso devagar com a pegada invertida.",
                "description": "Exercício avançado que trabalha bíceps e antebraço ao mesmo tempo."
            }
        }
    },
    {
        "id": 141,
        "name": "cross_body_hammer_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "alternating",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cross_body_hammer_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Cross Body Hammer Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Brachialis",
                    "Brachioradialis",
                    "Dumbbell",
                    "Alternating",
                    "Isolation"
                ],
                "howTo": "1. Hold dumbbells with a neutral grip at your sides.\n2. Curl one dumbbell across your body toward the opposite shoulder.\n3. Squeeze the brachialis at the top and lower with control.\n4. Alternate arms in a controlled rhythm.",
                "description": "Hammer curl variation curling across the torso toward the opposite shoulder, emphasizing the brachialis and brachioradialis."
            },
            "es": {
                "name": "Curl Martillo Cruzado (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Braquial",
                    "Braquiorradial",
                    "Mancuernas",
                    "Alterno",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta las mancuernas con agarre neutro a los lados.\n2. Flexiona un brazo cruzando la mancuerna hacia el hombro opuesto.\n3. Aprieta en la cima y desciende de forma controlada.\n4. Alterna de brazo manteniendo la postura estable.",
                "description": "Variación de curl martillo cruzando la mancuerna frente al pecho hacia el hombro opuesto, con gran énfasis en el braquial y antebrazo."
            },
            "pt": {
                "name": "Rosca Martelo Cruzada (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braquial",
                    "Braquiorradial",
                    "Halteres",
                    "Alternado",
                    "Isolado"
                ],
                "howTo": "1. Segure os halteres com pegada neutra (palmas voltadas para dentro).\n2. Flexione um braço cruzando o halter em direção ao ombro oposto.\n3. Contraia o braquial no topo e desça com controle.\n4. Alterne o movimento com o outro braço.",
                "description": "Variação de rosca martelo cruzando o halter na frente do peito, com grande ênfase no braquial, braquiorradial e espessura do braço."
            }
        }
    },
    {
        "id": 142,
        "name": "cable_biceps_curl_straight_bar",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cable_biceps_curl_straight_bar.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Biceps Curl Straight Bar (Cable)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation"
                ],
                "howTo": "1. Use a straight bar on the low pulley.\n2. Keep your elbows glued to your ribs.\n3. Control the cable's return to keep the weight from crashing.",
                "description": "Constant tension from the start to the end of the movement."
            },
            "es": {
                "name": "Biceps Curl Straight Bar (Polea)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento"
                ],
                "howTo": "1. Usa la barra recta en polea baja.\n2. Mantén los codos pegados a las costillas.\n3. Controla el regreso del cable para evitar que el peso golpee.",
                "description": "Tensión constante de principio a fin."
            },
            "pt": {
                "name": "Rosca Direta (Polia)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado"
                ],
                "howTo": "1. Use a barra reta na polia baixa.\n2. Mantenha os cotovelos colados às costelas.\n3. Controle o retorno do cabo para não deixar o peso bater.",
                "description": "Tensão constante do início ao fim do movimento."
            }
        }
    },
    {
        "id": 143,
        "name": "cable_rope_hammer_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cable_rope_hammer_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rope Hammer Curl (Cable)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ],
                "howTo": "1. Hold the rope with a neutral grip.\n2. At the top, try to pull the rope ends apart for more contraction.\n3. Maintain an upright posture.",
                "description": "Continuous tension for the brachialis using the rope."
            },
            "es": {
                "name": "Rope Hammer Curl (Polea)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta la cuerda con agarre neutro.\n2. Al subir, intenta separar las puntas de la cuerda.\n3. Mantén la postura erguida.",
                "description": "Tensión continua para el braquial usando la cuerda."
            },
            "pt": {
                "name": "Rosca Martelo (Polia Corda)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ],
                "howTo": "1. Segure a corda com pegada neutra.\n2. Ao subir, tente afastar as pontas da corda para maior contração.\n3. Mantenha a postura ereta.",
                "description": "Tensão contínua para braquial usando a corda."
            }
        }
    },
    {
        "id": 144,
        "name": "high_cable_biceps_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/high_cable_biceps_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "High Biceps Curl (Cable)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation"
                ],
                "howTo": "1. Stand in the middle of the crossover with high pulleys.\n2. Pull the handles toward your ears.\n3. Squeeze your biceps hard at the end and return slowly.",
                "description": "Simulates the 'double biceps' pose, focusing on the inner peak."
            },
            "es": {
                "name": "High Biceps Curl (Polea)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento"
                ],
                "howTo": "1. Ponte en medio del crossover con poleas altas.\n2. Tira de los agarres hacia tus orejas.\n3. Aprieta el bíceps fuertemente al final y regresa despacio.",
                "description": "Simula la pose de doble bíceps, enfocado en el pico interno."
            },
            "pt": {
                "name": "Rosca Duplo Bíceps (Polia Alta)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado"
                ],
                "howTo": "1. Posicione-se no meio do cross-over com as polias altas.\n2. Puxe os puxadores em direção às suas orelhas.\n3. Contraia o bíceps fortemente no final e retorne devagar.",
                "description": "Simula a pose de 'duplo bíceps', focando no pico interno."
            }
        }
    },
    {
        "id": 145,
        "name": "bayesian_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/bayesian_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bayesian Curl (Cable)",
                "tags": [
                    "Biceps",
                    "Maximum Stretch",
                    "Constant Tension",
                    "Cable",
                    "Isolation"
                ],
                "howTo": "1. Set the pulley low, face away from the machine, and grip the handle behind your torso.\n2. Step forward to generate preload tension.\n3. Curl your arm forward while keeping your elbow positioned behind your torso.\n4. Control the return to a deep stretch.",
                "description": "Facing away from the cable stack, this curl provides peak tension in the fully stretched position of the long head."
            },
            "es": {
                "name": "Curl Bayesian (Polea)",
                "tags": [
                    "Bíceps",
                    "Estiramiento Máximo",
                    "Tensión Constante",
                    "Polea",
                    "Aislamiento"
                ],
                "howTo": "1. De espaldas a la polea baja, sujeta el maneral con el brazo extendido detrás del torso.\n2. Da un paso al frente para generar tensión.\n3. Flexiona el codo trayendo la mano hacia adelante con el codo estable.\n4. Regresa lentamente sintiendo el estiramiento profundo del bíceps.",
                "description": "Ejercicio en polea realizado de espaldas a la máquina, enfatizando el bíceps en posición de estiramiento máximo con tensión continua."
            },
            "pt": {
                "name": "Rosca Bayesian (Polia)",
                "tags": [
                    "Bíceps",
                    "Alongamento Máximo",
                    "Tensão Constante",
                    "Polia",
                    "Isolado"
                ],
                "howTo": "1. De costas para a polia baixa, segure a manopla com o braço estendido para trás do corpo.\n2. Dê um passo à frente para criar tensão inicial no cabo.\n3. Flexione o cotovelo trazendo a mão para a frente sem mover o ombro excessivamente.\n4. Retorne controlando o peso sentindo o alongamento completo do bíceps.",
                "description": "Exercício na polia realizado de costas para a máquina, trabalhando o bíceps em posição de máximo alongamento com tensão contínua."
            }
        }
    },
    {
        "id": 146,
        "name": "cable_single_arm_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cable_single_arm_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Single Arm Biceps Curl (Cable)",
                "tags": [
                    "Biceps",
                    "Unilateral",
                    "Constant Tension",
                    "Cable",
                    "Isolation"
                ],
                "howTo": "1. Stand facing the low cable pulley holding a single D-handle.\n2. Keep your elbow pinned at your side and shoulder relaxed.\n3. Curl the handle upward focusing on peak biceps contraction.\n4. Lower slowly under control through the full range of motion.",
                "description": "Unilateral cable curl delivering continuous tension throughout the movement to balance arm strength and symmetry."
            },
            "es": {
                "name": "Curl Unilateral (Polea)",
                "tags": [
                    "Bíceps",
                    "Unilateral",
                    "Tensión Constante",
                    "Polea",
                    "Aislamiento"
                ],
                "howTo": "1. Colócate de frente a la polea baja sujetando el maneral individual con una mano.\n2. Mantén el codo pegado al torso y el hombro relajado.\n3. Flexiona el brazo contrayendo el bíceps al máximo.\n4. Desciende despacio controlando el regreso.",
                "description": "Curl de bíceps unilateral en polea baja con tensión continua para corregir asimetrías y mejorar la simetría muscular."
            },
            "pt": {
                "name": "Rosca Unilateral (Polia)",
                "tags": [
                    "Bíceps",
                    "Unilateral",
                    "Tensão Constante",
                    "Polia",
                    "Isolado"
                ],
                "howTo": "1. Posicione-se de frente para a polia baixa segurando o estribo com uma das mãos.\n2. Mantenha o cotovelo fixo ao lado do corpo e o ombro relaxado.\n3. Flexione o braço contraindo o bíceps até a flexão completa.\n4. Desça lentamente controlando o retorno antes de trocar de lado.",
                "description": "Rosca de bíceps unilateral na polia baixa com tensão constante e foco em corrigir assimetrias musculares."
            }
        }
    },
    {
        "id": 147,
        "name": "machine_biceps_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/machine_biceps_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Biceps Curl (Machine)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Adjust the seat so your elbows align with the machine's axis.\n2. Grip the handles and pull steadily.\n3. Avoid snapping your arms straight at the bottom.",
                "description": "Ideal for beginners or to safely exhaust the muscle."
            },
            "es": {
                "name": "Biceps Curl (Máquina)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Ajusta el asiento para alinear los codos con el eje de la máquina.\n2. Sujeta las manijas y tira de forma constante.\n3. Evita estirar el brazo de golpe al bajar.",
                "description": "Ideal para principiantes o para agotar el músculo con seguridad."
            },
            "pt": {
                "name": "Rosca Scott (Máquina)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Ajuste o banco para que seus cotovelos alinhem com o eixo da máquina.\n2. Segure as manoplas e puxe de forma constante.\n3. Evite esticar o braço bruscamente no final.",
                "description": "Ideal para iniciantes ou para levar o músculo à exaustão com segurança."
            }
        }
    },
    {
        "id": 148,
        "name": "chin_up_biceps_focus",
        "category": "biceps",
        "secondaryMuscles": [
            "back",
            "forearms",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/chin_up_biceps_focus.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chin Up Biceps Focus",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Hang from the bar with palms facing you.\n2. Pull your body up focusing on arm strength.\n3. Lower slowly and controlled until arms are extended.",
                "description": "Bodyweight compound exercise with high arm activation."
            },
            "es": {
                "name": "Dominadas Supinadas (Enfoque Bíceps)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Cuélgate de la barra con las palmas hacia ti.\n2. Sube el cuerpo enfocándote en la fuerza de los brazos.\n3. Baja de forma lenta y controlada hasta estirar los brazos.",
                "description": "Ejercicio compuesto con gran activación del brazo."
            },
            "pt": {
                "name": "Barra Fixa Supinada (Foco em Bíceps)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Pendure-se na barra com as palmas voltadas para você.\n2. Puxe o corpo para cima focando na força dos braços.\n3. Desça de forma lenta e controlada até estender os braços.",
                "description": "Exercício composto de peso corporal com grande ativação de braço."
            }
        }
    },
    {
        "id": 529,
        "name": "incline_dumbbell_hammer_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 136,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/incline_dumbbell_hammer_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Hammer Curl (Dumbbell)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Long Head",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Incline Dumbbell Hammer Curl."
            },
            "es": {
                "name": "Incline Hammer Curl (Mancuernas)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Cabeza Larga",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Mancuernas."
            },
            "pt": {
                "name": "Rosca Martelo Banco Inclinado (Halteres)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Cabeça Longa",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Halteres."
            }
        }
    },
    {
        "id": 531,
        "name": "cable_preacher_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 132,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cable_preacher_curl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Preacher Curl (Cable)",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Isolation"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Cable Preacher Curl."
            },
            "es": {
                "name": "Preacher Curl (Polea)",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Aislamiento"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Polea."
            },
            "pt": {
                "name": "Rosca Scott (Polia)",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Isolado"
                ],
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Polia."
            }
        }
    }
];
