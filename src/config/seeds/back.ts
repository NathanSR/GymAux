import { Exercise } from '../types';

export const BACK_EXERCISES: Exercise[] = [
    {
        "id": 50,
        "name": "pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Grip the bar with palms facing away.\n2. Pull your body up until your chin clears the bar.\n3. Lower with control until arms are extended.",
                "description": "Key exercise for back width and functional strength."
            },
            "es": {
                "name": "Dominadas Pronadas",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta la barra con las palmas hacia afuera.\n2. Tira de tu cuerpo hacia arriba hasta pasar la barbilla.\n3. Baja controladamente hasta estirar los brazos.",
                "description": "Ejercicio fundamental para el ancho de la espalda y fuerza funcional."
            },
            "pt": {
                "name": "Barra Fixa (Pronada)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra com as palmas voltadas para fora.\n2. Puxe o corpo para cima até o queixo passar a barra.\n3. Desça controladamente até estender os braços.",
                "description": "Exercício fundamental para largura das costas e força funcional."
            }
        }
    },
    {
        "id": 51,
        "name": "chin_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/chin_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chin Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Grip the bar with palms facing you.\n2. Pull your body up, focusing on driving your elbows down.\n3. Keep your core tight throughout the move.",
                "description": "Focuses on latissimus dorsi with significant biceps recruitment."
            },
            "es": {
                "name": "Dominadas Supinadas",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta la barra con las palmas hacia ti.\n2. Tira del cuerpo enfocándote en llevar los codos hacia abajo.\n3. Mantén el core contraído durante el movimiento.",
                "description": "Enfoque en el dorsal ancho con gran reclutamiento de bíceps."
            },
            "pt": {
                "name": "Barra Fixa (Supinada)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra com as palmas voltadas para você.\n2. Puxe o corpo focando em levar os cotovelos para baixo.\n3. Mantenha o core contraído durante o movimento.",
                "description": "Foco no latíssimo do dorso e grande recrutamento de bíceps."
            }
        }
    },
    {
        "id": 52,
        "name": "neutral_grip_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/neutral_grip_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Neutral Grip Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Use parallel handles (palms facing each other).\n2. Pull your chest toward your hands.\n3. Avoid swinging your body.",
                "description": "Safer variation for shoulders, targets the mid-back area."
            },
            "es": {
                "name": "Dominadas Agarre Neutro",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Usa los agarres paralelos (palmas enfrentadas).\n2. Tira del pecho hacia las manos.\n3. Evita balancear el cuerpo.",
                "description": "Variación más segura para los hombros, enfoca la parte media."
            },
            "pt": {
                "name": "Barra Fixa (Pegada Neutra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Use as alças paralelas (palmas voltadas uma para a outra).\n2. Puxe o peito em direção às mãos.\n3. Evite balançar o corpo.",
                "description": "Variação mais segura para os ombros, foca na parte central das costas."
            }
        }
    },
    {
        "id": 53,
        "name": "inverted_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/inverted_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Inverted Row",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Lie under a low bar and grip it with a straight body.\n2. Pull your chest up to the bar.\n3. Keep your body rigid like a plank.",
                "description": "Great for beginners and posture, performed on bars or rings."
            },
            "es": {
                "name": "Remo Invertido",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate bajo una barra baja y sujétala con el cuerpo recto.\n2. Tira del pecho hacia la barra.\n3. Mantén el cuerpo rígido como una tabla.",
                "description": "Ideal para principiantes y postura, en barra o anillas."
            },
            "pt": {
                "name": "Remada Invertida",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Deite sob uma barra baixa e segure-a com o corpo reto.\n2. Puxe o peito até a barra.\n3. Mantenha o corpo rígido como uma prancha.",
                "description": "Ótimo para iniciantes e para postura, feito em barras ou argolas."
            }
        }
    },
    {
        "id": 54,
        "name": "superman_exercise",
        "category": "back",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/superman_exercise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Superman Exercise",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Isolation"
                ],
                "howTo": "1. Lie face down with arms and legs extended.\n2. Lift your chest and thighs off the floor simultaneously.\n3. Hold the contraction for 2 seconds and lower.",
                "description": "Isolation exercise to strengthen the lower back and erectors."
            },
            "es": {
                "name": "Superman Exercise",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Aislamiento"
                ],
                "howTo": "1. Túmbate boca abajo con brazos y piernas estirados.\n2. Levanta el pecho y los muslos del suelo a la vez.\n3. Mantén la contracción 2 segundos y baja.",
                "description": "Aislamiento para fortalecer la zona lumbar y erectores."
            },
            "pt": {
                "name": "Super-Homem (Lombar)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Isolado"
                ],
                "howTo": "1. Deite de bruços com braços e pernas estendidos.\n2. Levante o peito e as coxas do chão simultaneamente.\n3. Segure a contração por 2 segundos e desça.",
                "description": "Isolamento para fortalecer a lombar e eretores da espinha."
            }
        }
    },
    {
        "id": 55,
        "name": "barbell_bent_over_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/barbell_bent_over_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bent Over Row (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Lean your torso forward keeping a straight spine.\n2. Pull the bar toward your navel.\n3. Squeeze your shoulder blades at the top.",
                "description": "The best exercise for back density and thickness."
            },
            "es": {
                "name": "Remo Inclinado (Barra)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Inclina el torso adelante manteniendo la espalda recta.\n2. Tira de la barra hacia el ombligo.\n3. Aprieta las escápulas al final del movimiento.",
                "description": "El mejor ejercicio para densidad y grosor de espalda."
            },
            "pt": {
                "name": "Remada Curvada (Barra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente mantendo a coluna reta.\n2. Puxe a barra em direção ao umbigo.\n3. Aperte as escápulas no topo do movimento.",
                "description": "O melhor exercício para densidade e espessura das costas."
            }
        }
    },
    {
        "id": 56,
        "name": "pendlay_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/pendlay_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pendlay Row (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Torso parallel to the floor, bar on the ground.\n2. Pull the bar explosively to your chest.\n3. Return the bar to the floor for each rep.",
                "description": "Explosive row starting from the floor, focus on power."
            },
            "es": {
                "name": "Remo Pendlay (Barra)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Torso paralelo al suelo, barra en el suelo.\n2. Tira de la barra explosivamente hacia el pecho.\n3. Devuelve la barra al suelo en cada repetición.",
                "description": "Remada explosiva desde el suelo, enfoque en potencia."
            },
            "pt": {
                "name": "Remada Pendlay (Barra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Tronco paralelo ao chão, barra no solo.\n2. Puxe a barra explosivamente até o peito.\n3. Retorne a barra ao chão em cada repetição.",
                "description": "Remada explosiva que parte do chão, foco em potência."
            }
        }
    },
    {
        "id": 57,
        "name": "t_bar_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/t_bar_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "T Bar Row (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Position the bar between your legs.\n2. Hold the handle and keep your chest out.\n3. Pull the weight while squeezing your back.",
                "description": "Classic for hitting the mid-back and traps."
            },
            "es": {
                "name": "Remo en Barra T",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Coloca la barra entre las piernas.\n2. Sujeta el agarre y mantén el pecho erguido.\n3. Tira del peso apretando la espalda.",
                "description": "Clásico para trabajar el centro de la espalda y trapecios."
            },
            "pt": {
                "name": "Remada Cavalinho (Barra T)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Posicione a barra entre as pernas.\n2. Segure no puxador e mantenha o peito aberto.\n3. Puxe a carga contraindo bem as costas.",
                "description": "Clássico para atingir o meio das costas e trapézio."
            }
        }
    },
    {
        "id": 58,
        "name": "one_arm_dumbbell_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/one_arm_dumbbell_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "One Arm Row (Dumbbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Support one hand on the bench and the other on the dumbbell.\n2. Pull the dumbbell toward your hip (not chest).\n3. Feel the stretch on the way down.",
                "description": "Allows for greater stretch and correction of imbalances."
            },
            "es": {
                "name": "Remo Unilateral (Mancuerna)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Apoya una mano en el banco e la otra en la mancuerna.\n2. Tira de la mancuerna hacia la cadera (no al pecho).\n3. Siente el estiramiento al bajar.",
                "description": "Permite mayor estiramiento y corrige desequilibrios."
            },
            "pt": {
                "name": "Remada Unilateral / Serrote (Halteres)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Apoie uma mão no banco e a outra no halter.\n2. Puxe o halter em direção ao quadril (não ao peito).\n3. Sinta o alongamento na descida.",
                "description": "Permite maior alongamento e correção de desequilíbrios."
            }
        }
    },
    {
        "id": 59,
        "name": "seal_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/seal_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Seal Row (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Lie face down on an elevated bench.\n2. Pull the bar or dumbbells without lifting your chest.\n3. Focus entirely on back isolation.",
                "description": "Row performed lying on a high bench, eliminates leg drive."
            },
            "es": {
                "name": "Seal Row (Barra)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate boca abajo en un banco elevado.\n2. Tira de la barra o mancuernas sin despegar el pecho.\n3. Enfoque total en el aislamiento de la espalda.",
                "description": "Remada tumbado en banco alto, elimina el impulso de piernas."
            },
            "pt": {
                "name": "Remada Seal (Banco)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Deite de bruços em um banco elevado.\n2. Puxe a barra ou halteres sem tirar o peito do banco.\n3. Foco total no isolamento das costas.",
                "description": "Remada deitada em banco alto, elimina o roubo com as pernas."
            }
        }
    },
    {
        "id": 60,
        "name": "renegade_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/renegade_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Renegade Row (Dumbbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Push-up position holding two dumbbells on the floor.\n2. Row one dumbbell at a time without rotating hips.\n3. Keep your core extremely tight.",
                "description": "Plank and row combination, focuses on core and stability."
            },
            "es": {
                "name": "Renegade Row (Mancuernas)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Posición de flexión sujetando dos mancuernas en el suelo.\n2. Rema una mancuerna a la vez sin girar la cadera.\n3. Mantén el core muy firme.",
                "description": "Combinación de plancha y remada, enfoque en core y estabilidad."
            },
            "pt": {
                "name": "Remada Renegade (Halteres)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Posição de flexão segurando dois halteres no chão.\n2. Reme um halter de cada vez sem girar o quadril.\n3. Mantenha o core extremamente firme.",
                "description": "Combinação de prancha e remada, foco em core e estabilidade."
            }
        }
    },
    {
        "id": 61,
        "name": "lat_pulldown_wide_grip",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lat_pulldown_wide_grip.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lat Pulldown Wide Grip (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Grip the bar wider than shoulder width.\n2. Pull the bar to your upper chest.\n3. Avoid leaning too far back.",
                "description": "Primary exercise for creating back width (V-taper)."
            },
            "es": {
                "name": "Jalón al Pecho (Agarre Ancho)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta la barra más allá del ancho de hombros.\n2. Tira de la barra hacia la parte superior del pecho.\n3. Evita inclinar el torso demasiado hacia atrás.",
                "description": "Ejercicio principal para crear amplitud (espalda en V)."
            },
            "pt": {
                "name": "Puxada Alta (Barra Larga)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Segure a barra além da largura dos ombros.\n2. Puxe a barra até a parte superior do peito.\n3. Evite inclinar o tronco excessivamente para trás.",
                "description": "Exercício principal para criar largura (o 'V' nas costas)."
            }
        }
    },
    {
        "id": 62,
        "name": "lat_pulldown_close_grip",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lat_pulldown_close_grip.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lat Pulldown Close Grip (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Use V-taper handle or close supinated grip.\n2. Pull toward your chest focusing on your elbows.\n3. Fully extend your arms on the way up.",
                "description": "Focuses on lower lats and mid-back."
            },
            "es": {
                "name": "Jalón al Pecho (Agarre Cerrado)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ],
                "howTo": "1. Usa el triángulo o agarre supinado cerrado.\n2. Tira hacia el pecho enfocándote en los codos.\n3. Estira los brazos totalmente al subir.",
                "description": "Enfocado en el dorsal inferior y zona media."
            },
            "pt": {
                "name": "Puxada Alta (Pegada Fechada)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Use o triângulo ou pegada supinada fechada.\n2. Puxe em direção ao peito focando nos cotovelos.\n3. Alongue totalmente os braços na subida.",
                "description": "Foca na parte inferior do latíssimo e meio das costas."
            }
        }
    },
    {
        "id": 63,
        "name": "lat_pulldown_behind_neck",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lat_pulldown_behind_neck.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lat Pulldown Behind Neck (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Pull the bar to the base of your neck.\n2. Keep your spine vertical.\n3. Requires good shoulder mobility.",
                "description": "Advanced variation to isolate the upper back."
            },
            "es": {
                "name": "Lat Pulldown Behind Neck (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ],
                "howTo": "1. Tira de la barra hasta la base de la nuca.\n2. Mantén la columna vertical.\n3. Requiere buena movilidad de hombros.",
                "description": "Variación avanzada para aislar la parte superior."
            },
            "pt": {
                "name": "Puxada Alta (Atrás da Nuca)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Puxe a barra até a base da nuca.\n2. Mantenha a coluna vertical.\n3. Requer boa mobilidade de ombros.",
                "description": "Variação avançada para isolar a parte superior das costas."
            }
        }
    },
    {
        "id": 64,
        "name": "straight_arm_pulldown",
        "category": "back",
        "secondaryMuscles": [
            "triceps",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/straight_arm_pulldown.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Straight Arm Pulldown (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Isolation"
                ],
                "howTo": "1. Arms nearly straight holding the bar high.\n2. Push the bar down to your thighs.\n3. Control the return feeling the stretch.",
                "description": "Lat isolation without involving the biceps."
            },
            "es": {
                "name": "Straight Arm Pulldown (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Aislamiento"
                ],
                "howTo": "1. Brazos casi rectos sujetando la barra arriba.\n2. Empuja la barra hacia abajo hasta los muslos.\n3. Controla el regreso sintiendo el estiramiento.",
                "description": "Aislamiento del dorsal sin involucrar el bíceps."
            },
            "pt": {
                "name": "Pulldown Braço Estendido (Polia)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Isolado"
                ],
                "howTo": "1. Braços quase retos segurando a barra no alto.\n2. Empurre a barra para baixo até as coxas.\n3. Controle o retorno sentindo o alongamento.",
                "description": "Isolamento do latíssimo sem envolver o bíceps."
            }
        }
    },
    {
        "id": 65,
        "name": "single_arm_lat_pulldown",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/single_arm_lat_pulldown.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Single Arm Lat Pulldown (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Use a single-hand handle.\n2. Pull your elbow down and to the side of your body.\n3. Slightly rotate your torso for max contraction.",
                "description": "Improves mind-muscle connection and symmetry."
            },
            "es": {
                "name": "Single Arm Lat Pulldown (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Usa un agarre de una sola mano.\n2. Tira del codo hacia abajo y al costado del cuerpo.\n3. Gira levemente el torso para máxima contracción.",
                "description": "Mejora la conexión mente-músculo y la simetría."
            },
            "pt": {
                "name": "Puxada Alta Unilateral (Polia)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Use um puxador de mão única.\n2. Puxe o cotovelo para baixo e para o lado do corpo.\n3. Gire levemente o tronco para máxima contração.",
                "description": "Melhora a conexão mente-músculo e simetria."
            }
        }
    },
    {
        "id": 66,
        "name": "seated_cable_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/seated_cable_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Seated Row (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Feet supported and knees slightly bent.\n2. Pull the handle toward your abdomen.\n3. Chest out and squeeze your shoulder blades.",
                "description": "Works thickness and mid-back safely."
            },
            "es": {
                "name": "Remo Sentado (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Pies apoyados y rodillas algo flexionadas.\n2. Tira del agarre hacia el abdomen.\n3. Saca pecho y junta las escápulas.",
                "description": "Trabaja el grosor y centro de la espalda con seguridad."
            },
            "pt": {
                "name": "Remada Baixa (Polia)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Pés apoiados e joelhos levemente flexionados.\n2. Puxe o puxador em direção ao abdômen.\n3. Estufe o peito e junte as escápulas.",
                "description": "Trabalha a espessura e o meio das costas com segurança."
            }
        }
    },
    {
        "id": 67,
        "name": "one_arm_cable_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/one_arm_cable_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "One Arm Row (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Isolation",
                    "Unilateral"
                ],
                "howTo": "1. Standing or kneeling in front of the pulley.\n2. Pull the cable bringing your elbow behind your body.\n3. Alternate arms.",
                "description": "Allows for wrist rotation and greater range of motion."
            },
            "es": {
                "name": "One Arm Row (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Aislamiento",
                    "Unilateral"
                ],
                "howTo": "1. De pie o arrodillado frente a la polea.\n2. Tira del cable llevando el codo tras el cuerpo.\n3. Alterna los brazos.",
                "description": "Permite rotación de muñeca y mayor rango de movimiento."
            },
            "pt": {
                "name": "Remada Unilateral (Polia)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Isolado",
                    "Unilateral"
                ],
                "howTo": "1. Em pé ou ajoelhado em frente à polia.\n2. Puxe o cabo trazendo o cotovelo para trás do corpo.\n3. Alterne os braços.",
                "description": "Permite rotação do punho e maior arco de movimento."
            }
        }
    },
    {
        "id": 68,
        "name": "face_pull",
        "category": "back",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/face_pull.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Face Pull (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Compound"
                ],
                "howTo": "1. Use the rope on high pulley.\n2. Pull the rope toward your face, pulling hands apart.\n3. Focus on external shoulder rotation.",
                "description": "Essential for shoulder health and mid/lower traps."
            },
            "es": {
                "name": "Face Pull (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Compuesto"
                ],
                "howTo": "1. Usa la cuerda en polea alta.\n2. Tira de la cuerda hacia la cara, separando las manos.\n3. Enfócate en la rotación externa de hombros.",
                "description": "Esencial para salud de hombros y trapecio medio/inferior."
            },
            "pt": {
                "name": "Face Pull (Polia Corda)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Composto"
                ],
                "howTo": "1. Use a corda na polia alta.\n2. Puxe a corda em direção ao rosto, abrindo as mãos.\n3. Foque na rotação externa dos ombros.",
                "description": "Essencial para saúde dos ombros e trapézio médio/inferior."
            }
        }
    },
    {
        "id": 69,
        "name": "machine_chest_supported_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/machine_chest_supported_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chest Supported Row (Machine)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Adjust the seat to support your chest well.\n2. Grip the handles and pull hard.\n3. Control the return without letting the weight drop.",
                "description": "Eliminates lower back fatigue, focusing only on the back."
            },
            "es": {
                "name": "Chest Supported Row (Máquina)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Ajusta el asiento para apoyar bien el pecho.\n2. Sujeta las manijas y tira con fuerza.\n3. Controla el regreso sin soltar el peso.",
                "description": "Elimina fatiga lumbar, enfocado solo en la espalda."
            },
            "pt": {
                "name": "Remada Sentada (Máquina)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Ajuste o banco para apoiar bem o peito.\n2. Segure as manoplas e puxe com força.\n3. Controle o retorno sem soltar o peso.",
                "description": "Elimina a fadiga da lombar, focando apenas nas costas."
            }
        }
    },
    {
        "id": 71,
        "name": "rack_pull",
        "category": "back",
        "secondaryMuscles": [
            "hamstrings",
            "glutes",
            "core",
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/rack_pull.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rack Pull (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Bar positioned on racks (knee height).\n2. Perform the final lockout phase of a deadlift.\n3. Use heavier weights than conventional deadlift.",
                "description": "Focuses on the top part of the deadlift and traps."
            },
            "es": {
                "name": "Rack Pull (Barra)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Barra sobre los soportes (altura del joelho).\n2. Realiza la fase final de extensión del peso muerto.\n3. Usa cargas más pesadas que el convencional.",
                "description": "Enfocado en la parte final del peso muerto y trapecios."
            },
            "pt": {
                "name": "Meio Terra / Rack Pull (Barra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Barra posicionada sobre os suportes (altura do joelho).\n2. Execute a fase final da extensão do terra.\n3. Use cargas mais pesadas que o terra convencional.",
                "description": "Foca na parte superior do levantamento terra e trapézios."
            }
        }
    },
    {
        "id": 72,
        "name": "back_extension",
        "category": "back",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/back_extension.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Back Extension (Machine)",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Posture",
                    "Posterior Chain",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Support your hips on the pad.\n2. Lower your torso and rise until aligned with legs.\n3. Do not hyperextend too far back.",
                "description": "Safe strengthening for the lower back region."
            },
            "es": {
                "name": "Extensión Lumbar (Banco)",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Postura",
                    "Cadena Posterior",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Apoya la cadera en el soporte.\n2. Baja el torso y sube hasta alinearte con las piernas.\n3. No hiperextiendas demasiado hacia atrás.",
                "description": "Fortalecimiento seguro para la zona baja de la espalda."
            },
            "pt": {
                "name": "Extensão Lombar (Banco)",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Postura",
                    "Cadeia Posterior",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Apoie o quadril no suporte.\n2. Desça o tronco e suba até ficar alinhado às pernas.\n3. Não hiperextenda demais para trás.",
                "description": "Fortalecimento seguro para a região inferior das costas."
            }
        }
    },
    {
        "id": 74,
        "name": "barbell_shrug",
        "category": "back",
        "secondaryMuscles": [
            "shoulders",
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/barbell_shrug.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shrug (Barbell)",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Hold the bar in front of your body.\n2. Raise your shoulders toward your ears.\n3. Hold for 1 second at the top and lower.",
                "description": "Full focus on the upper trapezius portion."
            },
            "es": {
                "name": "Shrug (Barra)",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta la barra frente al cuerpo.\n2. Eleva los hombros hacia las orejas.\n3. Mantén 1 segundo arriba y baja.",
                "description": "Enfoque total en la porción superior del trapecio."
            },
            "pt": {
                "name": "Encolhimento (Barra)",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Segure a barra à frente do corpo.\n2. Eleve os ombros em direção às orelhas.\n3. Segure 1 segundo no topo e desça.",
                "description": "Foco total na porção superior do trapézio."
            }
        }
    },
    {
        "id": 75,
        "name": "dumbbell_shrug",
        "category": "back",
        "secondaryMuscles": [
            "shoulders",
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/dumbbell_shrug.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shrug (Dumbbell)",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Isolation"
                ],
                "howTo": "1. Dumbbells at your sides.\n2. Shrug your shoulders vertically.\n3. Keep your arms straight at all times.",
                "description": "More natural grip for traps, allows better focus."
            },
            "es": {
                "name": "Shrug (Mancuernas)",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Aislamiento"
                ],
                "howTo": "1. Mancuernas a los lados del cuerpo.\n2. Encoge los hombros verticalmente.\n3. Mantén los brazos estirados todo el tiempo.",
                "description": "Agarre más natural para trapecios, permite mayor enfoque."
            },
            "pt": {
                "name": "Encolhimento (Halteres)",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Isolado"
                ],
                "howTo": "1. Halteres ao lado do corpo.\n2. Encolha os ombros verticalmente.\n3. Mantenha os braços esticados o tempo todo.",
                "description": "Pegada mais natural para o trapézio, permite maior foco."
            }
        }
    },
    {
        "id": 76,
        "name": "cable_shrug",
        "category": "back",
        "secondaryMuscles": [
            "shoulders",
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/cable_shrug.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shrug (Cable)",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Compound"
                ],
                "howTo": "1. Use a straight bar on the low pulley.\n2. Shrug your shoulders against cable resistance.\n3. Do not roll shoulders, move only vertically.",
                "description": "Constant tension from the start of the movement."
            },
            "es": {
                "name": "Shrug (Polea)",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Compuesto"
                ],
                "howTo": "1. Usa barra recta en polea baja.\n2. Encoge los hombros contra la resistencia del cable.\n3. Evita girar los hombros, solo movimiento vertical.",
                "description": "Tensión constante desde el inicio del movimiento."
            },
            "pt": {
                "name": "Encolhimento (Polia)",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Composto"
                ],
                "howTo": "1. Use a barra reta na polia baixa.\n2. Encolha os ombros contra a resistência do cabo.\n3. Evite girar os ombros, faça apenas o movimento vertical.",
                "description": "Tensão constante desde o início do movimento."
            }
        }
    },
    {
        "id": 77,
        "name": "lever_lat_pulldown",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lever_lat_pulldown.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lever Lat Pulldown (Machine)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Pulldown",
                    "Machine",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Adjust the seat height and thigh pads so your legs are locked securely.\n2. Grip the lever handles firmly with an upright torso.\n3. Pull the handles down toward your upper chest, leading with your elbows.\n4. Pause for a brief squeeze at the bottom and control the return to full lat stretch.",
                "description": "Plate-loaded or pin-selected lever pulldown machine providing a natural convergent path for maximum lat activation and stability."
            },
            "es": {
                "name": "Jalón con Palanca (Máquina)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Jalón",
                    "Máquina",
                    "Amplitud",
                    "Compuesto"
                ],
                "howTo": "1. Ajusta la altura del asiento y el soporte de muslos para quedar bien firme.\n2. Sujeta las agarraderas con el torso erguido.\n3. Tira de las palancas hacia abajo en dirección al pecho, guiando el movimiento con los codos.\n4. Aprieta los dorsales en la parte baja y regresa controlando el peso hasta el estiramiento completo.",
                "description": "Ejercicio guiado por palancas convergentes que permite un trabajo aislado y potente para la amplitud del dorsal con máxima estabilidad."
            },
            "pt": {
                "name": "Puxada Alavanca (Máquina)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada",
                    "Máquina",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Ajuste a altura do assento e o apoio das coxas para manter o corpo firme.\n2. Segure as manoplas com pegada firme e coluna alinhada.\n3. Puxe as alavancas para baixo em direção ao peitoral, focando em puxar com os cotovelos.\n4. Segure a contração máxima por 1 segundo e retorne controlando o peso até o alongamento completo dos dorsais.",
                "description": "Exercício guiado por alavanca com trajetória convergente, excelente para desenvolvimento de largura do grande dorsal com alta estabilidade."
            }
        }
    },
    {
        "id": 78,
        "name": "articulated_row_machine",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/articulated_row_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Articulated Row (Machine)",
                "tags": [
                    "Back",
                    "Thickness",
                    "Rhomboids",
                    "Machine",
                    "Row",
                    "Compound"
                ],
                "howTo": "1. Adjust the seat so your chest rests comfortably against the support pad.\n2. Grasp the articulated handles with your desired grip.\n3. Pull the handles back by driving your elbows and retracting your shoulder blades.\n4. Hold the peak contraction briefly and slowly return under control.",
                "description": "Chest-supported machine row with independent articulated arms for optimal scapular retraction and mid-back thickness."
            },
            "es": {
                "name": "Remo Articulado (Máquina)",
                "tags": [
                    "Espalda",
                    "Densidad",
                    "Romboides",
                    "Máquina",
                    "Remo",
                    "Compuesto"
                ],
                "howTo": "1. Apoya el pecho firmemente en la almohadilla y gradúa el asiento.\n2. Agarra los manerales articulados con fuerza.\n3. Tira de los manerales hacia atrás retrayendo las escápulas y manteniendo los codos pegados al cuerpo.\n4. Regresa de manera lenta y controlada sintiendo el estiramiento dorsal.",
                "description": "Remo en máquina con brazos articulados independientes y soporte para el pecho, enfocado en el grosor de la espalda media."
            },
            "pt": {
                "name": "Remada Articulada (Máquina)",
                "tags": [
                    "Costas",
                    "Densidade",
                    "Romboides",
                    "Máquina",
                    "Remada",
                    "Composto"
                ],
                "howTo": "1. Apoie o peito firmemente na almofada frontal e ajuste a altura do banco.\n2. Segure as manoplas articuladas com pegada neutra ou pronada.\n3. Puxe as manoplas para trás aproximando as escápulas e levando os cotovelos rente ao corpo.\n4. Retorne controladamente mantendo o peito apoiado sem usar impulso.",
                "description": "Remada em máquina com braços articulados independentes, proporcionando arco de movimento anatômico e foco na densidade das costas."
            }
        }
    },
    {
        "id": 79,
        "name": "incline_row_machine",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/incline_row_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Row (Machine)",
                "tags": [
                    "Back",
                    "Upper Back",
                    "Traps",
                    "Machine",
                    "Row",
                    "Compound"
                ],
                "howTo": "1. Position yourself with your torso supported against the incline chest pad.\n2. Grab the handles firmly with neutral or pronated grip.\n3. Pull the handles back focusing on driving your elbows up and back.\n4. Squeeze your shoulder blades tightly at the top and lower with control.",
                "description": "Incline angle machine row emphasizing the upper and mid-back musculature, rhomboids, and lower/mid trapezius."
            },
            "es": {
                "name": "Remo Inclinado (Máquina)",
                "tags": [
                    "Espalda",
                    "Espalda Superior",
                    "Trapecios",
                    "Máquina",
                    "Remo",
                    "Compuesto"
                ],
                "howTo": "1. Colócate en la máquina apoyando el torso en el respaldo inclinado.\n2. Sujeta las manijas firmemente manteniendo la columna neutra.\n3. Tira hacia tu cuerpo llevando los codos hacia atrás y arriba.\n4. Aprieta las escápulas arriba y desciende el peso de forma controlada.",
                "description": "Variación de remo en máquina con apoyo inclinado, excelente para trabajar la parte alta y media de la espalda."
            },
            "pt": {
                "name": "Remada Inclinada (Máquina)",
                "tags": [
                    "Costas",
                    "Costas Superior",
                    "Trapézio",
                    "Máquina",
                    "Remada",
                    "Composto"
                ],
                "howTo": "1. Posicione-se na máquina com o tronco inclinado apoiado no suporte.\n2. Segure as empunhaduras com firmeza mantendo a coluna alinhada.\n3. Puxe em direção ao abdômen/peito abrindo os cotovelos no ângulo guiado.\n4. Aperte as escápulas no topo do movimento e retorne controlando a descida.",
                "description": "Variação de remada em banco inclinado guiado por máquina, com ênfase na porção superior e média das costas (romboides e trapézio)."
            }
        }
    },
    {
        "id": 408,
        "name": "back_extension_machine",
        "category": "back",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/back_extension_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Back Extension (Machine)",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Erector Spinae",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Sit or position yourself in the machine's support.\n2. Push the pad backward by extending your spine.\n3. Return to the starting position while maintaining weight control.",
                "description": "Safe and isolated strengthening of the paraspinal muscles."
            },
            "es": {
                "name": "Extensión Lumbar (Máquina)",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Erectores Espinales",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Siéntate o colócate en el soporte de la máquina.\n2. Empuja el soporte hacia atrás extendiendo la columna.\n3. Regresa al inicio manteniendo el control del peso.",
                "description": "Fortalecimiento seguro y aislado de la musculatura paravertebral."
            },
            "pt": {
                "name": "Extensão Lombar (Máquina)",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Eretores da Espinha",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Sente-se ou posicione-se no suporte da máquina.\n2. Empurre o suporte para trás estendendo a coluna.\n3. Retorne à posição inicial mantendo o controle do peso.",
                "description": "Fortalecimento seguro e isolado da musculatura paravertebral."
            }
        }
    },
    {
        "id": 507,
        "name": "smith_bent_over_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "smith",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 55,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/smith_bent_over_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bent Over Row (Smith Machine)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Smith Bent Over Row."
            },
            "es": {
                "name": "Bent Over Row (Máquina Smith)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina Smith."
            },
            "pt": {
                "name": "Remada Curvada (Smith)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Smith."
            }
        }
    },
    {
        "id": 508,
        "name": "lat_pulldown_supinated",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 61,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lat_pulldown_supinated.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lat Pulldown Supinated (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Lat Pulldown Supinated."
            },
            "es": {
                "name": "Lat Pulldown Supinated (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea."
            },
            "pt": {
                "name": "Puxada Alta (Pegada Inversa)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Inversa."
            }
        }
    },
    {
        "id": 509,
        "name": "lat_pulldown_neutral",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 61,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/lat_pulldown_neutral.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lat Pulldown Neutral (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Lat Pulldown Neutral."
            },
            "es": {
                "name": "Lat Pulldown Neutral (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea."
            },
            "pt": {
                "name": "Puxada Alta (Pegada Neutra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Neutra."
            }
        }
    },
    {
        "id": 510,
        "name": "seated_cable_row_wide_bar",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 66,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/seated_cable_row_wide_bar.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Seated Row Wide Bar (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Seated Cable Row Wide Bar."
            },
            "es": {
                "name": "Seated Row Wide Bar (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea."
            },
            "pt": {
                "name": "Remada Baixa (Barra Larga)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra Larga."
            }
        }
    },
    {
        "id": 521,
        "name": "weighted_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "plate",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/weighted_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Weighted Pull Up (Plate)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Plate",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Weighted Pull Up."
            },
            "es": {
                "name": "Weighted Pull Up (Disco)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Disco",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Disco."
            },
            "pt": {
                "name": "Barra Fixa com Carga",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Anilha",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    },
    {
        "id": 522,
        "name": "assisted_pull_up_machine",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/assisted_pull_up_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Assisted Pull Up (Machine)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Assisted Pull Up Machine."
            },
            "es": {
                "name": "Assisted Pull Up (Máquina)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina."
            },
            "pt": {
                "name": "Barra Assistida (Graviton)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Graviton."
            }
        }
    },
    {
        "id": 523,
        "name": "barbell_bent_over_row_supinated",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 55,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/barbell_bent_over_row_supinated.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bent Over Row Supinated (Barbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Barbell Bent Over Row Supinated."
            },
            "es": {
                "name": "Bent Over Row Supinated (Barra)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Barra."
            },
            "pt": {
                "name": "Remada Curvada (Barra Supinada)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra Supinada."
            }
        }
    },
    {
        "id": 524,
        "name": "dumbbell_bent_over_row",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 55,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/dumbbell_bent_over_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bent Over Row (Dumbbell)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Dumbbell Bent Over Row."
            },
            "es": {
                "name": "Bent Over Row (Mancuernas)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Mancuernas."
            },
            "pt": {
                "name": "Remada Curvada (Halteres)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Halteres."
            }
        }
    },
    {
        "id": 526,
        "name": "seated_cable_row_supinated",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 66,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/seated_cable_row_supinated.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Seated Row Supinated (Cable)",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Seated Cable Row Supinated."
            },
            "es": {
                "name": "Seated Row Supinated (Polea)",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea."
            },
            "pt": {
                "name": "Remada Baixa (Pegada Inversa)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Inversa."
            }
        }
    },
    {
        "id": 564,
        "name": "chest_to_bar_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/chest_to_bar_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chest To Bar Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Chest To Bar Pull Up."
            },
            "es": {
                "name": "Chest To Bar Pull Up",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Barra Fixa Peito na Barra (C2B)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) C2B."
            }
        }
    },
    {
        "id": 565,
        "name": "l_sit_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/l_sit_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "L Sit Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for L Sit Pull Up."
            },
            "es": {
                "name": "L Sit Pull Up",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Barra Fixa L-Sit",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    },
    {
        "id": 566,
        "name": "archer_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/archer_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Archer Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Archer Pull Up."
            },
            "es": {
                "name": "Archer Pull Up",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Barra Fixa Arqueiro",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    },
    {
        "id": 567,
        "name": "ring_rows",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 53,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/ring_rows.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Ring Rows",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Ring Rows."
            },
            "es": {
                "name": "Ring Rows",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Remada (Argolas)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Argolas."
            }
        }
    },
    {
        "id": 568,
        "name": "muscle_up_bar",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/muscle_up_bar.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Muscle Up Bar",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Muscle Up Bar."
            },
            "es": {
                "name": "Muscle Up Bar",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Muscle-Up (Barra)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra."
            }
        }
    },
    {
        "id": 569,
        "name": "muscle_up_rings",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/muscle_up_rings.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Muscle Up Rings",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Muscle Up Rings."
            },
            "es": {
                "name": "Muscle Up Rings",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Muscle-Up (Argolas)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Argolas."
            }
        }
    },
    {
        "id": 588,
        "name": "rope_climb",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/rope_climb.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rope Climb",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Rope Climb."
            },
            "es": {
                "name": "Rope Climb",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Subida na Corda",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    },
    {
        "id": 591,
        "name": "kipping_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/kipping_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Kipping Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Kipping Pull Up."
            },
            "es": {
                "name": "Kipping Pull Up",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Barra Fixa Kipping (CrossFit)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) CrossFit."
            }
        }
    },
    {
        "id": 592,
        "name": "butterfly_pull_up",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 50,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/butterfly_pull_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Butterfly Pull Up",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Butterfly Pull Up."
            },
            "es": {
                "name": "Butterfly Pull Up",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Barra Fixa Butterfly (CrossFit)",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) CrossFit."
            }
        }
    },
    {
        "id": 595,
        "name": "ghd_back_extension",
        "category": "back",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 72,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/ghd_back_extension.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Ghd Back Extension (Machine)",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Posture",
                    "Posterior Chain",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Ghd Back Extension."
            },
            "es": {
                "name": "Ghd Back Extension (Máquina)",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Postura",
                    "Cadena Posterior",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina."
            },
            "pt": {
                "name": "Extensão Lombar (GHD)",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Postura",
                    "Cadeia Posterior",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) GHD."
            }
        }
    },
    {
        "id": 604,
        "name": "front_lever_hold",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/front_lever_hold.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Front Lever Hold",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Front Lever Hold."
            },
            "es": {
                "name": "Front Lever Hold",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Front Lever Iso",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    },
    {
        "id": 605,
        "name": "back_lever_hold",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/back/back_lever_hold.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Back Lever Hold",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Back Lever Hold."
            },
            "es": {
                "name": "Back Lever Hold",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda."
            },
            "pt": {
                "name": "Back Lever Iso",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas."
            }
        }
    }
];
