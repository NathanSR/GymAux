import { Exercise } from '../types';

export const CARDIO_EXERCISES: Exercise[] = [
    {
        "id": 420,
        "name": "treadmill_running",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/treadmill_running.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Corrida na Esteira",
                "description": "Excelente para queima calórica e melhora da resistência cardiovascular.",
                "howTo": "1. Inicie com um trote leve para aquecer.\n2. Mantenha o tronco ereto e os braços relaxados em 90 graus.\n3. Aumente a velocidade conforme seu nível de condicionamento.",
                "tags": [
                    "Cardio",
                    "Corrida",
                    "Resistência",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Treadmill Running (Machine)",
                "description": "Excellent for calorie burning and improving cardiovascular endurance.",
                "howTo": "1. Start with a light jog to warm up.\n2. Keep your torso upright and arms relaxed at a 90-degree angle.\n3. Increase speed according to your fitness level.",
                "tags": [
                    "Cardio",
                    "Running",
                    "Endurance",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Carrera en Cinta Ergométrica",
                "description": "Excelente para quemar calorías y mejorar la resistencia cardiovascular.",
                "howTo": "1. Comienza con un trote ligero para calentar.\n2. Mantén el tronco erguido y los brazos relajados a 90 grados.\n3. Aumenta la velocidad según tu nivel de condición física.",
                "tags": [
                    "Cardio",
                    "Carrera",
                    "Resistencia",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 421,
        "name": "treadmill_walking",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/treadmill_walking.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Caminhada na Esteira",
                "description": "Exercício de baixo impacto ideal para iniciantes ou recuperação ativa.",
                "howTo": "1. Ajuste a velocidade para um passo firme e constante.\n2. Use a inclinação da esteira para aumentar o desafio sem precisar correr.\n3. Mantenha uma respiração rítmica e profunda.",
                "tags": [
                    "Cardio",
                    "Corrida",
                    "Resistência",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Treadmill Walking (Machine)",
                "description": "Low-impact exercise ideal for beginners or active recovery.",
                "howTo": "1. Adjust the speed to a firm and steady pace.\n2. Use the treadmill's incline to increase the challenge without running.\n3. Maintain rhythmic and deep breathing.",
                "tags": [
                    "Cardio",
                    "Running",
                    "Endurance",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Caminata en Cinta",
                "description": "Ejercicio de bajo impacto ideal para principiantes o recuperación activa.",
                "howTo": "1. Ajusta la velocidad a un paso firme y constante.\n2. Usa la inclinación de la cinta para aumentar el desafío sin correr.\n3. Mantén una respiración rítmica y profunda.",
                "tags": [
                    "Cardio",
                    "Carrera",
                    "Resistencia",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 422,
        "name": "elliptical_trainer",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/elliptical_trainer.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Elíptico",
                "description": "Cardio de corpo inteiro com impacto quase zero nas articulações.",
                "howTo": "1. Posicione os pés nos pedais e segure as hastes móveis.\n2. Movimente braços e pernas de forma sincronizada.\n3. Mantenha a coluna alinhada e evite jogar o peso apenas nos calcanhares.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Elliptical Trainer (Machine)",
                "description": "Full-body cardio with near-zero impact on joints.",
                "howTo": "1. Place your feet on the pedals and grip the moving handles.\n2. Move arms and legs in a synchronized manner.\n3. Keep your spine aligned and avoid shifting all weight to your heels.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bicicleta Elíptica",
                "description": "Cardio de cuerpo completo con impacto casi nulo en las articulaciones.",
                "howTo": "1. Coloca los pies en los pedales y sujeta las barras móviles.\n2. Mueve brazos y piernas de forma sincronizada.\n3. Mantén la columna alineada y evita volcar el peso solo en los talones.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 423,
        "name": "stationary_bike",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "hamstrings",
            "calves",
            "glutes"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/stationary_bike.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Bicicleta Ergométrica",
                "description": "Foco nos membros inferiores com excelente controle de intensidade.",
                "howTo": "1. Ajuste o selim na altura do quadril.\n2. Pedale de forma fluida, mantendo o abdômen contraído.\n3. Alterne entre carga leve para velocidade e carga pesada para força.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Baixo Impacto",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Stationary Bike (Machine)",
                "description": "Focuses on lower limbs with excellent intensity control.",
                "howTo": "1. Adjust the seat to hip height.\n2. Pedal fluidly, keeping your core engaged.\n3. Alternate between light resistance for speed and heavy resistance for strength.",
                "tags": [
                    "Cardio",
                    "Cycling",
                    "Low Impact",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bicicleta Estática",
                "description": "Enfoque en los miembros inferiores con excelente control de intensidad.",
                "howTo": "1. Ajusta el sillín a la altura de la cadera.\n2. Pedalea de forma fluida, manteniendo el abdomen contraído.\n3. Alterna entre carga ligera para velocidad y carga pesada para fuerza.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Bajo Impacto",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 424,
        "name": "stair_climber",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/stair_climber.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Simulador de Escada",
                "description": "Intenso para as pernas, glúteos e sistema cardiovascular.",
                "howTo": "1. Mantenha a postura ereta, evitando apoiar todo o peso nos corrimãos.\n2. Apoie o pé inteiro no degrau para maior ativação dos glúteos.\n3. Mantenha um ritmo constante que eleve sua frequência cardíaca.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Stair Climber (Machine)",
                "description": "Intense for legs, glutes, and the cardiovascular system.",
                "howTo": "1. Maintain an upright posture, avoiding leaning heavily on the handrails.\n2. Place your entire foot on the step for greater glute activation.\n3. Keep a steady pace that raises your heart rate.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Simulador de Escaleras",
                "description": "Intenso para las piernas, glúteos y sistema cardiovascular.",
                "howTo": "1. Mantén la postura erguida, evitando apoyarte totalmente en los pasamanos.\n2. Apoya el pie completo en el escalón para mayor activación de glúteos.\n3. Mantén un ritmo constante que eleve tu frecuencia cardíaca.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 425,
        "name": "rowing_machine",
        "category": "cardio",
        "secondaryMuscles": [
            "back",
            "biceps",
            "quadriceps",
            "hamstrings",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/rowing_machine.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Remo Ergométrico (Concept2)",
                "description": "Trabalha cerca de 85% dos músculos do corpo em um único movimento.",
                "howTo": "1. Empurre com as pernas primeiro, depois incline o tronco e puxe com os braços.\n2. Retorne os braços, incline o tronco e depois dobre as pernas.\n3. Mantenha o movimento fluido e a coluna protegida.",
                "tags": [
                    "Cardio",
                    "Corpo Todo",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Rowing (Machine)",
                "description": "Works about 85% of the body's muscles in a single motion.",
                "howTo": "1. Push with your legs first, then lean back slightly and pull with your arms.\n2. Return your arms, lean forward, then bend your legs.\n3. Keep the movement fluid and your back protected.",
                "tags": [
                    "Cardio",
                    "Full Body",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Remo Ergométrico (Concept2)",
                "description": "Trabaja cerca del 85% de los músculos del cuerpo en un solo movimiento.",
                "howTo": "1. Empuja primero con las piernas, luego inclina el tronco y tira con los brazos.\n2. Regresa los brazos, inclina el tronco y luego dobla las piernas.\n3. Mantén el movimiento fluido y la espalda protegida.",
                "tags": [
                    "Cardio",
                    "Cuerpo Completo",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 426,
        "name": "assault_bike",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "hamstrings",
            "calves",
            "glutes"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/assault_bike.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Bicicleta de Ar (Assault Bike)",
                "description": "A ferramenta definitiva para treinos HIIT de alta potência.",
                "howTo": "1. Use a força das pernas e dos braços simultaneamente.\n2. A resistência aumenta conforme você aplica mais velocidade.\n3. Mantenha explosões curtas de esforço máximo seguidas de descanso.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Baixo Impacto",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Assault Bike (Machine)",
                "description": "The ultimate tool for high-power HIIT workouts.",
                "howTo": "1. Use leg and arm power simultaneously.\n2. Resistance increases as you apply more speed.\n3. Perform short bursts of maximum effort followed by rest.",
                "tags": [
                    "Cardio",
                    "Cycling",
                    "Low Impact",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bicicleta de Aire (Assault Bike)",
                "description": "La herramienta definitiva para entrenamientos HIIT de alta potencia.",
                "howTo": "1. Usa la fuerza de piernas y brazos simultáneamente.\n2. La resistencia aumenta a medida que aplicas más velocidad.\n3. Realiza ráfagas cortas de esfuerzo máximo seguidas de descanso.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Bajo Impacto",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 427,
        "name": "jumping_jacks",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/jumping_jacks.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Polichinelo",
                "description": "Exercício clássico de aquecimento e coordenação motora.",
                "howTo": "1. Comece em pé com braços ao lado do corpo.\n2. Salte afastando as pernas e levando as mãos acima da cabeça.\n3. Retorne à posição inicial com um novo salto.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Jumping Jacks",
                "description": "Classic warm-up exercise and motor coordination builder.",
                "howTo": "1. Start standing with arms at your sides.\n2. Jump while spreading your legs and bringing hands above your head.\n3. Return to the starting position with another jump.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Saltos de Tijera (Jumping Jacks)",
                "description": "Ejercicio clásico de calentamiento y coordinación motora.",
                "howTo": "1. Comienza de pie con los brazos a los lados.\n2. Salta abriendo las piernas y llevando las manos sobre la cabeza.\n3. Regresa a la posición inicial con otro salto.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 428,
        "name": "burpees",
        "category": "cardio",
        "secondaryMuscles": [
            "chest",
            "quadriceps",
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/burpees.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Burpees",
                "description": "Movimento completo que exige força, agilidade e muito fôlego.",
                "howTo": "1. Agache, coloque as mãos no chão e salte para a posição de prancha.\n2. Encoste o peito no chão, volte à posição de agachamento.\n3. Salte para cima batendo as mãos acima da cabeça.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Burpees",
                "description": "Full-body movement that demands strength, agility, and stamina.",
                "howTo": "1. Squat, place hands on the floor, and jump back to a plank position.\n2. Touch your chest to the floor, return to a squat.\n3. Jump up while clapping your hands above your head.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Burpees",
                "description": "Movimiento completo que exige fuerza, agilidad y mucha resistencia.",
                "howTo": "1. Agáchate, pon las manos en el suelo y salta a posición de plancha.\n2. Toca el suelo com el pecho, vuelve a la posición de cuclillas.\n3. Salta hacia arriba aplaudiendo sobre la cabeza.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 429,
        "name": "jump_rope",
        "category": "cardio",
        "secondaryMuscles": [
            "calves",
            "quadriceps",
            "shoulders",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/jump_rope.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Pular Corda",
                "description": "Queima calórica altíssima com foco em agilidade e panturrilhas.",
                "howTo": "1. Gire a corda usando apenas os pulsos, não os braços.\n2. Salte baixo, apenas o suficiente para a corda passar sob os pés.\n3. Mantenha os joelhos levemente flexionados para absorver o impacto.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Composto"
                ]
            },
            "en": {
                "name": "Jump Rope",
                "description": "Very high calorie burn focusing on agility and calves.",
                "howTo": "1. Rotate the rope using only your wrists, not your arms.\n2. Jump low, just enough for the rope to pass under your feet.\n3. Keep knees slightly bent to absorb impact.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Compound"
                ]
            },
            "es": {
                "name": "Salto con Cuerda",
                "description": "Quema calórica altísima con enfoque en agilidad y pantorrillas.",
                "howTo": "1. Gira la cuerda usando solo las muñecas, no los brazos.\n2. Salta bajo, lo justo para que la cuerda pase bajo los pies.\n3. Mantén las rodillas ligeramente flexionadas para absorber el impacto.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 430,
        "name": "high_knees",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/high_knees.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Corrida com Elevação de Joelhos",
                "description": "Eleva rapidamente a frequência cardíaca e trabalha a mecânica de corrida.",
                "howTo": "1. Corra no lugar elevando os joelhos até a altura do quadril.\n2. Use os braços para ritmar o movimento.\n3. Pise com a parte frontal dos pés de forma rápida.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "High Knees",
                "description": "Quickly raises heart rate and works on running mechanics.",
                "howTo": "1. Run in place, lifting your knees to hip height.\n2. Use your arms to pace the movement.\n3. Land on the balls of your feet quickly.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Carrera con Rodillas Altas",
                "description": "Eleva rápidamente la frecuencia cardíaca y trabaja la mecánica de carrera.",
                "howTo": "1. Corre en el sitio elevando las rodillas a la altura de la cadera.\n2. Usa los brazos para dar ritmo al movimiento.\n3. Pisa con la parte delantera de los pies de forma rápida.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 431,
        "name": "box_jumps",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "none",
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
                "name": "Salto na Caixa",
                "description": "Desenvolve potência explosiva e capacidade anaeróbica.",
                "howTo": "1. Fique de frente para uma caixa estável.\n2. Salte com ambos os pés, aterrissando de forma suave e silenciosa.\n3. Fique em pé completamente antes de descer com cuidado.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Composto"
                ]
            },
            "en": {
                "name": "Box Jumps",
                "description": "Develops explosive power and anaerobic capacity.",
                "howTo": "1. Stand in front of a stable box.\n2. Jump with both feet, landing softly and quietly.\n3. Stand up completely before stepping down carefully.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Compound"
                ]
            },
            "es": {
                "name": "Salto al Cajón",
                "description": "Desarrolla potencia explosiva y capacidad anaeróbica.",
                "howTo": "1. Ponte frente a un cajón estable.\n2. Salta con ambos pies, aterrizando de forma suave y silenciosa.\n3. Ponte de pie completamente antes de bajar con cuidado.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 432,
        "name": "outdoor_running",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/outdoor_running.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Corrida ao Ar Livre",
                "description": "Variação dinâmica com diferentes terrenos e resistência do ar.",
                "howTo": "1. Escolha um calçado adequado para o tipo de solo.\n2. Esteja atento à postura e à hidratação.\n3. Use o ambiente (subidas e descidas) para variar a intensidade.",
                "tags": [
                    "Cardio",
                    "Corrida",
                    "Resistência",
                    "Stamina/Resistência",
                    "Composto"
                ]
            },
            "en": {
                "name": "Outdoor Running",
                "description": "Dynamic variation with different terrains and air resistance.",
                "howTo": "1. Choose appropriate footwear for the ground surface.\n2. Stay mindful of posture and hydration.\n3. Use the environment (hills) to vary intensity.",
                "tags": [
                    "Cardio",
                    "Running",
                    "Endurance",
                    "Stamina",
                    "Compound"
                ]
            },
            "es": {
                "name": "Carrera al Aire Libre",
                "description": "Variación dinámica con diferentes terrenos y resistencia del aire.",
                "howTo": "1. Elige calzado adecuado para el tipo de suelo.\n2. Atento a la postura y a la hidratación.\n3. Usa el entorno (subidas) para variar la intensidad.",
                "tags": [
                    "Cardio",
                    "Carrera",
                    "Resistencia",
                    "Estamina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 433,
        "name": "swimming",
        "category": "cardio",
        "secondaryMuscles": [
            "full_body",
            "back",
            "shoulders",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/swimming.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Natação",
                "description": "Cardio terapêutico de corpo inteiro sem impacto articular.",
                "howTo": "1. Mantenha o corpo horizontal na água.\n2. Foque na técnica de braçada e na respiração lateral.\n3. Alterne entre estilos (Crawl, Costas, Peito) para variar o estímulo.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Composto"
                ]
            },
            "en": {
                "name": "Swimming",
                "description": "Therapeutic full-body cardio without joint impact.",
                "howTo": "1. Keep your body horizontal in the water.\n2. Focus on stroke technique and lateral breathing.\n3. Alternate between styles (Crawl, Backstroke, Breaststroke) for variety.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Compound"
                ]
            },
            "es": {
                "name": "Natación",
                "description": "Cardio terapéutico de cuerpo completo sin impacto articular.",
                "howTo": "1. Mantén el cuerpo horizontal en el agua.\n2. Enfócate en la técnica de brazada y respiración lateral.\n3. Alterna estilos (Crawl, Espalda, Braza) para variar el estímulo.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 434,
        "name": "cycling_outdoor",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "hamstrings",
            "calves",
            "glutes"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/cycling_outdoor.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Ciclismo ao Ar Livre",
                "description": "Ótimo para longas durações e resistência muscular das pernas.",
                "howTo": "1. Verifique os equipamentos de segurança antes de começar.\n2. Mantenha uma cadência de pedalada constante.\n3. Use as marchas da bicicleta para gerenciar o esforço em subidas.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Baixo Impacto",
                    "Stamina/Resistência",
                    "Composto"
                ]
            },
            "en": {
                "name": "Cycling Outdoor",
                "description": "Great for long durations and leg muscle endurance.",
                "howTo": "1. Check safety equipment before starting.\n2. Maintain a constant pedaling cadence.\n3. Use the bike's gears to manage effort on inclines.",
                "tags": [
                    "Cardio",
                    "Cycling",
                    "Low Impact",
                    "Stamina",
                    "Compound"
                ]
            },
            "es": {
                "name": "Ciclismo al Aire Libre",
                "description": "Ideal para largas duraciones y resistencia muscular de las piernas.",
                "howTo": "1. Revisa el equipo de seguridad antes de empezar.\n2. Mantén una cadencia de pedaleo constante.\n3. Usa las marchas para gestionar el esfuerzo en las cuestas.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Bajo Impacto",
                    "Estamina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 435,
        "name": "battle_ropes",
        "category": "cardio",
        "secondaryMuscles": [
            "calves",
            "quadriceps",
            "shoulders",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/battle_ropes.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Corda Naval (Battle Ropes)",
                "description": "Treino metabólico intenso que desafia a força dos braços e o core.",
                "howTo": "1. Segure as pontas da corda com os joelhos levemente flexionados.\n2. Crie ondas alternadas ou simultâneas com movimento rápido dos braços.\n3. Mantenha o core firme para não balançar o corpo excessivamente.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Composto"
                ]
            },
            "en": {
                "name": "Battle Ropes",
                "description": "Intense metabolic workout challenging arm strength and core.",
                "howTo": "1. Hold the rope ends with knees slightly bent.\n2. Create alternating or simultaneous waves with rapid arm movements.\n3. Keep your core tight to prevent excessive body swaying.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Compound"
                ]
            },
            "es": {
                "name": "Cuerdas de Combate (Battle Ropes)",
                "description": "Entrenamiento metabólico intenso que desafía brazos y core.",
                "howTo": "1. Sujeta los extremos de la cuerda con rodillas flexionadas.\n2. Crea ondas alternas o simultáneas con movimientos rápidos de brazos.\n3. Mantén el core firme para no balancear el cuerpo en exceso.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 589,
        "name": "double_unders",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "calves",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/cardio/double_unders.webp",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Salto de Corda Duplo (DU)",
                "description": "Exercício metabólico de alta intensidade para resistência cardiovascular e queima de gordura.",
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidade",
                    "Metabólico",
                    "Composto"
                ]
            },
            "en": {
                "name": "Double Unders",
                "description": "Technical execution for Double Unders.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "High Intensity",
                    "Metabolic",
                    "Compound"
                ]
            },
            "es": {
                "name": "Double Unders",
                "description": "Ejercicio metabólico de alta intensidad para la resistencia cardiovascular.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Cardio",
                    "HIIT",
                    "Alta Intensidad",
                    "Metabólico",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 590,
        "name": "air_bike_machine",
        "category": "cardio",
        "secondaryMuscles": [
            "quadriceps",
            "hamstrings",
            "calves",
            "glutes"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Assault Air Bike",
                "description": "Exercício metabólico de alta intensidade para resistência cardiovascular e queima de gordura.",
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Baixo Impacto",
                    "Stamina/Resistência",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Air Bike (Machine)",
                "description": "Technical execution for Air Bike.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Cardio",
                    "Cycling",
                    "Low Impact",
                    "Stamina",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Air Bike (Máquina)",
                "description": "Ejercicio metabólico de alta intensidad para la resistencia cardiovascular.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Cardio",
                    "Ciclismo",
                    "Bajo Impacto",
                    "Estamina",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    }
];
