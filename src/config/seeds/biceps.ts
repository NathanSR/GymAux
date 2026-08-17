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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Barra Reta)",
                "description": "O construtor clássico de massa para o bíceps.",
                "howTo": "1. Segure a barra com as palmas para cima na largura dos ombros.\n2. Mantenha os cotovelos fixos ao lado do corpo.\n3. Flexione os braços levando a barra até o peito e desça devagar.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Curl Straight Bar (Barbell)",
                "description": "The classic mass builder for the biceps.",
                "howTo": "1. Hold the bar with palms up at shoulder width.\n2. Keep your elbows tucked to your sides.\n3. Curl the bar toward your chest and lower it slowly.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Curl de Bíceps (Barra Recta)",
                "description": "El constructor de masa clásico para el bíceps.",
                "howTo": "1. Sujeta la barra con palmas hacia arriba al ancho de hombros.\n2. Mantén los codos pegados a los costados.\n3. Flexiona los brazos llevando la barra al pecho y baja despacio.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Barra",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Barra EZ)",
                "description": "Variação que reduz o estresse nos punhos.",
                "howTo": "1. Segure a barra EZ nas curvaturas externas.\n2. Mantenha uma leve flexão nos joelhos para estabilidade.\n3. Levante a barra focando na contração do bíceps e controle a descida.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Ez Bar Curl",
                "description": "Variation that reduces stress on the wrists.",
                "howTo": "1. Grip the EZ bar on the outer curves.\n2. Keep a slight bend in your knees for stability.\n3. Lift the bar focusing on biceps contraction and control the descent.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Curl de Bíceps (Barra EZ)",
                "description": "Variación que reduce el estrés en las muñecas.",
                "howTo": "1. Sujeta la barra EZ en las curvas externas.\n2. Mantén una leve flexión de rodillas para mayor estabilidad.\n3. Levanta la barra enfocándote en la contracción y controla el descenso.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Scott (Barra EZ)",
                "description": "Isolamento total que impede o uso de impulso (roubo).",
                "howTo": "1. Apoie os braços totalmente no banco Scott.\n2. Desça a barra até o alongamento máximo sem travar os cotovelos.\n3. Puxe a barra de volta com força, mantendo o peito no banco.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Preacher Curl (Barbell)",
                "description": "Total isolation that prevents the use of momentum.",
                "howTo": "1. Rest your arms fully on the preacher bench.\n2. Lower the bar to full extension without locking your elbows.\n3. Pull the bar back up forcefully, keeping your chest against the pad.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Preacher Curl (Barra)",
                "description": "Aislamiento total que impide el uso de impulso.",
                "howTo": "1. Apoya los brazos totalmente en el banco Scott.\n2. Baja la barra hasta estirar casi por completo sin bloquear codos.\n3. Tira de la barra hacia arriba con fuerza manteniendo el pecho apoyado.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Barra",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Barra)",
                "description": "Foca na cabeça longa do bíceps, aumentando o pico do braço.",
                "howTo": "1. Mantenha a barra colada ao corpo durante todo o tempo.\n2. Ao subir, leve os cotovelos para trás.\n3. A barra deve 'arrastar' pelo seu abdômen até a linha do peito.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Drag Curl (Barbell)",
                "description": "Focuses on the long head of the biceps, increasing the arm's peak.",
                "howTo": "1. Keep the bar tucked against your body at all times.\n2. As you lift, drive your elbows back.\n3. The bar should 'drag' up your abdomen to the chest line.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Drag Curl (Barra)",
                "description": "Enfocado en la cabeza larga, aumentando el pico del bíceps.",
                "howTo": "1. Mantén la barra pegada al cuerpo en todo momento.\n2. Al subir, lleva los codos hacia atrás.\n3. La barra debe 'arrastrar' por tu abdomen hasta la línea del pecho.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Barra",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Aranha (Barra)",
                "description": "Excelente para o pico de contração na parte frontal.",
                "howTo": "1. Deite de bruços em um banco inclinado a 45 graus.\n2. Deixe os braços pendurados verticalmente.\n3. Flexione os braços mantendo os cotovelos imóveis apontados para o chão.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Spider Curl (Barbell)",
                "description": "Excellent for peak contraction in the front part of the biceps.",
                "howTo": "1. Lie face down on a bench inclined at 45 degrees.\n2. Let your arms hang vertically.\n3. Curl the bar while keeping your elbows stationary and pointing to the floor.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Spider Curl (Barra)",
                "description": "Excelente para el pico de contracción frontal.",
                "howTo": "1. Túmbate boca abajo en un banco inclinado a 45 grados.\n2. Deja que los brazos cuelguen verticalmente.\n3. Flexiona los brazos manteniendo los codos inmóviles apuntando al suelo.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Barra",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Alternada (Halteres)",
                "description": "Trabalha cada braço individualmente para corrigir assimetrias.",
                "howTo": "1. Segure os halteres ao lado do corpo, palmas voltadas para as coxas.\n2. Gire o punho para cima conforme levanta o peso (supinação).\n3. Alterne os braços de forma controlada.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Alternate Curl (Dumbbell)",
                "description": "Works each arm individually to correct imbalances.",
                "howTo": "1. Hold dumbbells at your sides, palms facing your thighs.\n2. Rotate your wrist upward as you lift the weight (supination).\n3. Alternate arms in a controlled manner.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Curl Alterno (Mancuernas)",
                "description": "Trabaja cada brazo individualmente para corregir asimetrías.",
                "howTo": "1. Sujeta las mancuernas a los lados, palmas hacia los muslos.\n2. Gira la muñeca hacia arriba mientras levantas el peso (supinación).\n3. Alterna los brazos de forma controlada.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Martelo (Halteres)",
                "description": "Trabalha o braquial, dando espessura lateral ao braço.",
                "howTo": "1. Segure os halteres com a pegada neutra (palmas viradas uma para a outra).\n2. Levante o peso mantendo essa posição de 'martelo'.\n3. Não gire os punhos durante o movimento.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Hammer Curl (Dumbbell)",
                "description": "Targets the brachialis, providing lateral thickness to the arm.",
                "howTo": "1. Hold dumbbells with a neutral grip (palms facing each other).\n2. Lift the weight while maintaining this 'hammer' position.\n3. Do not rotate your wrists during the movement.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Curl Martillo (Mancuernas)",
                "description": "Trabaja el braquial, dando grosor lateral al brazo.",
                "howTo": "1. Sujeta las mancuernas con agarre neutro (palmas enfrentadas).\n2. Levanta el peso manteniendo esta posición de 'martillo'.\n3. No gires las muñecas durante el movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Inclinada (Halteres)",
                "description": "Coloca o bíceps em alongamento máximo devido ao ângulo do banco.",
                "howTo": "1. Sente-se em um banco inclinado (45-60 graus).\n2. Deixe os braços caírem para trás da linha do tronco.\n3. Flexione os braços mantendo os ombros para trás e fixos.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Cabeça Longa",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Incline Curl (Dumbbell)",
                "description": "Places the biceps in maximum stretch due to the bench angle.",
                "howTo": "1. Sit on an inclined bench (45-60 degrees).\n2. Let your arms hang back behind your torso.\n3. Curl the weights while keeping your shoulders back and fixed.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Long Head",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Incline Curl (Mancuernas)",
                "description": "Estiramiento máximo del bíceps debido al ángulo del banco.",
                "howTo": "1. Siéntate en un banco inclinado (45-60 grados).\n2. Deja que los brazos caigan por detrás del tronco.\n3. Flexiona los brazos manteniendo los hombros atrás y fijos.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Cabeza Larga",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Concentrada (Halteres)",
                "description": "Isolamento máximo para detalhamento e pico do bíceps.",
                "howTo": "1. Sentado, apoie o cotovelo na parte interna da coxa.\n2. Estenda o braço totalmente e puxe em direção ao ombro.\n3. Evite usar o tronco para ajudar no movimento.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Concentration Curl (Dumbbell)",
                "description": "Maximum isolation for detailing and biceps peak.",
                "howTo": "1. Seated, rest your elbow on the inside of your thigh.\n2. Extend your arm fully and pull toward your shoulder.\n3. Avoid using your torso to help the movement.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Concentration Curl (Mancuernas)",
                "description": "Aislamiento máximo para detalle y pico del bíceps.",
                "howTo": "1. Sentado, apoya el codo en la parte interna del muslo.\n2. Estira el brazo totalmente y tira hacia el hombro.\n3. Evita usar el tronco para ayudar en el movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento",
                    "Unilateral"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Scott (Halteres)",
                "description": "Permite foco total em cada bíceps separadamente no banco Scott.",
                "howTo": "1. Apoie um braço no banco Scott segurando o halter.\n2. Desça lentamente e suba apertando o bíceps no topo.\n3. Use a mão livre para estabilizar o corpo.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Isolado",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Preacher Curl (Dumbbell)",
                "description": "Allows full focus on each biceps separately on the preacher bench.",
                "howTo": "1. Rest one arm on the preacher bench holding the dumbbell.\n2. Lower slowly and lift while squeezing the biceps at the top.\n3. Use your free hand to stabilize your body.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Isolation",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Preacher Curl (Mancuernas)",
                "description": "Enfoque total en cada bíceps por separado en banco Scott.",
                "howTo": "1. Apoya un brazo en el banco Scott sujetando la mancuerna.\n2. Baja lentamente y sube apretando el bíceps arriba.\n3. Usa la mano libre para estabilizar el cuerpo.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Aislamiento",
                    "Unilateral"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Zottman (Halteres)",
                "description": "Exercício avançado que trabalha bíceps e antebraço ao mesmo tempo.",
                "howTo": "1. Suba o peso com as palmas para cima (rosca normal).\n2. No topo, gire os punhos 180 graus (palmas para baixo).\n3. Desça o peso devagar com a pegada invertida.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Zotterman Curl (Dumbbell)",
                "description": "Advanced exercise that works both biceps and forearms.",
                "howTo": "1. Curl the weight up with palms facing up.\n2. At the top, rotate your wrists 180 degrees (palms down).\n3. Lower the weight slowly with the reverse grip.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Zotterman Curl (Mancuernas)",
                "description": "Ejercicio avanzado que trabaja bíceps y antebrazo a la vez.",
                "howTo": "1. Sube el peso con las palmas hacia arriba.\n2. Arriba, gira las muñecas 180 grados (palmas hacia abajo).\n3. Baja el peso despacio con el agarre invertido.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ]
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
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/biceps/cross_body_hammer_curl.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Martelo (Halteres)",
                "description": "Foca no braquial e braquiorradial com um ângulo diferente.",
                "howTo": "1. Com pegada neutra, puxe o halter em direção ao ombro oposto.\n2. O halter deve cruzar a frente do seu peito.\n3. Alterne os braços mantendo o controle.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Cross Body Hammer Curl (Dumbbell)",
                "description": "Focuses on the brachialis and brachioradialis with a different angle.",
                "howTo": "1. With a neutral grip, curl the dumbbell toward the opposite shoulder.\n2. The dumbbell should cross in front of your chest.\n3. Alternate arms while maintaining control.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Cross Body Hammer Curl (Mancuernas)",
                "description": "Enfocado en el braquial con un ángulo diferente.",
                "howTo": "1. Con agarre neutro, tira de la mancuerna hacia el hombro opuesto.\n2. La mancuerna debe cruzar frente a tu pecho.\n3. Alterna los brazos manteniendo el control.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Polia)",
                "description": "Tensão constante do início ao fim do movimento.",
                "howTo": "1. Use a barra reta na polia baixa.\n2. Mantenha os cotovelos colados às costelas.\n3. Controle o retorno do cabo para não deixar o peso bater.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Biceps Curl Straight Bar (Cable)",
                "description": "Constant tension from the start to the end of the movement.",
                "howTo": "1. Use a straight bar on the low pulley.\n2. Keep your elbows glued to your ribs.\n3. Control the cable's return to keep the weight from crashing.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Biceps Curl Straight Bar (Polea)",
                "description": "Tensión constante de principio a fin.",
                "howTo": "1. Usa la barra recta en polea baja.\n2. Mantén los codos pegados a las costillas.\n3. Controla el regreso del cable para evitar que el peso golpee.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Martelo (Polia Corda)",
                "description": "Tensão contínua para braquial usando a corda.",
                "howTo": "1. Segure a corda com pegada neutra.\n2. Ao subir, tente afastar as pontas da corda para maior contração.\n3. Mantenha a postura ereta.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Rope Hammer Curl (Cable)",
                "description": "Continuous tension for the brachialis using the rope.",
                "howTo": "1. Hold the rope with a neutral grip.\n2. At the top, try to pull the rope ends apart for more contraction.\n3. Maintain an upright posture.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Rope Hammer Curl (Polea)",
                "description": "Tensión continua para el braquial usando la cuerda.",
                "howTo": "1. Sujeta la cuerda con agarre neutro.\n2. Al subir, intenta separar las puntas de la cuerda.\n3. Mantén la postura erguida.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Duplo Bíceps (Polia Alta)",
                "description": "Simula a pose de 'duplo bíceps', focando no pico interno.",
                "howTo": "1. Posicione-se no meio do cross-over com as polias altas.\n2. Puxe os puxadores em direção às suas orelhas.\n3. Contraia o bíceps fortemente no final e retorne devagar.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado"
                ]
            },
            "en": {
                "name": "High Biceps Curl (Cable)",
                "description": "Simulates the 'double biceps' pose, focusing on the inner peak.",
                "howTo": "1. Stand in the middle of the crossover with high pulleys.\n2. Pull the handles toward your ears.\n3. Squeeze your biceps hard at the end and return slowly.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation"
                ]
            },
            "es": {
                "name": "High Biceps Curl (Polea)",
                "description": "Simula la pose de doble bíceps, enfocado en el pico interno.",
                "howTo": "1. Ponte en medio del crossover con poleas altas.\n2. Tira de los agarres hacia tus orejas.\n3. Aprieta el bíceps fuertemente al final y regresa despacio.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Polia)",
                "description": "Exercício no cabo que enfatiza o bíceps na posição alongada.",
                "howTo": "1. De costas para a polia, segure o puxador com o braço estendido para trás.\n2. Dê um passo à frente para criar tensão.\n3. Flexione o braço trazendo a mão para frente, mantendo o cotovelo atrás do corpo.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Bayesian Curl (Cable)",
                "description": "Cable exercise emphasizing the biceps in a stretched position.",
                "howTo": "1. Facing away from the pulley, hold the handle with your arm extended back.\n2. Step forward to create tension.\n3. Curl your arm bringing your hand forward, keeping the elbow behind the body.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Bayesian Curl (Polea)",
                "description": "Ejercicio en polea que enfatiza el bíceps estirado.",
                "howTo": "1. De espaldas a la polea, sujeta el agarre con el brazo estirado atrás.\n2. Da un paso adelante para crear tensión.\n3. Flexiona el brazo trayendo la mano adelante, codo fijo atrás.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Direta (Polia)",
                "description": "Isolamento unilateral com a fluidez dos cabos.",
                "howTo": "1. De frente para a polia baixa, segure o puxador de uma mão.\n2. Realize a rosca focando na conexão mente-músculo.\n3. Mantenha o ombro relaxado e o cotovelo fixo.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Pico de Contração",
                    "Tensão Constante",
                    "Isolado",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Single Arm Curl (Cable)",
                "description": "Unilateral isolation with the fluidity of cables.",
                "howTo": "1. Facing the low pulley, hold the single-hand handle.\n2. Perform the curl focusing on the mind-muscle connection.\n3. Keep your shoulder relaxed and elbow fixed.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Peak Contraction",
                    "Constant Tension",
                    "Isolation",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Single Arm Curl (Polea)",
                "description": "Aislamiento unilateral con la fluidez de los cables.",
                "howTo": "1. Frente a la polea baja, sujeta el agarre de una mano.\n2. Realiza el curl enfocándote en la conexión mente-músculo.\n3. Mantén el hombro relajado y el codo fijo.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Pico de Contracción",
                    "Tensión Constante",
                    "Aislamiento",
                    "Unilateral"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Scott (Máquina)",
                "description": "Ideal para iniciantes ou para levar o músculo à exaustão com segurança.",
                "howTo": "1. Ajuste o banco para que seus cotovelos alinhem com o eixo da máquina.\n2. Segure as manoplas e puxe de forma constante.\n3. Evite esticar o braço bruscamente no final.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Biceps Curl (Machine)",
                "description": "Ideal for beginners or to safely exhaust the muscle.",
                "howTo": "1. Adjust the seat so your elbows align with the machine's axis.\n2. Grip the handles and pull steadily.\n3. Avoid snapping your arms straight at the bottom.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Biceps Curl (Máquina)",
                "description": "Ideal para principiantes o para agotar el músculo con seguridad.",
                "howTo": "1. Ajusta el asiento para alinear los codos con el eje de la máquina.\n2. Sujeta las manijas y tira de forma constante.\n3. Evita estirar el brazo de golpe al bajar.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Máquina",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa Supinada (Foco em Bíceps)",
                "description": "Exercício composto de peso corporal com grande ativação de braço.",
                "howTo": "1. Pendure-se na barra com as palmas voltadas para você.\n2. Puxe o corpo para cima focando na força dos braços.\n3. Desça de forma lenta e controlada até estender os braços.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chin Up Biceps Focus",
                "description": "Bodyweight compound exercise with high arm activation.",
                "howTo": "1. Hang from the bar with palms facing you.\n2. Pull your body up focusing on arm strength.\n3. Lower slowly and controlled until arms are extended.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Dominadas Supinadas (Enfoque Bíceps)",
                "description": "Ejercicio compuesto con gran activación del brazo.",
                "howTo": "1. Cuélgate de la barra con las palmas hacia ti.\n2. Sube el cuerpo enfocándote en la fuerza de los brazos.\n3. Baja de forma lenta y controlada hasta estirar los brazos.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 512,
        "name": "reverse_barbell_curl",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/forearms/reverse_barbell_curl.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Inversa (Barra)",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Barra.",
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Reverse Curl (Barbell)",
                "description": "Technical execution for Reverse Barbell Curl.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Reverse Curl (Barra)",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Barra.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Barra",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Martelo Banco Inclinado (Halteres)",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Halteres.",
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Cabeça Longa",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Incline Hammer Curl (Dumbbell)",
                "description": "Technical execution for Incline Dumbbell Hammer Curl.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Long Head",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Incline Hammer Curl (Mancuernas)",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Mancuernas.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Cabeza Larga",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 530,
        "name": "reverse_curl_cable",
        "category": "biceps",
        "secondaryMuscles": [
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 130,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Inversa (Polia)",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Polia.",
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Braquial",
                    "Bíceps e Antebraço",
                    "Pegada",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Reverse Curl (Cable)",
                "description": "Technical execution for Reverse Cable Curl.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Brachialis",
                    "Biceps & Forearm",
                    "Grip",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Reverse Curl (Polea)",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Braquial",
                    "Bíceps y Antebrazo",
                    "Agarre",
                    "Aislamiento"
                ]
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
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Rosca Scott (Polia)",
                "description": "Isolamento focado no pico de contração e hipertrofia do bíceps com Polia.",
                "howTo": "1. Mantenha os cotovelos fixos e colados ao lado do tronco.\n2. Flexione os braços levando a carga em direção aos ombros.\n3. Contraia o bíceps no topo e desça lentamente resistindo ao peso.",
                "tags": [
                    "Bíceps",
                    "Braços",
                    "Banco Scott",
                    "Pico de Contração",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Preacher Curl (Cable)",
                "description": "Technical execution for Cable Preacher Curl.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Biceps",
                    "Arms",
                    "Preacher Bench",
                    "Peak Contraction",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Preacher Curl (Polea)",
                "description": "Aislamiento enfocado en el pico de contracción e hipertrofia del bíceps con Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Bíceps",
                    "Brazos",
                    "Banco Predicador",
                    "Pico de Contracción",
                    "Aislamiento"
                ]
            }
        }
    }
];
