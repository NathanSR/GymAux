import { Exercise } from '../types';

export const ABDUCTOR_EXERCISES: Exercise[] = [
    {
        "id": 360,
        "name": "seated_abduction_machine",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Cadeira Abdutora Sentada (Máquina)",
                "description": "Isolamento clássico para o glúteo médio e contorno lateral do quadril.",
                "howTo": "1. Sente-se na máquina com as costas bem apoiadas.\n2. Empurre os suportes para fora usando a lateral dos joelhos/coxas.\n3. Controle o retorno sem deixar as placas baterem.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Seated Abduction (Machine)",
                "description": "Classic isolation for the gluteus medius and lateral hip contour.",
                "howTo": "1. Sit in the machine with your back firmly against the support.\n2. Push the pads outward using the sides of your knees/thighs.\n3. Control the return without letting the weight plates crash.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Máquina de Abductores Sentado",
                "description": "Aislamiento clásico para el glúteo medio y el contorno lateral de la cadera.",
                "howTo": "1. Siéntate en la máquina con la espalda bien apoyada.\n2. Empuja los soportes hacia afuera usando el lateral de las rodillas/muslos.\n3. Controla el regreso sin dejar que las placas de peso golpeen.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 361,
        "name": "standing_hip_abduction_cable",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Abdução de Quadril em Pé (Polia)",
                "description": "Trabalha a estabilidade do quadril e o glúteo lateral de forma unilateral.",
                "howTo": "1. Prenda a caneleira na polia baixa e segure na máquina para equilíbrio.\n2. Eleve a perna para o lado o máximo que conseguir sem inclinar o tronco.\n3. Retorne devagar mantendo a tensão no cabo.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Standing Hip Abduction (Cable)",
                "description": "Works hip stability and the lateral glute unilaterally.",
                "howTo": "1. Attach an ankle strap to the low pulley and hold the machine for balance.\n2. Raise your leg to the side as far as possible without tilting your torso.\n3. Return slowly while maintaining tension on the cable.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Abducción de Cadera de Pie (Polea)",
                "description": "Trabaja la estabilidad de la cadera y el glúteo lateral de forma unilateral.",
                "howTo": "1. Sujeta la tobillera en la polea baja y apóyate en la máquina para equilibrar.\n2. Eleva la pierna hacia el lado lo más que puedas sin inclinar el tronco.\n3. Regresa despacio manteniendo la tensión en el cable.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 362,
        "name": "lying_hip_abduction_cable",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Abdução de Quadril Deitado (Polia)",
                "description": "Variação que oferece um grande alongamento inicial e tensão constante.",
                "howTo": "1. Deite-se no chão de lado para a polia baixa com a caneleira na perna de cima.\n2. Eleve a perna em direção ao teto.\n3. Controle a descida sentindo o músculo alongar.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Lying Hip Abduction (Cable)",
                "description": "Variation offering a deep initial stretch and constant tension.",
                "howTo": "1. Lie on the floor sideways to the low pulley with the strap on the top leg.\n2. Lift your leg toward the ceiling.\n3. Control the descent, feeling the muscle stretch.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Abducción de Cadera Tumbado (Polea)",
                "description": "Variación que ofrece un gran estiramiento inicial y tensión constante.",
                "howTo": "1. Túmbate de lado hacia la polea baja con la tobillera en la pierna de arriba.\n2. Eleva la pierna hacia el techo.\n3. Controla el descenso sintiendo el estiramiento muscular.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 363,
        "name": "side_lying_leg_raise",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Elevação de Perna Deitado de Lado",
                "description": "Exercício de isolamento simples, excelente para treinos em casa.",
                "howTo": "1. Deite-se de lado com as pernas esticadas.\n2. Eleve a perna de cima mantendo o pé apontado para a frente.\n3. Desça devagar sem relaxar a musculatura entre as repetições.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Peso Corporal",
                    "Em Casa",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Side Lying Leg Raise",
                "description": "Simple isolation exercise, excellent for home workouts.",
                "howTo": "1. Lie on your side with legs straight.\n2. Lift your top leg while keeping your foot pointed forward.\n3. Lower slowly without relaxing the muscles between reps.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Bodyweight",
                    "Home",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Elevación de Pierna Tumbado de Lado",
                "description": "Ejercicio de aislamiento simple, excelente para entrenar en casa.",
                "howTo": "1. Túmbate de lado con las piernas estiradas.\n2. Eleva la pierna de arriba manteniendo el pie apuntando hacia adelante.\n3. Baja despacio sin relajar la musculatura entre repeticiones.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Peso Corporal",
                    "En Casa",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 364,
        "name": "clamshells",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
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
                "name": "Abertura de Concha (Glúteo)",
                "description": "Fundamental para ativação do glúteo médio e saúde do joelho.",
                "howTo": "1. Deite-se de lado com joelhos dobrados e calcanhares juntos.\n2. Abra o joelho de cima como uma ostra, sem girar o quadril para trás.\n3. Sinta a contração na lateral do glúteo e feche devagar.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Clamshells",
                "description": "Fundamental for gluteus medius activation and knee health.",
                "howTo": "1. Lie on your side with knees bent and heels together.\n2. Open your top knee like a clam, without rotating your hips backward.\n3. Feel the contraction on the side of the glute and close slowly.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Apertura de Almeja (Glúteos)",
                "description": "Fundamental para la activación do glúteo medio y salud de la rodilla.",
                "howTo": "1. Túmbate de lado con rodillas dobladas y talones juntos.\n2. Abre la rodilla de arriba como una almeja, sin girar la cadera atrás.\n3. Siente la contracción en el lateral del glúteo y cierra despacio.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 366,
        "name": "banded_lateral_walk",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
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
                "name": "Passada Lateral com Elástico",
                "description": "Ativação dinâmica essencial para estabilidade pélvica.",
                "howTo": "1. Coloque um elástico nos tornozelos ou acima dos joelhos.\n2. Em posição de meio agachamento, dê passos laterais mantendo a tensão.\n3. Mantenha os joelhos alinhados com os pés, sem deixá-los cair para dentro.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Composto"
                ]
            },
            "en": {
                "name": "Banded Lateral Walk",
                "description": "Dynamic activation essential for pelvic stability.",
                "howTo": "1. Place a resistance band around your ankles or above your knees.\n2. In a half-squat position, take lateral steps while maintaining tension.\n3. Keep your knees aligned with your feet, don't let them cave in.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Compound"
                ]
            },
            "es": {
                "name": "Pasos Laterales con Banda",
                "description": "Activación dinámica esencial para la estabilidad pélvica.",
                "howTo": "1. Coloca una banda elástica en los tobillos o sobre las rodillas.\n2. En media sentadilla, da pasos laterales manteniendo la tensión.\n3. Mantén las rodillas alineadas con los pies, sin que se cierren.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 367,
        "name": "banded_monster_walk",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
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
                "name": "Caminhada Monstro com Elástico",
                "description": "Fortalece abdutores e glúteos em movimento diagonal.",
                "howTo": "1. Com o elástico nas pernas, afaste os pés na largura dos ombros.\n2. Caminhe para a frente em passos diagonais (como um monstro).\n3. Mantenha sempre a tensão no elástico durante o trajeto.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Composto"
                ]
            },
            "en": {
                "name": "Banded Monster Walk",
                "description": "Strengthens abductors and glutes in a diagonal movement.",
                "howTo": "1. With the band on your legs, set feet shoulder-width apart.\n2. Walk forward in diagonal steps (like a monster).\n3. Always maintain tension on the band during the movement.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Compound"
                ]
            },
            "es": {
                "name": "Paso de Monstruo con Banda",
                "description": "Fortalece abductores y glúteos en movimiento diagonal.",
                "howTo": "1. Con la banda en as piernas, separa los pies al ancho de hombros.\n2. Camina hacia adelante dando pasos diagonales (como un monstruo).\n3. Mantén siempre la tensión en la banda durante el trayecto.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 368,
        "name": "banded_seated_abduction",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Abdução Sentada com Elástico",
                "description": "Variação de alta repetição para gerar 'pump' e exaustão muscular.",
                "howTo": "1. Sente-se na borda de um banco com o elástico acima dos joelhos.\n2. Afaste os joelhos o máximo possível contra a resistência.\n3. Segure um segundo na abertura máxima e feche devagar.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Banded Seated Abduction",
                "description": "High-repetition variation to generate a pump and muscle exhaustion.",
                "howTo": "1. Sit on the edge of a bench with the band above your knees.\n2. Spread your knees as far as possible against the resistance.\n3. Hold for a second at maximum width and close slowly.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Abducción Sentado con Banda",
                "description": "Variación de altas repeticiones para generar bombeo y fatiga muscular.",
                "howTo": "1. Siéntate en el borde de un banco con la banda sobre las rodillas.\n2. Separa las rodillas lo máximo posible contra la resistencia.\n3. Aguanta un segundo en la apertura máxima y cierra despacio.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 369,
        "name": "curtsy_lunge_bodyweight",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "quadriceps",
            "core"
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
                "name": "Afundo Cruzado / Reverência",
                "description": "Variação dinâmica que exige muito da estabilização lateral.",
                "howTo": "1. Dê um passo para trás cruzando a perna por trás da perna de apoio.\n2. Desça o joelho em direção ao chão.\n3. Empurre com o calcanhar da frente para voltar à posição inicial.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Curtsy Lunge Bodyweight",
                "description": "Dynamic variation that challenges lateral stabilization.",
                "howTo": "1. Step back, crossing one leg behind the standing leg.\n2. Lower your knee toward the floor.\n3. Push through the front heel to return to the starting position.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Zancadas Cruzadas (Peso Corporal)",
                "description": "Variación dinámica que exige mucha estabilización lateral.",
                "howTo": "1. Da un paso atrás cruzando una pierna tras la pierna de apoyo.\n2. Baja la rodilla hacia el suelo.\n3. Empuja con el talón delantero para volver a la posición inicial.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 370,
        "name": "side_plank_with_leg_lift",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
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
                "name": "Prancha Lateral com Elevação de Perna",
                "description": "Exercício avançado que combina força do core e dos abdutores.",
                "howTo": "1. Em posição de prancha lateral, sustente o corpo.\n2. Eleve a perna de cima mantendo-a esticada.\n3. Mantenha o quadril alto e não deixe o corpo rodar.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Side Plank With Leg Lift",
                "description": "Advanced exercise combining core strength and abductor work.",
                "howTo": "1. In a side plank position, support your body weight.\n2. Lift your top leg while keeping it straight.\n3. Keep your hips high and do not let your body rotate.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Plancha Lateral con Elevación de Pierna",
                "description": "Ejercicio avanzado que combina fuerza del core y de abductores.",
                "howTo": "1. En posición de plancha lateral, sostén el cuerpo.\n2. Eleva la pierna de arriba manteniéndola estirada.\n3. Mantén la cadera alta y no dejes que el cuerpo rote.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 549,
        "name": "hip_abduction_machine",
        "category": "abductors",
        "secondaryMuscles": [
            "glutes",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Cadeira Abdutora (Máquina)",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento.",
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "tags": [
                    "Glúteo Médio",
                    "Glúteo Externo",
                    "Pernas",
                    "Quadril",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Hip Abduction (Machine)",
                "description": "Technical execution for Machine Hip Abduction.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Glute Medius",
                    "Outer Glute",
                    "Legs",
                    "Hips",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Máquina de Abductores",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Glúteo Medio",
                    "Glúteo Externo",
                    "Piernas",
                    "Cadera",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    }
];
