import { Exercise } from '../types';

export const BACK_EXERCISES: Exercise[] = [
    {
        "id": 50,
        "name": "Barra Fixa (Pronada)",
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
        "imageUrl": "/exercises/costas/barra_fixa.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa (Pronada)",
                "description": "Exercício fundamental para largura das costas e força funcional.",
                "howTo": "1. Segure a barra com as palmas voltadas para fora.\n2. Puxe o corpo para cima até o queixo passar a barra.\n3. Desça controladamente até estender os braços.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Pull Up",
                "description": "Key exercise for back width and functional strength.",
                "howTo": "1. Grip the bar with palms facing away.\n2. Pull your body up until your chin clears the bar.\n3. Lower with control until arms are extended.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Dominadas Pronadas",
                "description": "Ejercicio fundamental para el ancho de la espalda y fuerza funcional.",
                "howTo": "1. Sujeta la barra con las palmas hacia afuera.\n2. Tira de tu cuerpo hacia arriba hasta pasar la barbilla.\n3. Baja controladamente hasta estirar los brazos.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 51,
        "name": "Barra Fixa (Supinada)",
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
        "imageUrl": "/exercises/costas/puxada_supinada.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa (Supinada)",
                "description": "Foco no latíssimo do dorso e grande recrutamento de bíceps.",
                "howTo": "1. Segure a barra com as palmas voltadas para você.\n2. Puxe o corpo focando em levar os cotovelos para baixo.\n3. Mantenha o core contraído durante o movimento.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chin Up",
                "description": "Focuses on latissimus dorsi with significant biceps recruitment.",
                "howTo": "1. Grip the bar with palms facing you.\n2. Pull your body up, focusing on driving your elbows down.\n3. Keep your core tight throughout the move.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Dominadas Supinadas",
                "description": "Enfoque en el dorsal ancho con gran reclutamiento de bíceps.",
                "howTo": "1. Sujeta la barra con las palmas hacia ti.\n2. Tira del cuerpo enfocándote en llevar los codos hacia abajo.\n3. Mantén el core contraído durante el movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 52,
        "name": "Barra Fixa (Pegada Neutra)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa (Pegada Neutra)",
                "description": "Variação mais segura para os ombros, foca na parte central das costas.",
                "howTo": "1. Use as alças paralelas (palmas voltadas uma para a outra).\n2. Puxe o peito em direção às mãos.\n3. Evite balançar o corpo.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Neutral Grip Pull Up",
                "description": "Safer variation for shoulders, targets the mid-back area.",
                "howTo": "1. Use parallel handles (palms facing each other).\n2. Pull your chest toward your hands.\n3. Avoid swinging your body.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Dominadas Agarre Neutro",
                "description": "Variación más segura para los hombros, enfoca la parte media.",
                "howTo": "1. Usa los agarres paralelos (palmas enfrentadas).\n2. Tira del pecho hacia las manos.\n3. Evita balancear el cuerpo.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 53,
        "name": "Remada Invertida",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Invertida",
                "description": "Ótimo para iniciantes e para postura, feito em barras ou argolas.",
                "howTo": "1. Deite sob uma barra baixa e segure-a com o corpo reto.\n2. Puxe o peito até a barra.\n3. Mantenha o corpo rígido como uma prancha.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Inverted Row",
                "description": "Great for beginners and posture, performed on bars or rings.",
                "howTo": "1. Lie under a low bar and grip it with a straight body.\n2. Pull your chest up to the bar.\n3. Keep your body rigid like a plank.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo Invertido",
                "description": "Ideal para principiantes y postura, en barra o anillas.",
                "howTo": "1. Túmbate bajo una barra baja y sujétala con el cuerpo recto.\n2. Tira del pecho hacia la barra.\n3. Mantén el cuerpo rígido como una tabla.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 54,
        "name": "Super-Homem (Lombar)",
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
        "imageUrl": "/exercises/cardio_e_multiarticulares/prancha_superman.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Super-Homem (Lombar)",
                "description": "Isolamento para fortalecer a lombar e eretores da espinha.",
                "howTo": "1. Deite de bruços com braços e pernas estendidos.\n2. Levante o peito e as coxas do chão simultaneamente.\n3. Segure a contração por 2 segundos e desça.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Superman Exercise",
                "description": "Isolation exercise to strengthen the lower back and erectors.",
                "howTo": "1. Lie face down with arms and legs extended.\n2. Lift your chest and thighs off the floor simultaneously.\n3. Hold the contraction for 2 seconds and lower.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Superman Exercise",
                "description": "Aislamiento para fortalecer la zona lumbar y erectores.",
                "howTo": "1. Túmbate boca abajo con brazos y piernas estirados.\n2. Levanta el pecho y los muslos del suelo a la vez.\n3. Mantén la contracción 2 segundos y baja.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 55,
        "name": "Remada Curvada (Barra)",
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
        "imageUrl": "/exercises/costas/remada_curvada_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Curvada (Barra)",
                "description": "O melhor exercício para densidade e espessura das costas.",
                "howTo": "1. Incline o tronco à frente mantendo a coluna reta.\n2. Puxe a barra em direção ao umbigo.\n3. Aperte as escápulas no topo do movimento.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bent Over Row (Barbell)",
                "description": "The best exercise for back density and thickness.",
                "howTo": "1. Lean your torso forward keeping a straight spine.\n2. Pull the bar toward your navel.\n3. Squeeze your shoulder blades at the top.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo Inclinado (Barra)",
                "description": "El mejor ejercicio para densidad y grosor de espalda.",
                "howTo": "1. Inclina el torso adelante manteniendo la espalda recta.\n2. Tira de la barra hacia el ombligo.\n3. Aprieta las escápulas al final del movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 56,
        "name": "Remada Pendlay (Barra)",
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
        "imageUrl": "/exercises/costas/remada_meadows.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Pendlay (Barra)",
                "description": "Remada explosiva que parte do chão, foco em potência.",
                "howTo": "1. Tronco paralelo ao chão, barra no solo.\n2. Puxe a barra explosivamente até o peito.\n3. Retorne a barra ao chão em cada repetição.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Pendlay Row (Barbell)",
                "description": "Explosive row starting from the floor, focus on power.",
                "howTo": "1. Torso parallel to the floor, bar on the ground.\n2. Pull the bar explosively to your chest.\n3. Return the bar to the floor for each rep.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo Pendlay (Barra)",
                "description": "Remada explosiva desde el suelo, enfoque en potencia.",
                "howTo": "1. Torso paralelo al suelo, barra en el suelo.\n2. Tira de la barra explosivamente hacia el pecho.\n3. Devuelve la barra al suelo en cada repetición.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 57,
        "name": "Remada Cavalinho (Barra T)",
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
        "imageUrl": "/exercises/costas/remada_cavalinho_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Cavalinho (Barra T)",
                "description": "Clássico para atingir o meio das costas e trapézio.",
                "howTo": "1. Posicione a barra entre as pernas.\n2. Segure no puxador e mantenha o peito aberto.\n3. Puxe a carga contraindo bem as costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "T Bar Row (Barbell)",
                "description": "Classic for hitting the mid-back and traps.",
                "howTo": "1. Position the bar between your legs.\n2. Hold the handle and keep your chest out.\n3. Pull the weight while squeezing your back.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo en Barra T",
                "description": "Clásico para trabajar el centro de la espalda y trapecios.",
                "howTo": "1. Coloca la barra entre las piernas.\n2. Sujeta el agarre y mantén el pecho erguido.\n3. Tira del peso apretando la espalda.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 58,
        "name": "Remada Unilateral / Serrote (Halteres)",
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
        "imageUrl": "/exercises/costas/remada_unilateral_halter.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Unilateral / Serrote (Halteres)",
                "description": "Permite maior alongamento e correção de desequilíbrios.",
                "howTo": "1. Apoie uma mão no banco e a outra no halter.\n2. Puxe o halter em direção ao quadril (não ao peito).\n3. Sinta o alongamento na descida.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "One Arm Row (Dumbbell)",
                "description": "Allows for greater stretch and correction of imbalances.",
                "howTo": "1. Support one hand on the bench and the other on the dumbbell.\n2. Pull the dumbbell toward your hip (not chest).\n3. Feel the stretch on the way down.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Remo Unilateral (Mancuerna)",
                "description": "Permite mayor estiramiento y corrige desequilibrios.",
                "howTo": "1. Apoya una mano en el banco e la otra en la mancuerna.\n2. Tira de la mancuerna hacia la cadera (no al pecho).\n3. Siente el estiramiento al bajar.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 59,
        "name": "Remada Seal (Banco)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Seal (Banco)",
                "description": "Remada deitada em banco alto, elimina o roubo com as pernas.",
                "howTo": "1. Deite de bruços em um banco elevado.\n2. Puxe a barra ou halteres sem tirar o peito do banco.\n3. Foco total no isolamento das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Seal Row (Barbell)",
                "description": "Row performed lying on a high bench, eliminates leg drive.",
                "howTo": "1. Lie face down on an elevated bench.\n2. Pull the bar or dumbbells without lifting your chest.\n3. Focus entirely on back isolation.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Seal Row (Barra)",
                "description": "Remada tumbado en banco alto, elimina el impulso de piernas.",
                "howTo": "1. Túmbate boca abajo en un banco elevado.\n2. Tira de la barra o mancuernas sin despegar el pecho.\n3. Enfoque total en el aislamiento de la espalda.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 60,
        "name": "Remada Renegade (Halteres)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Renegade (Halteres)",
                "description": "Combinação de prancha e remada, foco em core e estabilidade.",
                "howTo": "1. Posição de flexão segurando dois halteres no chão.\n2. Reme um halter de cada vez sem girar o quadril.\n3. Mantenha o core extremamente firme.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Renegade Row (Dumbbell)",
                "description": "Plank and row combination, focuses on core and stability.",
                "howTo": "1. Push-up position holding two dumbbells on the floor.\n2. Row one dumbbell at a time without rotating hips.\n3. Keep your core extremely tight.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Renegade Row (Mancuernas)",
                "description": "Combinación de plancha y remada, enfoque en core y estabilidad.",
                "howTo": "1. Posición de flexión sujetando dos mancuernas en el suelo.\n2. Rema una mancuerna a la vez sin girar la cadera.\n3. Mantén el core muy firme.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 61,
        "name": "Puxada Alta (Barra Larga)",
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
        "imageUrl": "/exercises/costas/puxada_alta_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta (Barra Larga)",
                "description": "Exercício principal para criar largura (o 'V' nas costas).",
                "howTo": "1. Segure a barra além da largura dos ombros.\n2. Puxe a barra até a parte superior do peito.\n3. Evite inclinar o tronco excessivamente para trás.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Lat Pulldown Wide Grip (Cable)",
                "description": "Primary exercise for creating back width (V-taper).",
                "howTo": "1. Grip the bar wider than shoulder width.\n2. Pull the bar to your upper chest.\n3. Avoid leaning too far back.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ]
            },
            "es": {
                "name": "Jalón al Pecho (Agarre Ancho)",
                "description": "Ejercicio principal para crear amplitud (espalda en V).",
                "howTo": "1. Sujeta la barra más allá del ancho de hombros.\n2. Tira de la barra hacia la parte superior del pecho.\n3. Evita inclinar el torso demasiado hacia atrás.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 62,
        "name": "Puxada Alta (Pegada Fechada)",
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
        "imageUrl": "/exercises/costas/puxada_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta (Pegada Fechada)",
                "description": "Foca na parte inferior do latíssimo e meio das costas.",
                "howTo": "1. Use o triângulo ou pegada supinada fechada.\n2. Puxe em direção ao peito focando nos cotovelos.\n3. Alongue totalmente os braços na subida.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Lat Pulldown Close Grip (Cable)",
                "description": "Focuses on lower lats and mid-back.",
                "howTo": "1. Use V-taper handle or close supinated grip.\n2. Pull toward your chest focusing on your elbows.\n3. Fully extend your arms on the way up.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ]
            },
            "es": {
                "name": "Jalón al Pecho (Agarre Cerrado)",
                "description": "Enfocado en el dorsal inferior y zona media.",
                "howTo": "1. Usa el triángulo o agarre supinado cerrado.\n2. Tira hacia el pecho enfocándote en los codos.\n3. Estira los brazos totalmente al subir.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 63,
        "name": "Puxada Alta (Atrás da Nuca)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta (Atrás da Nuca)",
                "description": "Variação avançada para isolar a parte superior das costas.",
                "howTo": "1. Puxe a barra até a base da nuca.\n2. Mantenha a coluna vertical.\n3. Requer boa mobilidade de ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Lat Pulldown Behind Neck (Cable)",
                "description": "Advanced variation to isolate the upper back.",
                "howTo": "1. Pull the bar to the base of your neck.\n2. Keep your spine vertical.\n3. Requires good shoulder mobility.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ]
            },
            "es": {
                "name": "Lat Pulldown Behind Neck (Polea)",
                "description": "Variación avanzada para aislar la parte superior.",
                "howTo": "1. Tira de la barra hasta la base de la nuca.\n2. Mantén la columna vertical.\n3. Requiere buena movilidad de hombros.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 64,
        "name": "Pulldown Braço Estendido (Polia)",
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
        "imageUrl": "/exercises/costas/pulldown_polia_alta.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Pulldown Braço Estendido (Polia)",
                "description": "Isolamento do latíssimo sem envolver o bíceps.",
                "howTo": "1. Braços quase retos segurando a barra no alto.\n2. Empurre a barra para baixo até as coxas.\n3. Controle o retorno sentindo o alongamento.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Straight Arm Pulldown (Cable)",
                "description": "Lat isolation without involving the biceps.",
                "howTo": "1. Arms nearly straight holding the bar high.\n2. Push the bar down to your thighs.\n3. Control the return feeling the stretch.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Straight Arm Pulldown (Polea)",
                "description": "Aislamiento del dorsal sin involucrar el bíceps.",
                "howTo": "1. Brazos casi rectos sujetando la barra arriba.\n2. Empuja la barra hacia abajo hasta los muslos.\n3. Controla el regreso sintiendo el estiramiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 65,
        "name": "Puxada Alta Unilateral (Polia)",
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
        "imageUrl": "/exercises/costas/pulldown_unilateral_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta Unilateral (Polia)",
                "description": "Melhora a conexão mente-músculo e simetria.",
                "howTo": "1. Use um puxador de mão única.\n2. Puxe o cotovelo para baixo e para o lado do corpo.\n3. Gire levemente o tronco para máxima contração.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Single Arm Lat Pulldown (Cable)",
                "description": "Improves mind-muscle connection and symmetry.",
                "howTo": "1. Use a single-hand handle.\n2. Pull your elbow down and to the side of your body.\n3. Slightly rotate your torso for max contraction.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Single Arm Lat Pulldown (Polea)",
                "description": "Mejora la conexión mente-músculo y la simetría.",
                "howTo": "1. Usa un agarre de una sola mano.\n2. Tira del codo hacia abajo y al costado del cuerpo.\n3. Gira levemente el torso para máxima contracción.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 66,
        "name": "Remada Baixa (Polia)",
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
        "imageUrl": "/exercises/costas/remada_baixa_sentada.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Baixa (Polia)",
                "description": "Trabalha a espessura e o meio das costas com segurança.",
                "howTo": "1. Pés apoiados e joelhos levemente flexionados.\n2. Puxe o puxador em direção ao abdômen.\n3. Estufe o peito e junte as escápulas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Seated Row (Cable)",
                "description": "Works thickness and mid-back safely.",
                "howTo": "1. Feet supported and knees slightly bent.\n2. Pull the handle toward your abdomen.\n3. Chest out and squeeze your shoulder blades.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo Sentado (Polea)",
                "description": "Trabaja el grosor y centro de la espalda con seguridad.",
                "howTo": "1. Pies apoyados y rodillas algo flexionadas.\n2. Tira del agarre hacia el abdomen.\n3. Saca pecho y junta las escápulas.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 67,
        "name": "Remada Unilateral (Polia)",
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
        "imageUrl": "/exercises/costas/serrote_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Unilateral (Polia)",
                "description": "Permite rotação do punho e maior arco de movimento.",
                "howTo": "1. Em pé ou ajoelhado em frente à polia.\n2. Puxe o cabo trazendo o cotovelo para trás do corpo.\n3. Alterne os braços.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Isolado",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "One Arm Row (Cable)",
                "description": "Allows for wrist rotation and greater range of motion.",
                "howTo": "1. Standing or kneeling in front of the pulley.\n2. Pull the cable bringing your elbow behind your body.\n3. Alternate arms.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Isolation",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "One Arm Row (Polea)",
                "description": "Permite rotación de muñeca y mayor rango de movimiento.",
                "howTo": "1. De pie o arrodillado frente a la polea.\n2. Tira del cable llevando el codo tras el cuerpo.\n3. Alterna los brazos.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Aislamiento",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 68,
        "name": "Face Pull (Polia Corda)",
        "category": "back",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/costas/voador_reverso_maquina.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Face Pull (Polia Corda)",
                "description": "Essencial para saúde dos ombros e trapézio médio/inferior.",
                "howTo": "1. Use a corda na polia alta.\n2. Puxe a corda em direção ao rosto, abrindo as mãos.\n3. Foque na rotação externa dos ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Composto"
                ]
            },
            "en": {
                "name": "Face Pull (Cable)",
                "description": "Essential for shoulder health and mid/lower traps.",
                "howTo": "1. Use the rope on high pulley.\n2. Pull the rope toward your face, pulling hands apart.\n3. Focus on external shoulder rotation.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Compound"
                ]
            },
            "es": {
                "name": "Face Pull (Polea)",
                "description": "Esencial para salud de hombros y trapecio medio/inferior.",
                "howTo": "1. Usa la cuerda en polea alta.\n2. Tira de la cuerda hacia la cara, separando las manos.\n3. Enfócate en la rotación externa de hombros.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 69,
        "name": "Remada Sentada (Máquina)",
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
        "imageUrl": "/exercises/costas/remada_inclinada_maquina.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Sentada (Máquina)",
                "description": "Elimina a fadiga da lombar, focando apenas nas costas.",
                "howTo": "1. Ajuste o banco para apoiar bem o peito.\n2. Segure as manoplas e puxe com força.\n3. Controle o retorno sem soltar o peso.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chest Supported Row (Machine)",
                "description": "Eliminates lower back fatigue, focusing only on the back.",
                "howTo": "1. Adjust the seat to support your chest well.\n2. Grip the handles and pull hard.\n3. Control the return without letting the weight drop.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Chest Supported Row (Máquina)",
                "description": "Elimina fatiga lumbar, enfocado solo en la espalda.",
                "howTo": "1. Ajusta el asiento para apoyar bien el pecho.\n2. Sujeta las manijas y tira con fuerza.\n3. Controla el regreso sin soltar el peso.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 70,
        "name": "Levantamento Terra (Barra)",
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
        "imageUrl": "/exercises/posterior de coxa/levantamento_terra_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Levantamento Terra (Barra)",
                "description": "O construtor de força mais completo para a cadeia posterior.",
                "howTo": "1. Barra sobre o meio dos pés.\n2. Coluna reta, puxe o ar e suba estendendo o corpo.\n3. Mantenha a barra colada às pernas.",
                "tags": [
                    "Costas",
                    "Cadeia Posterior",
                    "Carga Pesada",
                    "Corpo Todo",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Deadlift Conventional (Barbell)",
                "description": "The ultimate strength builder for the posterior chain.",
                "howTo": "1. Bar over mid-foot.\n2. Straight back, brace core and stand up.\n3. Keep the bar close to your legs.",
                "tags": [
                    "Back",
                    "Posterior Chain",
                    "Heavy Load",
                    "Full Body",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Peso Muerto Convencional (Barra)",
                "description": "El constructor de fuerza más completo para la cadena posterior.",
                "howTo": "1. Barra sobre el medio del pie.\n2. Espalda recta, aprieta el core y levántate.\n3. Mantén la barra pegada a las piernas.",
                "tags": [
                    "Espalda",
                    "Cadena Posterior",
                    "Carga Pesada",
                    "Cuerpo Completo",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 71,
        "name": "Meio Terra / Rack Pull (Barra)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Meio Terra / Rack Pull (Barra)",
                "description": "Foca na parte superior do levantamento terra e trapézios.",
                "howTo": "1. Barra posicionada sobre os suportes (altura do joelho).\n2. Execute a fase final da extensão do terra.\n3. Use cargas mais pesadas que o terra convencional.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Rack Pull (Barbell)",
                "description": "Focuses on the top part of the deadlift and traps.",
                "howTo": "1. Bar positioned on racks (knee height).\n2. Perform the final lockout phase of a deadlift.\n3. Use heavier weights than conventional deadlift.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Rack Pull (Barra)",
                "description": "Enfocado en la parte final del peso muerto y trapecios.",
                "howTo": "1. Barra sobre los soportes (altura del joelho).\n2. Realiza la fase final de extensión del peso muerto.\n3. Usa cargas más pesadas que el convencional.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 72,
        "name": "Extensão Lombar (Banco)",
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
        "imageUrl": "/exercises/core/extensao_lombar.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Extensão Lombar (Banco)",
                "description": "Fortalecimento seguro para a região inferior das costas.",
                "howTo": "1. Apoie o quadril no suporte.\n2. Desça o tronco e suba até ficar alinhado às pernas.\n3. Não hiperextenda demais para trás.",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Postura",
                    "Cadeia Posterior",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Back Extension (Machine)",
                "description": "Safe strengthening for the lower back region.",
                "howTo": "1. Support your hips on the pad.\n2. Lower your torso and rise until aligned with legs.\n3. Do not hyperextend too far back.",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Posture",
                    "Posterior Chain",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Extensión Lumbar (Banco)",
                "description": "Fortalecimiento seguro para la zona baja de la espalda.",
                "howTo": "1. Apoya la cadera en el soporte.\n2. Baja el torso y sube hasta alinearte con las piernas.\n3. No hiperextiendas demasiado hacia atrás.",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Postura",
                    "Cadena Posterior",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 73,
        "name": "Good Morning (Barra)",
        "category": "back",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Good Morning (Barra)",
                "description": "Exercício para cadeia posterior com a barra nas costas.",
                "howTo": "1. Barra nos trapézios, pés largura dos ombros.\n2. Jogue o quadril para trás inclinando o tronco reto.\n3. Sinta o alongamento nos posteriores e suba.",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Postura",
                    "Cadeia Posterior",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Good Morning (Barbell)",
                "description": "Posterior chain exercise with the bar on your back.",
                "howTo": "1. Bar on traps, feet shoulder-width apart.\n2. Hinge at hips keeping your back straight.\n3. Feel the hamstring stretch and rise.",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Posture",
                    "Posterior Chain",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Good Morning (Barra)",
                "description": "Ejercicio de cadena posterior con barra en la espalda.",
                "howTo": "1. Barra en trapecios, pies al ancho de hombros.\n2. Lleva la cadera atrás inclinando el torso recto.\n3. Siente el estiramiento femoral y sube.",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Postura",
                    "Cadena Posterior",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 74,
        "name": "Encolhimento (Barra)",
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
        "imageUrl": "/exercises/costas/encolhimento_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Encolhimento (Barra)",
                "description": "Foco total na porção superior do trapézio.",
                "howTo": "1. Segure a barra à frente do corpo.\n2. Eleve os ombros em direção às orelhas.\n3. Segure 1 segundo no topo e desça.",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Barra",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Shrug (Barbell)",
                "description": "Full focus on the upper trapezius portion.",
                "howTo": "1. Hold the bar in front of your body.\n2. Raise your shoulders toward your ears.\n3. Hold for 1 second at the top and lower.",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Barbell",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Shrug (Barra)",
                "description": "Enfoque total en la porción superior del trapecio.",
                "howTo": "1. Sujeta la barra frente al cuerpo.\n2. Eleva los hombros hacia las orejas.\n3. Mantén 1 segundo arriba y baja.",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Barra",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 75,
        "name": "Encolhimento (Halteres)",
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
        "imageUrl": "/exercises/costas/encolhimento_halteres.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Encolhimento (Halteres)",
                "description": "Pegada mais natural para o trapézio, permite maior foco.",
                "howTo": "1. Halteres ao lado do corpo.\n2. Encolha os ombros verticalmente.\n3. Mantenha os braços esticados o tempo todo.",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Shrug (Dumbbell)",
                "description": "More natural grip for traps, allows better focus.",
                "howTo": "1. Dumbbells at your sides.\n2. Shrug your shoulders vertically.\n3. Keep your arms straight at all times.",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Shrug (Mancuernas)",
                "description": "Agarre más natural para trapecios, permite mayor enfoque.",
                "howTo": "1. Mancuernas a los lados del cuerpo.\n2. Encoge los hombros verticalmente.\n3. Mantén los brazos estirados todo el tiempo.",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 76,
        "name": "Encolhimento (Polia)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Encolhimento (Polia)",
                "description": "Tensão constante desde o início do movimento.",
                "howTo": "1. Use a barra reta na polia baixa.\n2. Encolha os ombros contra a resistência do cabo.\n3. Evite girar os ombros, faça apenas o movimento vertical.",
                "tags": [
                    "Costas",
                    "Trapézio",
                    "Carga Pesada",
                    "Composto"
                ]
            },
            "en": {
                "name": "Shrug (Cable)",
                "description": "Constant tension from the start of the movement.",
                "howTo": "1. Use a straight bar on the low pulley.\n2. Shrug your shoulders against cable resistance.\n3. Do not roll shoulders, move only vertically.",
                "tags": [
                    "Back",
                    "Traps",
                    "Heavy Load",
                    "Compound"
                ]
            },
            "es": {
                "name": "Shrug (Polea)",
                "description": "Tensión constante desde el inicio del movimiento.",
                "howTo": "1. Usa barra recta en polea baja.\n2. Encoge los hombros contra la resistencia del cable.\n3. Evita girar los hombros, solo movimiento vertical.",
                "tags": [
                    "Espalda",
                    "Trapecios",
                    "Carga Pesada",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 507,
        "name": "Remada Curvada (Smith)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Curvada (Smith)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Smith.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bent Over Row (Smith Machine)",
                "description": "Technical execution for Smith Bent Over Row.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bent Over Row (Máquina Smith)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina Smith.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 508,
        "name": "Puxada Alta (Pegada Inversa)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta (Pegada Inversa)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Inversa.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Lat Pulldown Supinated (Cable)",
                "description": "Technical execution for Lat Pulldown Supinated.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ]
            },
            "es": {
                "name": "Lat Pulldown Supinated (Polea)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 509,
        "name": "Puxada Alta (Pegada Neutra)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Puxada Alta (Pegada Neutra)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Neutra.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Lat Pulldown Neutral (Cable)",
                "description": "Technical execution for Lat Pulldown Neutral.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Compound"
                ]
            },
            "es": {
                "name": "Lat Pulldown Neutral (Polea)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 510,
        "name": "Remada Baixa (Barra Larga)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Baixa (Barra Larga)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra Larga.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Seated Row Wide Bar (Cable)",
                "description": "Technical execution for Seated Cable Row Wide Bar.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Seated Row Wide Bar (Polea)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 521,
        "name": "Barra Fixa com Carga",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa com Carga",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Anilha",
                    "Composto"
                ]
            },
            "en": {
                "name": "Weighted Pull Up (Plate)",
                "description": "Technical execution for Weighted Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Plate",
                    "Compound"
                ]
            },
            "es": {
                "name": "Weighted Pull Up (Disco)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Disco.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Disco",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 522,
        "name": "Barra Assistida (Graviton)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Assistida (Graviton)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Graviton.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Assisted Pull Up (Machine)",
                "description": "Technical execution for Assisted Pull Up Machine.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Assisted Pull Up (Máquina)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 523,
        "name": "Remada Curvada (Barra Supinada)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Curvada (Barra Supinada)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra Supinada.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bent Over Row Supinated (Barbell)",
                "description": "Technical execution for Barbell Bent Over Row Supinated.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bent Over Row Supinated (Barra)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Barra.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 524,
        "name": "Remada Curvada (Halteres)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Curvada (Halteres)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Halteres.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bent Over Row (Dumbbell)",
                "description": "Technical execution for Dumbbell Bent Over Row.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bent Over Row (Mancuernas)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Mancuernas.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 525,
        "name": "Remada Meadows (Landmine)",
        "category": "back",
        "secondaryMuscles": [
            "biceps",
            "forearms",
            "shoulders",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 58,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Meadows (Landmine)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Landmine.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Barra",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Meadows Row (Barbell)",
                "description": "Technical execution for Meadows Row.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Barbell",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Meadows Row (Barra)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Barra.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Barra",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 526,
        "name": "Remada Baixa (Pegada Inversa)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada Baixa (Pegada Inversa)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Pegada Inversa.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Composto"
                ]
            },
            "en": {
                "name": "Seated Row Supinated (Cable)",
                "description": "Technical execution for Seated Cable Row Supinated.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Compound"
                ]
            },
            "es": {
                "name": "Seated Row Supinated (Polea)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 564,
        "name": "Barra Fixa Peito na Barra (C2B)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa Peito na Barra (C2B)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) C2B.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chest To Bar Pull Up",
                "description": "Technical execution for Chest To Bar Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Chest To Bar Pull Up",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 565,
        "name": "Barra Fixa L-Sit",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa L-Sit",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "L Sit Pull Up",
                "description": "Technical execution for L Sit Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "L Sit Pull Up",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 566,
        "name": "Barra Fixa Arqueiro",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa Arqueiro",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
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
                ]
            },
            "en": {
                "name": "Archer Pull Up",
                "description": "Technical execution for Archer Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
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
                ]
            },
            "es": {
                "name": "Archer Pull Up",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
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
                ]
            }
        }
    },
    {
        "id": 567,
        "name": "Remada (Argolas)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remada (Argolas)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Argolas.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Horizontal",
                    "Espessura",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Ring Rows",
                "description": "Technical execution for Ring Rows.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Horizontal Pull",
                    "Thickness",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Ring Rows",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Horizontal",
                    "Grosor",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 568,
        "name": "Muscle-Up (Barra)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Muscle-Up (Barra)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Barra.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Muscle Up Bar",
                "description": "Technical execution for Muscle Up Bar.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Muscle Up Bar",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 569,
        "name": "Muscle-Up (Argolas)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Muscle-Up (Argolas)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) Argolas.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Muscle Up Rings",
                "description": "Technical execution for Muscle Up Rings.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Muscle Up Rings",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 588,
        "name": "Subida na Corda",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Subida na Corda",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Rope Climb",
                "description": "Technical execution for Rope Climb.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Rope Climb",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 591,
        "name": "Barra Fixa Kipping (CrossFit)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa Kipping (CrossFit)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) CrossFit.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Kipping Pull Up",
                "description": "Technical execution for Kipping Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Kipping Pull Up",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 592,
        "name": "Barra Fixa Butterfly (CrossFit)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Barra Fixa Butterfly (CrossFit)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) CrossFit.",
                "howTo": "1. Segure a barra ou manopla com pegada firme e coluna ereta.\n2. Puxe a carga em direção à parte superior do peito trazendo os cotovelos para baixo.\n3. Retorne devagar alongando as dorsais no topo sem soltar os ombros.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Puxada Vertical",
                    "Largura",
                    "Barra Fixa",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Butterfly Pull Up",
                "description": "Technical execution for Butterfly Pull Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Vertical Pull",
                    "Width",
                    "Pull-up Bar",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Butterfly Pull Up",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Tirón Vertical",
                    "Anchura",
                    "Barra de Dominadas",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 595,
        "name": "Extensão Lombar (GHD)",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Extensão Lombar (GHD)",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas no(a) GHD.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Lombar",
                    "Postura",
                    "Cadeia Posterior",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Ghd Back Extension (Machine)",
                "description": "Technical execution for Ghd Back Extension.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Lower Back",
                    "Posture",
                    "Posterior Chain",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Ghd Back Extension (Máquina)",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda en Máquina.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Lumbar",
                    "Postura",
                    "Cadena Posterior",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 604,
        "name": "Front Lever Iso",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Front Lever Iso",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Front Lever Hold",
                "description": "Technical execution for Front Lever Hold.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Front Lever Hold",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 605,
        "name": "Back Lever Iso",
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
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Back Lever Iso",
                "description": "Excelente variação para trabalhar a espessura, largura e força das costas.",
                "howTo": "1. Incline o tronco à frente com a coluna neutra e joelhos semi-flexionados.\n2. Puxe a carga em direção ao quadril/umbigo contraindo as escápulas.\n3. Desça controlando o peso até o alongamento completo das costas.",
                "tags": [
                    "Costas",
                    "Latíssimo do Dorso",
                    "Costas Superior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Back Lever Hold",
                "description": "Technical execution for Back Lever Hold.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Back",
                    "Latissimus Dorsi",
                    "Upper Back",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Back Lever Hold",
                "description": "Excelente variación para trabajar la densidad y anchura de la espalda.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Espalda",
                    "Dorsal Ancho",
                    "Espalda Superior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    }
];
