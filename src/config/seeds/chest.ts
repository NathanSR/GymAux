import { Exercise } from '../types';

export const CHEST_EXERCISES: Exercise[] = [
    {
        "id": 1,
        "name": "Flexão de Braços",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "/exercises/peitoral/flexão_pushup.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão de Braços",
                "description": "Exercício fundamental para força e estabilidade do peitoral médio.",
                "howTo": "1. Mãos alinhadas aos ombros.\n2. Corpo reto como uma prancha.\n3. Desça até o peito quase tocar o chão e empurre.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Standard Push Up",
                "description": "Fundamental exercise for mid-chest strength and stability.",
                "howTo": "1. Hands shoulder-width apart.\n2. Keep body straight as a plank.\n3. Lower until chest nearly touches the floor and push back up.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones de Pecho",
                "description": "Ejercicio fundamental para la fuerza y estabilidad del pectoral medio.",
                "howTo": "1. Manos alineadas con los hombros.\n2. Cuerpo recto como una tabla.\n3. Baja hasta que el pecho casi toque el suelo y empuja.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 2,
        "name": "Flexão Declinada",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Declinada",
                "description": "Variação com foco na porção superior (clavicular) do peito.",
                "howTo": "1. Pés em uma superfície elevada (banco).\n2. Mãos no chão.\n3. Desça controladamente focando na parte alta do peito.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Decline Push Up",
                "description": "Variation targeting the upper (clavicular) chest.",
                "howTo": "1. Feet on an elevated surface (bench).\n2. Hands on the floor.\n3. Lower with control focusing on the upper chest fibers.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Declinadas",
                "description": "Variación enfocada en la porción superior (clavicular) del pecho.",
                "howTo": "1. Pies en una superficie elevada (banco).\n2. Manos en el suelo.\n3. Baja controladamente enfocando la parte alta del pecho.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 3,
        "name": "Flexão Inclinada",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Inclinada",
                "description": "Variação mais leve com foco na parte inferior do peito.",
                "howTo": "1. Mãos em uma superfície elevada (banco/mesa).\n2. Pés no chão.\n3. Desça o peito em direção ao suporte.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Push Up",
                "description": "Lighter variation focusing on the lower chest.",
                "howTo": "1. Hands on an elevated surface (bench/table).\n2. Feet on the floor.\n3. Lower your chest toward the support and push back.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Inclinadas",
                "description": "Variación más ligera enfocada en la parte inferior del pecho.",
                "howTo": "1. Manos en una superficie elevada (banco/mesa).\n2. Pies en el suelo.\n3. Baja el pecho hacia el soporte y empuja.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 4,
        "name": "Flexão Diamante",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 1,
        "imageUrl": "/exercises/peitoral/flexao_diamante.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Diamante",
                "description": "Foco no tríceps e na parte interna do peito.",
                "howTo": "1. Junte as mãos formando um diamante com os dedos.\n2. Mantenha os cotovelos próximos ao corpo.\n3. Desça e empurre focando no miolo do peito.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Diamond Push Up",
                "description": "Targets the triceps and the inner chest line.",
                "howTo": "1. Place hands together forming a diamond shape with fingers.\n2. Keep elbows close to the ribs.\n3. Lower and push focusing on the chest center.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Diamante",
                "description": "Enfocado en los tríceps y la parte interna del pecho.",
                "howTo": "1. Junta las manos formando un diamante con los dedos.\n2. Mantén los codos cerca del cuerpo.\n3. Baja y empuja enfocando el centro del pecho.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 5,
        "name": "Flexão Aberta",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Aberta",
                "description": "Enfatiza a parte externa e a largura do peitoral.",
                "howTo": "1. Posicione as mãos bem além da linha dos ombros.\n2. Desça mantendo o peito aberto.\n3. Sinta o alongamento lateral ao subir.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Wide Push Up",
                "description": "Emphasizes the outer chest and pectoral width.",
                "howTo": "1. Position hands well beyond shoulder width.\n2. Lower while keeping the chest open.\n3. Feel the lateral stretch as you push up.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Abiertas",
                "description": "Enfatiza la parte externa y el ancho del pectoral.",
                "howTo": "1. Posiciona las manos más allá del ancho de los hombros.\n2. Baja manteniendo el pecho abierto.\n3. Siente el estiramiento lateral al subir.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 6,
        "name": "Flexão Arqueiro",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Arqueiro",
                "description": "Exercício avançado para força unilateral.",
                "howTo": "1. Braços bem abertos.\n2. Desça sobre um braço enquanto o outro estende.\n3. Alterne os lados em cada repetição.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Archer Push Up",
                "description": "Advanced exercise for unilateral strength.",
                "howTo": "1. Arms wide apart.\n2. Lower onto one arm while the other stays straight.\n3. Alternate sides for each repetition.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Flexiones Arquero",
                "description": "Ejercicio avanzado para fuerza unilateral.",
                "howTo": "1. Brazos bien abiertos.\n2. Baja sobre un brazo mientras el otro se estira.\n3. Alterna los lados en cada repetición.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 7,
        "name": "Flexão Explosiva",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Explosiva",
                "description": "Desenvolve potência e recrutamento de fibras rápidas.",
                "howTo": "1. Desça normalmente.\n2. Empurre o chão com força máxima para as mãos perderem o contato.\n3. Amorteça a queda com os cotovelos semi-flexionados.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Explosive Push Up",
                "description": "Builds power and recruits fast-twitch fibers.",
                "howTo": "1. Lower normally.\n2. Push off the floor with max force so hands leave the ground.\n3. Cushion the landing with soft elbows.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Explosivas",
                "description": "Desarrolla potencia y recluta fibras de contracción rápida.",
                "howTo": "1. Baja normalmente.\n2. Empuja el suelo con fuerza máxima para despegar las manos.\n3. Amortigua la caída con los codos semiflexionados.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 8,
        "name": "Paralelas (Peito)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
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
                "name": "Paralelas (Peito)",
                "description": "Excelente para a linha inferior e contorno do peitoral.",
                "howTo": "1. Segure as barras e incline o tronco para frente.\n2. Afaste os cotovelos lateralmente.\n3. Desça até sentir o alongamento e suba.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chest Dips",
                "description": "Powerful strength move for the lower chest contour.",
                "howTo": "1. Hold the bars and lean your torso forward.\n2. Flare elbows out slightly.\n3. Lower until you feel a deep stretch and push up.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Fondos en Paralelas (Pecho)",
                "description": "Poderoso ejercicio de fuerza para la base del pectoral.",
                "howTo": "1. Sujeta las barras e inclina el torso hacia adelante.\n2. Abre los codos hacia afuera.\n3. Baja hasta sentir el estiramiento y sube.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 9,
        "name": "Flexão Homem-Aranha",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 1,
        "imageUrl": "/exercises/core/prancha_spiderman.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Homem-Aranha",
                "description": "Trabalha peito, core e mobilidade de quadril.",
                "howTo": "1. Durante a descida, leve um joelho em direção ao cotovelo.\n2. Mantenha o corpo paralelo ao chão.\n3. Alterne a perna a cada repetição.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Spiderman Push Up",
                "description": "Works chest, core, and hip mobility.",
                "howTo": "1. While lowering, bring one knee toward the elbow.\n2. Keep the body parallel to the floor.\n3. Alternate legs with each rep.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones Spiderman",
                "description": "Trabaja pecho, core y movilidad de cadera.",
                "howTo": "1. Al bajar, lleva una rodilla hacia el codo.\n2. Mantén el cuerpo paralelo al suelo.\n3. Alterna la pierna en cada repetición.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 10,
        "name": "Supino Reto (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/peitoral/supino_reto_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Reto (Barra)",
                "description": "O padrão ouro para construção de massa no peito.",
                "howTo": "1. Deite no banco e segure a barra além da largura dos ombros.\n2. Desça a barra até o meio do esterno.\n3. Empurre até estender os braços.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bench Press (Barbell)",
                "description": "The gold standard for building chest mass.",
                "howTo": "1. Lie on the bench and grip the bar wider than shoulders.\n2. Lower bar to mid-sternum.\n3. Drive the bar up until arms are fully extended.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Plano (Barra)",
                "description": "El estándar de oro para construir masa en el pecho.",
                "howTo": "1. Túmbate y agarra la barra más allá del ancho de hombros.\n2. Baja la barra hasta el centro del esternón.\n3. Empuja hasta extender los brazos.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 11,
        "name": "Supino Inclinado (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "/exercises/peitoral/supino_inclinado_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Inclinado (Barra)",
                "description": "Foco no preenchimento da parte superior do peito.",
                "howTo": "1. Banco inclinado a 30-45 graus.\n2. Desça a barra na parte alta do peito (perto da clavícula).\n3. Empurre verticalmente.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Press (Barbell)",
                "description": "Focuses on filling out the upper chest area.",
                "howTo": "1. Bench at 30-45 degrees.\n2. Lower the bar to the upper chest (near collarbone).\n3. Push vertically.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Inclinado (Barra)",
                "description": "Enfocado en llenar la parte superior del pecho.",
                "howTo": "1. Banco inclinado a 30-45 grados.\n2. Baja la barra a la parte alta del pecho.\n3. Empuja verticalmente.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 12,
        "name": "Supino Declinado (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "/exercises/peitoral/suplino_declinado_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Declinado (Barra)",
                "description": "Foco na porção inferior e força máxima.",
                "howTo": "1. Prenda os pés e deite no banco declinado.\n2. Desça a barra na linha inferior do peito.\n3. Empurre com controle.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Decline Press (Barbell)",
                "description": "Targets the lower portion and allows for maximum weight.",
                "howTo": "1. Secure feet and lie on the decline bench.\n2. Lower bar to the lower chest line.\n3. Push with control.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Declinado (Barra)",
                "description": "Enfocado en la porción inferior y fuerza máxima.",
                "howTo": "1. Sujeta los pies y túmbate en el banco declinado.\n2. Baja la barra a la línea inferior del pecho.\n3. Empuja con control.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 13,
        "name": "Supino Fechado (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "/exercises/triceps/supino_fechado_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Fechado (Barra)",
                "description": "Enfatiza o tríceps e a separação interna do peito.",
                "howTo": "1. Mãos na largura dos ombros ou menos.\n2. Cotovelos raspando as costelas na descida.\n3. Foque na contração do miolo ao subir.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Close Grip Press (Barbell)",
                "description": "Emphasizes triceps and inner chest separation.",
                "howTo": "1. Hands shoulder-width or closer.\n2. Elbows brushing the ribs on the way down.\n3. Focus on squeezing the center at the top.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Agarre Cerrado (Barra)",
                "description": "Enfatiza tríceps y la separación interna del pecho.",
                "howTo": "1. Manos al ancho de hombros o menos.\n2. Codos rozando las costillas al bajar.\n3. Enfócate en apretar el centro al subir.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 14,
        "name": "Supino no Chão (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino no Chão (Barra)",
                "description": "Ótimo para explosão e para quem tem dores no ombro.",
                "howTo": "1. Deitado no chão com joelhos dobrados.\n2. Desça até o tríceps tocar levemente o solo.\n3. Empurre explosivamente a partir da inércia.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Floor Press (Barbell)",
                "description": "Great for power and shoulder-friendly training.",
                "howTo": "1. Lie on the floor with knees bent.\n2. Lower until triceps lightly touch the ground.\n3. Explode up from the dead stop.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Suelo (Barra)",
                "description": "Ideal para potencia y salud del hombro.",
                "howTo": "1. Tumbado en el suelo con rodillas dobladas.\n2. Baja hasta que el tríceps toque ligeramente el suelo.\n3. Empuja explosivamente.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 15,
        "name": "Supino Reto (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
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
                "name": "Supino Reto (Halteres)",
                "description": "Permite maior amplitude e correção de assimetrias.",
                "howTo": "1. Deitado no banco, inicie com halteres no alto.\n2. Desça até os halteres ficarem ao lado do peito.\n3. Suba unindo-os no centro.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bench Press (Dumbbell)",
                "description": "Allows for greater range of motion and symmetry.",
                "howTo": "1. Lie on bench, start with dumbbells high.\n2. Lower until dumbbells are at chest level.\n3. Drive up and bring them together at the center.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Plano (Mancuernas)",
                "description": "Permite mayor rango de movimiento y simetría.",
                "howTo": "1. Tumbado, inicia con mancuernas arriba.\n2. Baja hasta que estén al lado del pecho.\n3. Sube uniéndolas en el centro.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 16,
        "name": "Supino Inclinado (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 15,
        "imageUrl": "/exercises/peitoral/supino_inclinado_halteres.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Inclinado (Halteres)",
                "description": "Essencial para o volume superior com maior amplitude.",
                "howTo": "1. Banco inclinado.\n2. Mantenha os halteres alinhados à parte superior do peito.\n3. Empurre em arco para o centro.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Press (Dumbbell)",
                "description": "Essential for upper volume with better range of motion.",
                "howTo": "1. Incline bench setup.\n2. Keep dumbbells aligned with upper chest.\n3. Push in an arc toward the center.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Inclinado (Mancuernas)",
                "description": "Esencial para volumen superior con mayor rango.",
                "howTo": "1. Banco inclinado.\n2. Mantén las mancuernas alineadas con el pecho superior.\n3. Empuja en arco hacia el centro.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 17,
        "name": "Supino Declinado (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 15,
        "imageUrl": "/exercises/peitoral/supino_declinado_halteres.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Declinado (Halteres)",
                "description": "Foco inferior com conforto articular dos halteres.",
                "howTo": "1. Banco declinado.\n2. Mantenha o controle para não deixar os halteres irem para o rosto.\n3. Empurre focando na parte baixa.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Decline Press (Dumbbell)",
                "description": "Lower chest focus with dumbbell joint comfort.",
                "howTo": "1. Decline bench setup.\n2. Control the weight so it stays over the chest.\n3. Push focusing on the lower fibers.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Declinado (Mancuernas)",
                "description": "Foco inferior con comodidad articular.",
                "howTo": "1. Banco declinado.\n2. Controla el peso sobre el pecho inferior.\n3. Empuja enfocando las fibras bajas.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 18,
        "name": "Supino com Rotação (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 15,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino com Rotação (Halteres)",
                "description": "Aumenta o recrutamento de fibras pela mudança de pegada.",
                "howTo": "1. Comece com pegada pronada (palmas para frente).\n2. Gire para pegada supinada (palmas para você) no topo.\n3. Aperte o peito intensamente no final.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Rotation Press (Dumbbell)",
                "description": "Increases fiber recruitment via grip change.",
                "howTo": "1. Start with palms facing forward.\n2. Rotate to palms facing you at the top.\n3. Squeeze the chest intensely at the peak.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Rotation Press (Mancuernas)",
                "description": "Aumenta el reclutamiento mediante el cambio de agarre.",
                "howTo": "1. Empieza con palmas hacia adelante.\n2. Gira a palmas hacia ti en la parte alta.\n3. Aprieta el pecho intensamente al final.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 19,
        "name": "Squeeze Press (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 15,
        "imageUrl": "/exercises/peitoral/squeeze_press_halteres.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Squeeze Press (Halteres)",
                "description": "O melhor para sentir a contração do miolo do peito.",
                "howTo": "1. Pressione um halter contra o outro o tempo todo.\n2. Faça o movimento de supino sem aliviar a pressão entre eles.\n3. Sinta a tensão constante no centro.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Squeeze Press (Dumbbell)",
                "description": "The best for feeling the inner chest contraction.",
                "howTo": "1. Press dumbbells together throughout the move.\n2. Perform the press without releasing tension between them.\n3. Feel constant inner-chest tension.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Squeeze Press (Mancuernas)",
                "description": "Lo mejor para sentir la contracción interna del pecho.",
                "howTo": "1. Presiona una mancuerna contra la otra siempre.\n2. Haz el press sin soltar la presión entre ellas.\n3. Siente la tensión constante en el centro.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 20,
        "name": "Crucifixo Reto (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/peitoral/crucifixo_halteres.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crucifixo Reto (Halteres)",
                "description": "Isolamento focado no alongamento das fibras.",
                "howTo": "1. Deitado, braços semi-flexionados.\n2. Abra os braços lateralmente como se fosse abraçar uma árvore.\n3. Retorne sentindo o peito esmagar.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Flat Fly (Dumbbell)",
                "description": "Isolation exercise focused on muscle stretch.",
                "howTo": "1. Lie flat with slightly bent arms.\n2. Open arms wide as if hugging a large tree.\n3. Return while squeezing the chest together.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Aperturas Planas (Mancuernas)",
                "description": "Aislamiento enfocado en el estiramiento de las fibras.",
                "howTo": "1. Tumbado, brazos semiflexionados.\n2. Abre los brazos como si abrazaras un árbol grande.\n3. Regresa apretando el pecho.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 21,
        "name": "Crucifixo Inclinado (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crucifixo Inclinado (Halteres)",
                "description": "Alongamento focado na porção clavicular.",
                "howTo": "1. Banco inclinado.\n2. Abra os braços lateralmente mantendo a curvatura leve no cotovelo.\n3. Junte os halteres sobre o rosto.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Incline Fly (Dumbbell)",
                "description": "Stretch focused on the clavicular portion.",
                "howTo": "1. Incline bench setup.\n2. Open arms laterally with a slight elbow bend.\n3. Bring dumbbells together over the face.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Aperturas Inclinadas (Mancuernas)",
                "description": "Estiramiento enfocado en la porción clavicular.",
                "howTo": "1. Banco inclinado.\n2. Abre los brazos lateralmente con codos algo doblados.\n3. Junta las mancuernas sobre la cara.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 22,
        "name": "Crossover (Polia Alta)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/peitoral/crucifixo_crossover_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crossover (Polia Alta)",
                "description": "Foco na definição da parte inferior do peitoral.",
                "howTo": "1. Polias no ponto mais alto.\n2. Traga os cabos de cima para baixo cruzando à frente da cintura.\n3. Aperte a musculatura embaixo.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Crossover High (Cable)",
                "description": "Focus on lower chest definition.",
                "howTo": "1. Pulleys at the top.\n2. Pull cables down and forward across the waist.\n3. Squeeze the muscles at the bottom.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Cruce de Poleas (Polea Alta)",
                "description": "Foco en la definición de la parte inferior.",
                "howTo": "1. Poleas arriba.\n2. Trae los cables hacia abajo y adelante de la cintura.\n3. Aprieta el músculo abajo.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 23,
        "name": "Crossover (Polia Média)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 22,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crossover (Polia Média)",
                "description": "Trabalha a parte central do peitoral com tensão constante.",
                "howTo": "1. Polias na altura dos ombros.\n2. Una as mãos à frente do peito.\n3. Mantenha o tronco estável e evite balançar.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Crossover Mid (Cable)",
                "description": "Works the mid-chest with constant cable tension.",
                "howTo": "1. Pulleys at shoulder height.\n2. Bring hands together in front of chest.\n3. Maintain a stable torso, avoid swinging.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Cruce de Poleas (Polea Media)",
                "description": "Trabaja la parte central con tensión constante.",
                "howTo": "1. Poleas a la altura de hombros.\n2. Une las manos frente al pecho.\n3. Mantén el torso estable sin balanceos.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 24,
        "name": "Crossover (Polia Baixa)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 22,
        "imageUrl": "/exercises/peitoral/crossover_pullover_polia.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crossover (Polia Baixa)",
                "description": "Excelente para desenhar a parte superior e interna.",
                "howTo": "1. Polias no ponto mais baixo.\n2. Traga os cabos de baixo para cima até a altura do queixo.\n3. Foque na contração da parte superior.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Crossover Low (Cable)",
                "description": "Excellent for upper and inner chest shape.",
                "howTo": "1. Pulleys at the bottom.\n2. Bring cables up and forward to chin height.\n3. Focus on upper chest contraction.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Cruce de Poleas (Polea Baja)",
                "description": "Excelente para dar forma superior e interna.",
                "howTo": "1. Poleas abajo.\n2. Trae los cables hacia arriba hasta la barbilla.\n3. Enfócate en la contracción superior.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 25,
        "name": "Voador / Pec Deck (Máquina)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/peitoral/voador_peckdeck.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Voador / Pec Deck (Máquina)",
                "description": "Máquina clássica para isolamento e falha muscular segura.",
                "howTo": "1. Costas bem apoiadas.\n2. Una os suportes à frente do peito.\n3. Controle a volta para não deixar as placas baterem.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Pec Deck Fly (Machine)",
                "description": "Classic machine for isolation and safe failure.",
                "howTo": "1. Back flat against the pad.\n2. Bring handles together in front of chest.\n3. Control the return so plates don't crash.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Contractor / Pec Deck (Máquina)",
                "description": "Máquina clásica para aislamiento y fallo seguro.",
                "howTo": "1. Espalda bien apoyada.\n2. Une los soportes frente al pecho.\n3. Controla el regreso sin golpear las placas.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 26,
        "name": "Crucifixo (Máquina)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
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
                "name": "Crucifixo (Máquina)",
                "description": "Similar ao voador, mas com braços estendidos para maior alavanca.",
                "howTo": "1. Ajuste os braços da máquina.\n2. Mantenha cotovelos levemente flexionados.\n3. Feche o arco focando na contração interna.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Máquina",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Fly (Machine)",
                "description": "Similar to pec deck but with straight arms for leverage.",
                "howTo": "1. Adjust the machine arms.\n2. Keep elbows slightly bent.\n3. Close the arc focusing on the inner contraction.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Machine",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Fly (Máquina)",
                "description": "Similar al pec deck pero con brazos estirados.",
                "howTo": "1. Ajusta los brazos de la máquina.\n2. Mantén codos algo flexionados.\n3. Cierra el arco enfocando la contracción interna.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Máquina",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 27,
        "name": "Supino Reto (Máquina)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
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
                "name": "Supino Reto (Máquina)",
                "description": "Segurança total para treinar com cargas altas até a falha.",
                "howTo": "1. Ajuste o assento para que as manoplas fiquem na linha do peito.\n2. Empurre as manoplas.\n3. Controle o retorno mantendo a tensão.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Chest Press (Machine)",
                "description": "Safe way to train with heavy loads to failure.",
                "howTo": "1. Adjust seat so handles are at chest level.\n2. Push the handles forward.\n3. Control the return maintaining tension.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Pecho (Máquina)",
                "description": "Seguridad total para cargas pesadas.",
                "howTo": "1. Ajusta el asiento a la línea del pecho.\n2. Empuja los agarres hacia adelante.\n3. Controla el retorno manteniendo la tensión.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 28,
        "name": "Supino Reto (Smith)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "smith",
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
                "name": "Supino Reto (Smith)",
                "description": "A estabilidade da barra guiada permite focar apenas no músculo.",
                "howTo": "1. Posicione o banco sob a barra guiada.\n2. Desça com controle até quase tocar o peito.\n3. Empurre focando na conexão mente-músculo.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Press (Smith Machine)",
                "description": "Guided bar stability allows focus on muscle squeeze.",
                "howTo": "1. Position bench under the guided bar.\n2. Lower with control until near chest.\n3. Drive up focusing on mind-muscle connection.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Press de Banca Plano (Smith)",
                "description": "Barra guiada que permite enfocarse solo en el pecho.",
                "howTo": "1. Banco bajo la barra guiada.\n2. Baja con control hasta casi tocar el pecho.\n3. Empuja enfocando la conexión mente-músculo.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 29,
        "name": "Landmine Press (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "/exercises/costas/prensa_unilateral_barra.png",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Landmine Press (Barra)",
                "description": "Ângulo único para parte superior e proteção do ombro.",
                "howTo": "1. Barra presa no canto ou suporte landmine.\n2. Segure a ponta da barra com uma ou duas mãos.\n3. Empurre para frente e para cima em diagonal.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Landmine Press (Barbell)",
                "description": "Unique angle for upper chest and shoulder health.",
                "howTo": "1. Barbell in a corner or landmine attachment.\n2. Hold the end with one or both hands.\n3. Press forward and up in a diagonal line.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Landmine Press (Barra)",
                "description": "Ángulo único para pecho superior y salud de hombros.",
                "howTo": "1. Barra en esquina o soporte landmine.\n2. Sujeta el extremo con una o dos manos.\n3. Empuja hacia adelante y arriba en diagonal.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 30,
        "name": "Pullover (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "back",
            "triceps",
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
                "name": "Pullover (Halteres)",
                "description": "Trabalha a expansão torácica e o serrátil/peitoral.",
                "howTo": "1. Deite perpendicular ao banco (apenas ombros apoiados).\n2. Leve o halter para trás da cabeça alongando tudo.\n3. Puxe de volta até a linha do rosto.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Pullover (Dumbbell)",
                "description": "Works ribcage expansion and serratus/chest.",
                "howTo": "1. Lie across bench (shoulders only supported).\n2. Lower dumbbell behind head stretching the torso.\n3. Pull back to face level.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Pullover (Mancuernas)",
                "description": "Expansión torácica y trabajo de serrato/pecho.",
                "howTo": "1. Tumbado perpendicular al banco.\n2. Lleva la mancuerna tras la cabeza estirando el torso.\n3. Tira de vuelta hasta la cara.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 31,
        "name": "Svendsen Press (Anilha)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "machine",
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
                "name": "Svendsen Press (Anilha)",
                "description": "Exercício isométrico que queima o miolo do peito.",
                "howTo": "1. Aperte uma anilha entre as palmas das mãos.\n2. Estenda os braços para frente mantendo a pressão.\n3. Retorne ao peito sem soltar a anilha.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Svendsen Press (Machine)",
                "description": "Isometric exercise that burns the inner chest.",
                "howTo": "1. Squeeze a plate between your palms.\n2. Extend arms forward while maintaining pressure.\n3. Return to chest without releasing the plate.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Svendsen Press (Máquina)",
                "description": "Ejercicio isométrico que quema el centro del pecho.",
                "howTo": "1. Aprieta un disco entre las palmas.\n2. Estira los brazos adelante manteniendo la presión.\n3. Regresa al pecho sin soltar el disco.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 500,
        "name": "Supino Reto (Polia)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Reto (Polia)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Bench Press (Cable)",
                "description": "Technical execution for Cable Bench Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Bench Press (Polea)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 501,
        "name": "Supino Inclinado (Smith)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "smith",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 11,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Inclinado (Smith)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Smith.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Press (Smith Machine)",
                "description": "Technical execution for Incline Smith Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Incline Press (Máquina Smith)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina Smith.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 502,
        "name": "Supino Inclinado (Polia)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 11,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Inclinado (Polia)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Press (Cable)",
                "description": "Technical execution for Incline Cable Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Incline Press (Polea)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 503,
        "name": "Supino Inclinado (Máquina)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 11,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Inclinado (Máquina)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Máquina.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Incline Press (Machine)",
                "description": "Technical execution for Incline Machine Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Incline Press (Máquina)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 504,
        "name": "Supino Declinado (Smith)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "smith",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 12,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Declinado (Smith)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Smith.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ]
            },
            "en": {
                "name": "Decline Press (Smith Machine)",
                "description": "Technical execution for Decline Smith Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ]
            },
            "es": {
                "name": "Decline Press (Máquina Smith)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina Smith.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 505,
        "name": "Supino Declinado (Máquina)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 12,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Declinado (Máquina)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Máquina.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ]
            },
            "en": {
                "name": "Decline Press (Machine)",
                "description": "Technical execution for Decline Machine Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ]
            },
            "es": {
                "name": "Decline Press (Máquina)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 506,
        "name": "Crucifixo Declinado (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crucifixo Declinado (Halteres)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Halteres.",
                "howTo": "1. Posicione o corpo com o peito aberto e escápulas travadas.\n2. Execute o movimento em arco trazendo as mãos em direção ao centro do peito.\n3. Retorne de forma lenta sentindo o alongamento do peitoral sem hiperextender os ombros.",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Isolado"
                ]
            },
            "en": {
                "name": "Decline Fly (Dumbbell)",
                "description": "Technical execution for Decline Dumbbell Fly.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Isolation"
                ]
            },
            "es": {
                "name": "Aperturas Declinadas (Mancuernas)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Mancuernas.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Aislamiento"
                ]
            }
        }
    },
    {
        "id": 516,
        "name": "Flexão com Carga",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "plate",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão com Carga",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Anilha",
                    "Composto"
                ]
            },
            "en": {
                "name": "Weighted Push Up (Plate)",
                "description": "Technical execution for Weighted Push Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Plate",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones con Lastre",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Disco",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 517,
        "name": "Flexão (Argolas)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão (Argolas)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Argolas.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Ring Push Up",
                "description": "Technical execution for Ring Push Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Flexiones (Anillas)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Anillas.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 518,
        "name": "Supino Unilateral (Halteres)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 10,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Supino Unilateral (Halteres)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Halteres.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Unilateral Bench Press (Dumbbell)",
                "description": "Technical execution for Unilateral Dumbbell Bench Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Unilateral Bench Press (Mancuernas)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Mancuernas.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 519,
        "name": "Guillotine Press (Barra)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 10,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Guillotine Press (Barra)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Barra.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ]
            },
            "en": {
                "name": "Guillotine Press (Barbell)",
                "description": "Technical execution for Guillotine Press.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ]
            },
            "es": {
                "name": "Guillotine Press (Barra)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Barra.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 520,
        "name": "Crucifixo Unilateral (Polia)",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Crucifixo Unilateral (Polia)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia.",
                "howTo": "1. Posicione o corpo com o peito aberto e escápulas travadas.\n2. Execute o movimento em arco trazendo as mãos em direção ao centro do peito.\n3. Retorne de forma lenta sentindo o alongamento do peitoral sem hiperextender os ombros.",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado",
                    "Unilateral"
                ]
            },
            "en": {
                "name": "Single Arm Fly (Cable)",
                "description": "Technical execution for Single Arm Cable Fly.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation",
                    "Unilateral"
                ]
            },
            "es": {
                "name": "Single Arm Fly (Polea)",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento",
                    "Unilateral"
                ]
            }
        }
    },
    {
        "id": 562,
        "name": "Flexão Pseudo-Prancha",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 1,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Flexão Pseudo-Prancha",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Pseudo Planche Push Up",
                "description": "Technical execution for Pseudo Planche Push Up.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Pseudo Planche Push Up",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    },
    {
        "id": 563,
        "name": "Paralelas (Argolas)",
        "category": "chest",
        "secondaryMuscles": [
            "triceps",
            "shoulders",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 8,
        "imageUrl": "null",
        "videoUrl": "null",
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "pt": {
                "name": "Paralelas (Argolas)",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Argolas.",
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ]
            },
            "en": {
                "name": "Ring Dips",
                "description": "Technical execution for Ring Dips.",
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ]
            },
            "es": {
                "name": "Ring Dips",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral.",
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ]
            }
        }
    }
];
