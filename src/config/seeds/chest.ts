import { Exercise } from '../types';

export const CHEST_EXERCISES: Exercise[] = [
    {
        "id": 1,
        "name": "standard_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/standard_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Standard Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Hands shoulder-width apart.\n2. Keep body straight as a plank.\n3. Lower until chest nearly touches the floor and push back up.",
                "description": "Fundamental exercise for mid-chest strength and stability."
            },
            "es": {
                "name": "Flexiones de Pecho",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Manos alineadas con los hombros.\n2. Cuerpo recto como una tabla.\n3. Baja hasta que el pecho casi toque el suelo y empuja.",
                "description": "Ejercicio fundamental para la fuerza y estabilidad del pectoral medio."
            },
            "pt": {
                "name": "Flexão de Braços",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Mãos alinhadas aos ombros.\n2. Corpo reto como uma prancha.\n3. Desça até o peito quase tocar o chão e empurre.",
                "description": "Exercício fundamental para força e estabilidade do peitoral médio."
            }
        }
    },
    {
        "id": 2,
        "name": "decline_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Push Up",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Feet on an elevated surface (bench).\n2. Hands on the floor.\n3. Lower with control focusing on the upper chest fibers.",
                "description": "Variation targeting the upper (clavicular) chest."
            },
            "es": {
                "name": "Flexiones Declinadas",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Pies en una superficie elevada (banco).\n2. Manos en el suelo.\n3. Baja controladamente enfocando la parte alta del pecho.",
                "description": "Variación enfocada en la porción superior (clavicular) del pecho."
            },
            "pt": {
                "name": "Flexão Declinada",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Pés em uma superfície elevada (banco).\n2. Mãos no chão.\n3. Desça controladamente focando na parte alta do peito.",
                "description": "Variação com foco na porção superior (clavicular) do peito."
            }
        }
    },
    {
        "id": 3,
        "name": "incline_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Push Up",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Hands on an elevated surface (bench/table).\n2. Feet on the floor.\n3. Lower your chest toward the support and push back.",
                "description": "Lighter variation focusing on the lower chest."
            },
            "es": {
                "name": "Flexiones Inclinadas",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Manos en una superficie elevada (banco/mesa).\n2. Pies en el suelo.\n3. Baja el pecho hacia el soporte y empuja.",
                "description": "Variación más ligera enfocada en la parte inferior del pecho."
            },
            "pt": {
                "name": "Flexão Inclinada",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Mãos em uma superfície elevada (banco/mesa).\n2. Pés no chão.\n3. Desça o peito em direção ao suporte.",
                "description": "Variação mais leve com foco na parte inferior do peito."
            }
        }
    },
    {
        "id": 5,
        "name": "wide_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/wide_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Wide Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Position hands well beyond shoulder width.\n2. Lower while keeping the chest open.\n3. Feel the lateral stretch as you push up.",
                "description": "Emphasizes the outer chest and pectoral width."
            },
            "es": {
                "name": "Flexiones Abiertas",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Posiciona las manos más allá del ancho de los hombros.\n2. Baja manteniendo el pecho abierto.\n3. Siente el estiramiento lateral al subir.",
                "description": "Enfatiza la parte externa y el ancho del pectoral."
            },
            "pt": {
                "name": "Flexão Aberta",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Posicione as mãos bem além da linha dos ombros.\n2. Desça mantendo o peito aberto.\n3. Sinta o alongamento lateral ao subir.",
                "description": "Enfatiza a parte externa e a largura do peitoral."
            }
        }
    },
    {
        "id": 6,
        "name": "archer_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/archer_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Archer Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Arms wide apart.\n2. Lower onto one arm while the other stays straight.\n3. Alternate sides for each repetition.",
                "description": "Advanced exercise for unilateral strength."
            },
            "es": {
                "name": "Flexiones Arquero",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Brazos bien abiertos.\n2. Baja sobre un brazo mientras el otro se estira.\n3. Alterna los lados en cada repetición.",
                "description": "Ejercicio avanzado para fuerza unilateral."
            },
            "pt": {
                "name": "Flexão Arqueiro",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Braços bem abertos.\n2. Desça sobre um braço enquanto o outro estende.\n3. Alterne os lados em cada repetição.",
                "description": "Exercício avançado para força unilateral."
            }
        }
    },
    {
        "id": 7,
        "name": "explosive_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/explosive_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Explosive Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Lower normally.\n2. Push off the floor with max force so hands leave the ground.\n3. Cushion the landing with soft elbows.",
                "description": "Builds power and recruits fast-twitch fibers."
            },
            "es": {
                "name": "Flexiones Explosivas",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Baja normalmente.\n2. Empuja el suelo con fuerza máxima para despegar las manos.\n3. Amortigua la caída con los codos semiflexionados.",
                "description": "Desarrolla potencia y recluta fibras de contracción rápida."
            },
            "pt": {
                "name": "Flexão Explosiva",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Desça normalmente.\n2. Empurre o chão com força máxima para as mãos perderem o contato.\n3. Amorteça a queda com os cotovelos semi-flexionados.",
                "description": "Desenvolve potência e recrutamento de fibras rápidas."
            }
        }
    },
    {
        "id": 8,
        "name": "chest_dips",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/chest_dips.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chest Dips",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Hold the bars and lean your torso forward.\n2. Flare elbows out slightly.\n3. Lower until you feel a deep stretch and push up.",
                "description": "Powerful strength move for the lower chest contour."
            },
            "es": {
                "name": "Fondos en Paralelas (Pecho)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta las barras e inclina el torso hacia adelante.\n2. Abre los codos hacia afuera.\n3. Baja hasta sentir el estiramiento y sube.",
                "description": "Poderoso ejercicio de fuerza para la base del pectoral."
            },
            "pt": {
                "name": "Paralelas (Peito)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Segure as barras e incline o tronco para frente.\n2. Afaste os cotovelos lateralmente.\n3. Desça até sentir o alongamento e suba.",
                "description": "Excelente para a linha inferior e contorno do peitoral."
            }
        }
    },
    {
        "id": 9,
        "name": "spiderman_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/spiderman_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Spiderman Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. While lowering, bring one knee toward the elbow.\n2. Keep the body parallel to the floor.\n3. Alternate legs with each rep.",
                "description": "Works chest, core, and hip mobility."
            },
            "es": {
                "name": "Flexiones Spiderman",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Al bajar, lleva una rodilla hacia el codo.\n2. Mantén el cuerpo paralelo al suelo.\n3. Alterna la pierna en cada repetición.",
                "description": "Trabaja pecho, core y movilidad de cadera."
            },
            "pt": {
                "name": "Flexão Homem-Aranha",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Durante a descida, leve um joelho em direção ao cotovelo.\n2. Mantenha o corpo paralelo ao chão.\n3. Alterne a perna a cada repetição.",
                "description": "Trabalha peito, core e mobilidade de quadril."
            }
        }
    },
    {
        "id": 10,
        "name": "barbell_bench_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/barbell_bench_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bench Press (Barbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Lie on the bench and grip the bar wider than shoulders.\n2. Lower bar to mid-sternum.\n3. Drive the bar up until arms are fully extended.",
                "description": "The gold standard for building chest mass."
            },
            "es": {
                "name": "Press de Banca Plano (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate y agarra la barra más allá del ancho de hombros.\n2. Baja la barra hasta el centro del esternón.\n3. Empuja hasta extender los brazos.",
                "description": "El estándar de oro para construir masa en el pecho."
            },
            "pt": {
                "name": "Supino Reto (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Deite no banco e segure a barra além da largura dos ombros.\n2. Desça a barra até o meio do esterno.\n3. Empurre até estender os braços.",
                "description": "O padrão ouro para construção de massa no peito."
            }
        }
    },
    {
        "id": 11,
        "name": "incline_barbell_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_barbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Press (Barbell)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Bench at 30-45 degrees.\n2. Lower the bar to the upper chest (near collarbone).\n3. Push vertically.",
                "description": "Focuses on filling out the upper chest area."
            },
            "es": {
                "name": "Press de Banca Inclinado (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Banco inclinado a 30-45 grados.\n2. Baja la barra a la parte alta del pecho.\n3. Empuja verticalmente.",
                "description": "Enfocado en llenar la parte superior del pecho."
            },
            "pt": {
                "name": "Supino Inclinado (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Banco inclinado a 30-45 graus.\n2. Desça a barra na parte alta do peito (perto da clavícula).\n3. Empurre verticalmente.",
                "description": "Foco no preenchimento da parte superior do peito."
            }
        }
    },
    {
        "id": 12,
        "name": "decline_barbell_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_barbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Press (Barbell)",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Secure feet and lie on the decline bench.\n2. Lower bar to the lower chest line.\n3. Push with control.",
                "description": "Targets the lower portion and allows for maximum weight."
            },
            "es": {
                "name": "Press de Banca Declinado (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta los pies y túmbate en el banco declinado.\n2. Baja la barra a la línea inferior del pecho.\n3. Empuja con control.",
                "description": "Enfocado en la porción inferior y fuerza máxima."
            },
            "pt": {
                "name": "Supino Declinado (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Prenda os pés e deite no banco declinado.\n2. Desça a barra na linha inferior do peito.\n3. Empurre com controle.",
                "description": "Foco na porção inferior e força máxima."
            }
        }
    },
    {
        "id": 13,
        "name": "close_grip_barbell_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/close_grip_barbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Close Grip Press (Barbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Hands shoulder-width or closer.\n2. Elbows brushing the ribs on the way down.\n3. Focus on squeezing the center at the top.",
                "description": "Emphasizes triceps and inner chest separation."
            },
            "es": {
                "name": "Press de Banca Agarre Cerrado (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Manos al ancho de hombros o menos.\n2. Codos rozando las costillas al bajar.\n3. Enfócate en apretar el centro al subir.",
                "description": "Enfatiza tríceps y la separación interna del pecho."
            },
            "pt": {
                "name": "Supino Fechado (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Mãos na largura dos ombros ou menos.\n2. Cotovelos raspando as costelas na descida.\n3. Foque na contração do miolo ao subir.",
                "description": "Enfatiza o tríceps e a separação interna do peito."
            }
        }
    },
    {
        "id": 14,
        "name": "barbell_floor_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/barbell_floor_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Floor Press (Barbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Lie on the floor with knees bent.\n2. Lower until triceps lightly touch the ground.\n3. Explode up from the dead stop.",
                "description": "Great for power and shoulder-friendly training."
            },
            "es": {
                "name": "Press de Suelo (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Tumbado en el suelo con rodillas dobladas.\n2. Baja hasta que el tríceps toque ligeramente el suelo.\n3. Empuja explosivamente.",
                "description": "Ideal para potencia y salud del hombro."
            },
            "pt": {
                "name": "Supino no Chão (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Deitado no chão com joelhos dobrados.\n2. Desça até o tríceps tocar levemente o solo.\n3. Empurre explosivamente a partir da inércia.",
                "description": "Ótimo para explosão e para quem tem dores no ombro."
            }
        }
    },
    {
        "id": 15,
        "name": "dumbbell_bench_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/dumbbell_bench_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bench Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Lie on bench, start with dumbbells high.\n2. Lower until dumbbells are at chest level.\n3. Drive up and bring them together at the center.",
                "description": "Allows for greater range of motion and symmetry."
            },
            "es": {
                "name": "Press de Banca Plano (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Tumbado, inicia con mancuernas arriba.\n2. Baja hasta que estén al lado del pecho.\n3. Sube uniéndolas en el centro.",
                "description": "Permite mayor rango de movimiento y simetría."
            },
            "pt": {
                "name": "Supino Reto (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Deitado no banco, inicie com halteres no alto.\n2. Desça até os halteres ficarem ao lado do peito.\n3. Suba unindo-os no centro.",
                "description": "Permite maior amplitude e correção de assimetrias."
            }
        }
    },
    {
        "id": 16,
        "name": "incline_dumbbell_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_dumbbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Incline bench setup.\n2. Keep dumbbells aligned with upper chest.\n3. Push in an arc toward the center.",
                "description": "Essential for upper volume with better range of motion."
            },
            "es": {
                "name": "Press de Banca Inclinado (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Banco inclinado.\n2. Mantén las mancuernas alineadas con el pecho superior.\n3. Empuja en arco hacia el centro.",
                "description": "Esencial para volumen superior con mayor rango."
            },
            "pt": {
                "name": "Supino Inclinado (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Banco inclinado.\n2. Mantenha os halteres alinhados à parte superior do peito.\n3. Empurre em arco para o centro.",
                "description": "Essencial para o volume superior com maior amplitude."
            }
        }
    },
    {
        "id": 17,
        "name": "decline_dumbbell_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_dumbbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Decline bench setup.\n2. Control the weight so it stays over the chest.\n3. Push focusing on the lower fibers.",
                "description": "Lower chest focus with dumbbell joint comfort."
            },
            "es": {
                "name": "Press de Banca Declinado (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Banco declinado.\n2. Controla el peso sobre el pecho inferior.\n3. Empuja enfocando las fibras bajas.",
                "description": "Foco inferior con comodidad articular."
            },
            "pt": {
                "name": "Supino Declinado (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Banco declinado.\n2. Mantenha o controle para não deixar os halteres irem para o rosto.\n3. Empurre focando na parte baixa.",
                "description": "Foco inferior com conforto articular dos halteres."
            }
        }
    },
    {
        "id": 18,
        "name": "dumbbell_rotation_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/dumbbell_rotation_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rotation Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Start with palms facing forward.\n2. Rotate to palms facing you at the top.\n3. Squeeze the chest intensely at the peak.",
                "description": "Increases fiber recruitment via grip change."
            },
            "es": {
                "name": "Rotation Press (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Empieza con palmas hacia adelante.\n2. Gira a palmas hacia ti en la parte alta.\n3. Aprieta el pecho intensamente al final.",
                "description": "Aumenta el reclutamiento mediante el cambio de agarre."
            },
            "pt": {
                "name": "Supino com Rotação (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Comece com pegada pronada (palmas para frente).\n2. Gire para pegada supinada (palmas para você) no topo.\n3. Aperte o peito intensamente no final.",
                "description": "Aumenta o recrutamento de fibras pela mudança de pegada."
            }
        }
    },
    {
        "id": 19,
        "name": "squeeze_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/squeeze_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Squeeze Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Isolation"
                ],
                "howTo": "1. Press dumbbells together throughout the move.\n2. Perform the press without releasing tension between them.\n3. Feel constant inner-chest tension.",
                "description": "The best for feeling the inner chest contraction."
            },
            "es": {
                "name": "Squeeze Press (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Aislamiento"
                ],
                "howTo": "1. Presiona una mancuerna contra la otra siempre.\n2. Haz el press sin soltar la presión entre ellas.\n3. Siente la tensión constante en el centro.",
                "description": "Lo mejor para sentir la contracción interna del pecho."
            },
            "pt": {
                "name": "Squeeze Press (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Isolado"
                ],
                "howTo": "1. Pressione um halter contra o outro o tempo todo.\n2. Faça o movimento de supino sem aliviar a pressão entre eles.\n3. Sinta a tensão constante no centro.",
                "description": "O melhor para sentir a contração do miolo do peito."
            }
        }
    },
    {
        "id": 20,
        "name": "flat_dumbbell_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/flat_dumbbell_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Flat Fly (Dumbbell)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Lie flat with slightly bent arms.\n2. Open arms wide as if hugging a large tree.\n3. Return while squeezing the chest together.",
                "description": "Isolation exercise focused on muscle stretch."
            },
            "es": {
                "name": "Aperturas Planas (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Tumbado, brazos semiflexionados.\n2. Abre los brazos como si abrazaras un árbol grande.\n3. Regresa apretando el pecho.",
                "description": "Aislamiento enfocado en el estiramiento de las fibras."
            },
            "pt": {
                "name": "Crucifixo Reto (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Deitado, braços semi-flexionados.\n2. Abra os braços lateralmente como se fosse abraçar uma árvore.\n3. Retorne sentindo o peito esmagar.",
                "description": "Isolamento focado no alongamento das fibras."
            }
        }
    },
    {
        "id": 21,
        "name": "incline_dumbbell_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_dumbbell_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Fly (Dumbbell)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Isolation"
                ],
                "howTo": "1. Incline bench setup.\n2. Open arms laterally with a slight elbow bend.\n3. Bring dumbbells together over the face.",
                "description": "Stretch focused on the clavicular portion."
            },
            "es": {
                "name": "Aperturas Inclinadas (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Aislamiento"
                ],
                "howTo": "1. Banco inclinado.\n2. Abre los brazos lateralmente con codos algo doblados.\n3. Junta las mancuernas sobre la cara.",
                "description": "Estiramiento enfocado en la porción clavicular."
            },
            "pt": {
                "name": "Crucifixo Inclinado (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Isolado"
                ],
                "howTo": "1. Banco inclinado.\n2. Abra os braços lateralmente mantendo a curvatura leve no cotovelo.\n3. Junte os halteres sobre o rosto.",
                "description": "Alongamento focado na porção clavicular."
            }
        }
    },
    {
        "id": 22,
        "name": "cable_crossover_high",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/cable_crossover_high.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Crossover High (Cable)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Pulleys at the top.\n2. Pull cables down and forward across the waist.\n3. Squeeze the muscles at the bottom.",
                "description": "Focus on lower chest definition."
            },
            "es": {
                "name": "Cruce de Poleas (Polea Alta)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Poleas arriba.\n2. Trae los cables hacia abajo y adelante de la cintura.\n3. Aprieta el músculo abajo.",
                "description": "Foco en la definición de la parte inferior."
            },
            "pt": {
                "name": "Crossover (Polia Alta)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Polias no ponto mais alto.\n2. Traga os cabos de cima para baixo cruzando à frente da cintura.\n3. Aperte a musculatura embaixo.",
                "description": "Foco na definição da parte inferior do peitoral."
            }
        }
    },
    {
        "id": 23,
        "name": "cable_crossover_mid",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 22,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/cable_crossover_mid.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Crossover Mid (Cable)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Pulleys at shoulder height.\n2. Bring hands together in front of chest.\n3. Maintain a stable torso, avoid swinging.",
                "description": "Works the mid-chest with constant cable tension."
            },
            "es": {
                "name": "Cruce de Poleas (Polea Media)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Poleas a la altura de hombros.\n2. Une las manos frente al pecho.\n3. Mantén el torso estable sin balanceos.",
                "description": "Trabaja la parte central con tensión constante."
            },
            "pt": {
                "name": "Crossover (Polia Média)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Polias na altura dos ombros.\n2. Una as mãos à frente do peito.\n3. Mantenha o tronco estável e evite balançar.",
                "description": "Trabalha a parte central do peitoral com tensão constante."
            }
        }
    },
    {
        "id": 24,
        "name": "cable_crossover_low",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 22,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/cable_crossover_low.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Crossover Low (Cable)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation"
                ],
                "howTo": "1. Pulleys at the bottom.\n2. Bring cables up and forward to chin height.\n3. Focus on upper chest contraction.",
                "description": "Excellent for upper and inner chest shape."
            },
            "es": {
                "name": "Cruce de Poleas (Polea Baja)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento"
                ],
                "howTo": "1. Poleas abajo.\n2. Trae los cables hacia arriba hasta la barbilla.\n3. Enfócate en la contracción superior.",
                "description": "Excelente para dar forma superior e interna."
            },
            "pt": {
                "name": "Crossover (Polia Baixa)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado"
                ],
                "howTo": "1. Polias no ponto mais baixo.\n2. Traga os cabos de baixo para cima até a altura do queixo.\n3. Foque na contração da parte superior.",
                "description": "Excelente para desenhar a parte superior e interna."
            }
        }
    },
    {
        "id": 25,
        "name": "pec_deck_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/pec_deck_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pec Deck Fly (Machine)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Back flat against the pad.\n2. Bring handles together in front of chest.\n3. Control the return so plates don't crash.",
                "description": "Classic machine for isolation and safe failure."
            },
            "es": {
                "name": "Contractor / Pec Deck (Máquina)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Espalda bien apoyada.\n2. Une los soportes frente al pecho.\n3. Controla el regreso sin golpear las placas.",
                "description": "Máquina clásica para aislamiento y fallo seguro."
            },
            "pt": {
                "name": "Voador / Pec Deck (Máquina)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Costas bem apoiadas.\n2. Una os suportes à frente do peito.\n3. Controle a volta para não deixar as placas baterem.",
                "description": "Máquina clássica para isolamento e falha muscular segura."
            }
        }
    },
    {
        "id": 26,
        "name": "machine_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/machine_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Fly (Machine)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Adjust the machine arms.\n2. Keep elbows slightly bent.\n3. Close the arc focusing on the inner contraction.",
                "description": "Similar to pec deck but with straight arms for leverage."
            },
            "es": {
                "name": "Fly (Máquina)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Ajusta los brazos de la máquina.\n2. Mantén codos algo flexionados.\n3. Cierra el arco enfocando la contracción interna.",
                "description": "Similar al pec deck pero con brazos estirados."
            },
            "pt": {
                "name": "Crucifixo (Máquina)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Ajuste os braços da máquina.\n2. Mantenha cotovelos levemente flexionados.\n3. Feche o arco focando na contração interna.",
                "description": "Similar ao voador, mas com braços estendidos para maior alavanca."
            }
        }
    },
    {
        "id": 27,
        "name": "machine_chest_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/machine_chest_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Chest Press (Machine)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Adjust seat so handles are at chest level.\n2. Push the handles forward.\n3. Control the return maintaining tension.",
                "description": "Safe way to train with heavy loads to failure."
            },
            "es": {
                "name": "Press de Pecho (Máquina)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Ajusta el asiento a la línea del pecho.\n2. Empuja los agarres hacia adelante.\n3. Controla el retorno manteniendo la tensión.",
                "description": "Seguridad total para cargas pesadas."
            },
            "pt": {
                "name": "Supino Reto (Máquina)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Ajuste o assento para que as manoplas fiquem na linha do peito.\n2. Empurre as manoplas.\n3. Controle o retorno mantendo a tensão.",
                "description": "Segurança total para treinar com cargas altas até a falha."
            }
        }
    },
    {
        "id": 28,
        "name": "smith_machine_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/smith_machine_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Press (Smith Machine)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Position bench under the guided bar.\n2. Lower with control until near chest.\n3. Drive up focusing on mind-muscle connection.",
                "description": "Guided bar stability allows focus on muscle squeeze."
            },
            "es": {
                "name": "Press de Banca Plano (Smith)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Banco bajo la barra guiada.\n2. Baja con control hasta casi tocar el pecho.\n3. Empuja enfocando la conexión mente-músculo.",
                "description": "Barra guiada que permite enfocarse solo en el pecho."
            },
            "pt": {
                "name": "Supino Reto (Smith)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Posicione o banco sob a barra guiada.\n2. Desça com controle até quase tocar o peito.\n3. Empurre focando na conexão mente-músculo.",
                "description": "A estabilidade da barra guiada permite focar apenas no músculo."
            }
        }
    },
    {
        "id": 29,
        "name": "landmine_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/landmine_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Landmine Press (Barbell)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Landmine",
                    "Hypertrophy",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Place one end of the barbell in a landmine anchor or corner.\n2. Grip the loaded end at chest height with one or both hands.\n3. Press the barbell forward and upward in a diagonal line until arms extend.\n4. Lower with control back to the starting chest position.",
                "description": "Diagonal pressing exercise targeting the upper chest while reducing shoulder joint stress."
            },
            "es": {
                "name": "Press Landmine (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Landmine",
                    "Hipertrofia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Coloca un extremo de la barra en un soporte landmine o esquina.\n2. Sujeta el extremo con peso a la altura del pecho con una o ambas manos.\n3. Empuja la barra hacia adelante y arriba en diagonal hasta extender los brazos.\n4. Regresa de manera controlada al pecho.",
                "description": "Ejercicio de empuje diagonal enfocado en el pectoral superior reduciendo el estrés articular del hombro."
            },
            "pt": {
                "name": "Landmine Press (Barra)",
                "tags": [
                    "Peitoral",
                    "Peitoral Superior",
                    "Landmine",
                    "Hipertrofia",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Posicione uma ponta da barra em um suporte landmine ou canto firme.\n2. Segure a ponta carregada com uma ou ambas as mãos na altura do peito.\n3. Empurre a barra para a frente e para cima em trajetória diagonal até a extensão dos braços.\n4. Retorne controlando o peso até a altura do peito.",
                "description": "Exercício de empurrar em ângulo diagonal que enfatiza o peitoral superior reduzindo o estresse articular nos ombros."
            }
        }
    },
    {
        "id": 30,
        "name": "dumbbell_pullover",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/dumbbell_pullover.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pullover (Dumbbell)",
                "tags": [
                    "Chest",
                    "Serratus",
                    "Maximum Stretch",
                    "Bench",
                    "Dumbbell",
                    "Compound"
                ],
                "howTo": "1. Lie perpendicular across a flat bench with your upper back supported.\n2. Hold a dumbbell with both hands in a diamond grip above your chest.\n3. Lower the dumbbell behind your head in an arc until you feel a deep stretch.\n4. Pull the weight back over your chest while contracting your pectorals.",
                "description": "Classic exercise for ribcage expansion, targeting the chest and serratus anterior."
            },
            "es": {
                "name": "Pullover (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Serrato",
                    "Estiramiento Máximo",
                    "Banco",
                    "Mancuernas",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate atravesado sobre un banco plano apoyando la parte superior de la espalda.\n2. Sujeta una mancuerna con ambas manos en forma de diamante sobre el pecho.\n3. Desciende la mancuerna en arco por detrás de la cabeza sintiendo el estiramiento.\n4. Tira de vuelta hacia el pecho apretando el pectoral.",
                "description": "Ejercicio tradicional para la expansión de la caja torácica y activación del pectoral y serrato."
            },
            "pt": {
                "name": "Pullover (Halteres)",
                "tags": [
                    "Peitoral",
                    "Serrátil",
                    "Alongamento Máximo",
                    "Banco",
                    "Halteres",
                    "Composto"
                ],
                "howTo": "1. Deite de costas atravessado em um banco plano, apoiando ombros e pescoço.\n2. Segure um halter com ambas as mãos em formato de diamante acima do peito.\n3. Desça o halter em arco atrás da cabeça até sentir o alongamento do peito e dorsais.\n4. Puxe de volta até a linha do peito contraindo a musculatura peitoral.",
                "description": "Exercício tradicional para expansão da caixa torácica e desenvolvimento integrado do peitoral e serrátil."
            }
        }
    },
    {
        "id": 31,
        "name": "svendsen_press",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "plate",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/svendsen_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Svendsen Press (Plate)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Isometric",
                    "Plate",
                    "Isolation"
                ],
                "howTo": "1. Stand or sit tall, squeezing a weight plate between your palms at chest height.\n2. Maintain constant inward pressure pressing your hands together.\n3. Extend your arms straight forward in front of you while contracting your chest.\n4. Slowly return the plate to your chest without releasing tension.",
                "description": "Isometric and dynamic squeeze exercise using a weight plate to maximize inner chest contraction."
            },
            "es": {
                "name": "Press Svendsen (Disco)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Isometría",
                    "Disco",
                    "Aislamiento"
                ],
                "howTo": "1. De pie o sentado, aprieta un disco entre las palmas de las manos a la altura del pecho.\n2. Mantén una presión constante de ambas manos empujando el disco hacia adentro.\n3. Extiende los brazos al frente en línea recta contrayendo el pectoral.\n4. Regresa el disco al pecho sin soltar la presión de las palmas.",
                "description": "Ejercicio isométrico continuo con disco para máxima activación del centro del pecho."
            },
            "pt": {
                "name": "Press Svendsen (Anilha)",
                "tags": [
                    "Peitoral",
                    "Miolo do Peito",
                    "Isometria",
                    "Anilha",
                    "Isolamento"
                ],
                "howTo": "1. Em pé ou sentado, aperte uma anilha entre as palmas das mãos na altura do peito.\n2. Mantenha pressão constante das mãos empurrando uma contra a outra.\n3. Estenda os braços à frente na linha dos ombros mantendo a contração máxima.\n4. Retorne a anilha até o peito sem diminuir a pressão das palmas.",
                "description": "Exercício de contração isométrica contínua com anilha para queima e ativação do miolo do peitoral."
            }
        }
    },
    {
        "id": 500,
        "name": "cable_bench_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/cable_bench_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bench Press (Cable)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Cable Bench Press."
            },
            "es": {
                "name": "Bench Press (Polea)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea."
            },
            "pt": {
                "name": "Supino Reto (Polia)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia."
            }
        }
    },
    {
        "id": 501,
        "name": "incline_smith_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_smith_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Press (Smith Machine)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Incline Smith Press."
            },
            "es": {
                "name": "Incline Press (Máquina Smith)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina Smith."
            },
            "pt": {
                "name": "Supino Inclinado (Smith)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Smith."
            }
        }
    },
    {
        "id": 502,
        "name": "incline_cable_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_cable_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Press (Cable)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Incline Cable Press."
            },
            "es": {
                "name": "Incline Press (Polea)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea."
            },
            "pt": {
                "name": "Supino Inclinado (Polia)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia."
            }
        }
    },
    {
        "id": 503,
        "name": "incline_machine_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/incline_machine_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Press (Machine)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Incline Bench",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Incline Machine Press."
            },
            "es": {
                "name": "Incline Press (Máquina)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina."
            },
            "pt": {
                "name": "Supino Inclinado (Máquina)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Banco Inclinado",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Máquina."
            }
        }
    },
    {
        "id": 504,
        "name": "decline_smith_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_smith_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Press (Smith Machine)",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Decline Smith Press."
            },
            "es": {
                "name": "Decline Press (Máquina Smith)",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina Smith."
            },
            "pt": {
                "name": "Supino Declinado (Smith)",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Smith."
            }
        }
    },
    {
        "id": 505,
        "name": "decline_machine_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_machine_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Press (Machine)",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Bench",
                    "Hypertrophy",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Decline Machine Press."
            },
            "es": {
                "name": "Decline Press (Máquina)",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Máquina."
            },
            "pt": {
                "name": "Supino Declinado (Máquina)",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Banco",
                    "Hipertrofia",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Máquina."
            }
        }
    },
    {
        "id": 506,
        "name": "decline_dumbbell_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/decline_dumbbell_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Decline Fly (Dumbbell)",
                "tags": [
                    "Chest",
                    "Lower Chest",
                    "Isolation"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Decline Dumbbell Fly."
            },
            "es": {
                "name": "Aperturas Declinadas (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Inferior",
                    "Aislamiento"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Mancuernas."
            },
            "pt": {
                "name": "Crucifixo Declinado (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Inferior",
                    "Isolado"
                ],
                "howTo": "1. Posicione o corpo com o peito aberto e escápulas travadas.\n2. Execute o movimento em arco trazendo as mãos em direção ao centro do peito.\n3. Retorne de forma lenta sentindo o alongamento do peitoral sem hiperextender os ombros.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Halteres."
            }
        }
    },
    {
        "id": 516,
        "name": "weighted_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/weighted_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Weighted Push Up (Plate)",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Plate",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Weighted Push Up."
            },
            "es": {
                "name": "Flexiones con Lastre",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Disco",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral."
            },
            "pt": {
                "name": "Flexão com Carga",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Anilha",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral."
            }
        }
    },
    {
        "id": 517,
        "name": "ring_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/ring_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Ring Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Ring Push Up."
            },
            "es": {
                "name": "Flexiones (Anillas)",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Anillas."
            },
            "pt": {
                "name": "Flexão (Argolas)",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Argolas."
            }
        }
    },
    {
        "id": 518,
        "name": "unilateral_dumbbell_bench_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/unilateral_dumbbell_bench_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Unilateral Bench Press (Dumbbell)",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Unilateral Dumbbell Bench Press."
            },
            "es": {
                "name": "Unilateral Bench Press (Mancuernas)",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Mancuernas."
            },
            "pt": {
                "name": "Supino Unilateral (Halteres)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Halteres."
            }
        }
    },
    {
        "id": 519,
        "name": "guillotine_press",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/guillotine_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Guillotine Press (Barbell)",
                "tags": [
                    "Chest",
                    "Upper Chest",
                    "Maximum Stretch",
                    "Bench",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Lie flat on a bench and grip the barbell slightly wider than shoulder width.\n2. Lower the bar slowly and strictly toward your clavicle/upper chest with elbows flared at 90 degrees.\n3. Avoid touching the neck and press the barbell back up squeezing your chest.\n4. Use controlled, moderate weight to protect your shoulder joints.",
                "description": "Advanced bench press variation lowering the bar toward the neck/clavicle to maximize upper and mid-chest fiber stretch."
            },
            "es": {
                "name": "Press Guillotina (Barra)",
                "tags": [
                    "Pecho",
                    "Pecho Superior",
                    "Estiramiento Máximo",
                    "Banco",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate en el banco plano y sujeta la barra con un agarre algo más ancho que los hombros.\n2. Desciende la barra de forma lenta hacia la clavícula/pecho superior con los codos a 90 grados.\n3. Empuja la barra hacia arriba contrayendo fuertemente el pecho.\n4. Usa un peso moderado para cuidar la articulación del hombro.",
                "description": "Variación avanzada de press de banca donde la barra baja hacia la clavícula para un estiramiento extremo del pectoral."
            },
            "pt": {
                "name": "Supino Guilhotina (Barra)",
                "tags": [
                    "Peitoral",
                    "Peito Superior",
                    "Alongamento Máximo",
                    "Banco",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Deite no banco plano e segure a barra com pegada ligeiramente mais aberta que os ombros.\n2. Desça a barra de forma lenta e controlada em direção ao topo do peitoral/clavícula.\n3. Mantenha os cotovelos alinhados e abertos em 90 graus.\n4. Empurre a barra até a extensão quase completa focando na contração peitoral.\n5. Atenção: utilize cargas moderadas para preservar as articulações dos ombros.",
                "description": "Variação avançada de supino na qual a barra desce na altura da clavícula com cotovelos abertos para extremo alongamento peitoral."
            }
        }
    },
    {
        "id": 520,
        "name": "single_arm_cable_fly",
        "category": "chest",
        "secondaryMuscles": [
            "shoulders"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 20,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/single_arm_cable_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Single Arm Fly (Cable)",
                "tags": [
                    "Chest",
                    "Inner Chest",
                    "Maximum Stretch",
                    "Isolation",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Single Arm Cable Fly."
            },
            "es": {
                "name": "Single Arm Fly (Polea)",
                "tags": [
                    "Pecho",
                    "Pecho Interno",
                    "Estiramiento Máximo",
                    "Aislamiento",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral con Polea."
            },
            "pt": {
                "name": "Crucifixo Unilateral (Polia)",
                "tags": [
                    "Peitoral",
                    "Peitoral Interno",
                    "Alongamento Máximo",
                    "Isolado",
                    "Unilateral"
                ],
                "howTo": "1. Posicione o corpo com o peito aberto e escápulas travadas.\n2. Execute o movimento em arco trazendo as mãos em direção ao centro do peito.\n3. Retorne de forma lenta sentindo o alongamento do peitoral sem hiperextender os ombros.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Polia."
            }
        }
    },
    {
        "id": 562,
        "name": "pseudo_planche_push_up",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/pseudo_planche_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pseudo Planche Push Up",
                "tags": [
                    "Chest",
                    "Push-up",
                    "Core Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Pseudo Planche Push Up."
            },
            "es": {
                "name": "Pseudo Planche Push Up",
                "tags": [
                    "Pecho",
                    "Flexión",
                    "Fuerza del Core",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral."
            },
            "pt": {
                "name": "Flexão Pseudo-Prancha",
                "tags": [
                    "Peitoral",
                    "Flexão de Braço",
                    "Força do Core",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral."
            }
        }
    },
    {
        "id": 563,
        "name": "ring_dips",
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
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/chest/ring_dips.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Ring Dips",
                "tags": [
                    "Chest",
                    "Middle Chest",
                    "Bench",
                    "Hypertrophy",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Ring Dips."
            },
            "es": {
                "name": "Ring Dips",
                "tags": [
                    "Pecho",
                    "Pecho Medio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Ejercicio fundamental para la hipertrofia y definición del pectoral."
            },
            "pt": {
                "name": "Paralelas (Argolas)",
                "tags": [
                    "Peitoral",
                    "Peito Médio",
                    "Banco",
                    "Hipertrofia",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Estabilize o corpo na base de apoio e segure a carga com firmeza.\n2. Controle a descida até a altura do peitoral mantendo os cotovelos alinhados.\n3. Empurre com força concentrando a contração no miolo e porção do peitoral.",
                "description": "Exercício fundamental para hipertrofia e definição da musculatura peitoral com Argolas."
            }
        }
    }
];
