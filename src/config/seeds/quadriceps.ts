import { Exercise } from '../types';

export const QUADRICEPS_EXERCISES: Exercise[] = [
    {
        "id": 220,
        "name": "barbell_back_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/barbell_back_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Back Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Rest the bar on your traps and step your feet out.\n2. Lower your hips as if sitting in a chair.\n3. Keep your chest up and push through your heels to rise.",
                "description": "The king of leg exercises, focuses on total leg volume."
            },
            "es": {
                "name": "Sentadilla Trasera (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Apoya la barra en los trapecios y separa los pies.\n2. Baja la cadera como si fueras a sentarte en una silla.\n3. Mantén el pecho arriba y sube empujando con los talones.",
                "description": "El rey de los ejercicios de pierna, enfocado en el volumen total."
            },
            "pt": {
                "name": "Agachamento Livre (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Apoie a barra no trapézio e afaste os pés.\n2. Desça o quadril como se fosse sentar em uma cadeira.\n3. Mantenha o peito aberto e suba empurrando o chão com o calcanhar.",
                "description": "O rei dos exercícios para pernas, foca no volume total."
            }
        }
    },
    {
        "id": 221,
        "name": "barbell_front_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/barbell_front_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Front Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Hold the bar in front of your body across your shoulders.\n2. Keep your elbows high throughout the entire movement.\n3. Squat keeping your torso vertical and drive back up.",
                "description": "Higher quad activation and less pressure on the lower back."
            },
            "es": {
                "name": "Front Squat (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta la barra frente al cuerpo, sobre los hombros.\n2. Mantén los codos altos durante todo el movimiento.\n3. Baja manteniendo el tronco vertical y sube con fuerza.",
                "description": "Mayor activación del cuádriceps y menos presión lumbar."
            },
            "pt": {
                "name": "Agachamento Frontal (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Segure a barra à frente do corpo, sobre os ombros.\n2. Mantenha os cotovelos altos durante todo o movimento.\n3. Agache mantendo o tronco vertical e suba com força.",
                "description": "Maior ativação do quadríceps e menos pressão na lombar."
            }
        }
    },
    {
        "id": 222,
        "name": "dumbbell_goblet_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/dumbbell_goblet_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Goblet Squat (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. Hold a dumbbell against your chest with both hands.\n2. Squat down between your knees keeping your back straight.\n3. Stand up without letting your knees cave in.",
                "description": "Excellent for beginners and improving hip mobility."
            },
            "es": {
                "name": "Goblet Squat (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta una mancuerna contra el pecho con ambas manos.\n2. Baja entre las rodillas manteniendo la espalda recta.\n3. Sube sin dejar que las rodillas se cierren.",
                "description": "Excelente para principiantes y para mejorar la movilidad."
            },
            "pt": {
                "name": "Agachamento Goblet (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Segure um halter junto ao peito com as duas mãos.\n2. Agache entre os joelhos mantendo as costas retas.\n3. Suba sem deixar os joelhos fecharem (valgo).",
                "description": "Excelente para iniciantes e para melhorar a mobilidade."
            }
        }
    },
    {
        "id": 223,
        "name": "smith_machine_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "smith",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/smith_machine_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Squat (Smith Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. Position your feet slightly in front of the bar line.\n2. Lower in a controlled manner until thighs are parallel to the floor.\n3. Push the bar up focusing entirely on your legs.",
                "description": "Assisted stability to focus on muscle failure."
            },
            "es": {
                "name": "Squat (Máquina Smith)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. Posiciona los pies un poco por delante de la barra.\n2. Baja de forma controlada hasta que los muslos estén paralelos al suelo.\n3. Empuja la barra hacia arriba enfocándote en las piernas.",
                "description": "Estabilidad asistida para enfocarse en la fatiga muscular."
            },
            "pt": {
                "name": "Agachamento (Smith)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Posicione os pés levemente à frente da linha da barra.\n2. Desça de forma controlada até as coxas ficarem paralelas ao chão.\n3. Empurre a barra para cima focando apenas nas pernas.",
                "description": "Estabilidade assistida para focar na falha muscular."
            }
        }
    },
    {
        "id": 224,
        "name": "leg_press_45",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/leg_press_45.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Leg Press 45 (Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Machine",
                    "Knee Friendly",
                    "Compound"
                ],
                "howTo": "1. Place feet on the platform shoulder-width apart.\n2. Lower the weight until knees are near your chest.\n3. Push back up without locking your knees at the top.",
                "description": "Allows heavy loads for hypertrophy with high safety."
            },
            "es": {
                "name": "Prensa 45° (Máquina)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Máquina",
                    "Seguro para Rodilla",
                    "Compuesto"
                ],
                "howTo": "1. Apoya los pies en la plataforma al ancho de los hombros.\n2. Baja el peso hasta que las rodillas se acerquen al pecho.\n3. Empuja sin bloquear las rodillas al final del recorrido.",
                "description": "Permite usar grandes cargas para hipertrofia con seguridad."
            },
            "pt": {
                "name": "Leg Press 45° (Máquina)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Máquina",
                    "Seguro para o Joelho",
                    "Composto"
                ],
                "howTo": "1. Apoie os pés na plataforma na largura dos ombros.\n2. Desça o peso até os joelhos chegarem perto do peito.\n3. Empurre sem travar (estalar) os joelhos no topo.",
                "description": "Permite usar grandes cargas para hipertrofia com segurança."
            }
        }
    },
    {
        "id": 225,
        "name": "hack_squat_machine",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/hack_squat_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Hack Squat (Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Rest your back against the pad and shoulders under the cushions.\n2. Lower until you reach a 90-degree angle.\n3. Drive up keeping your heels fixed on the platform.",
                "description": "Potent isolation for the front part of the thighs."
            },
            "es": {
                "name": "Hack Squat (Máquina)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Apoya la espalda en el respaldo y los hombros en las almohadillas.\n2. Baja hasta alcanzar un ángulo de 90 grados.\n3. Sube manteniendo los talones fijos en la plataforma.",
                "description": "Aislamiento potente para la parte frontal de los muslos."
            },
            "pt": {
                "name": "Agachamento Hack (Máquina)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Apoie as costas no suporte e os ombros nas almofadas.\n2. Desça até formar um ângulo de 90 graus.\n3. Suba mantendo os calcanhares fixos na plataforma.",
                "description": "Isolamento potente para a parte frontal das coxas."
            }
        }
    },
    {
        "id": 226,
        "name": "leg_extension",
        "category": "quadriceps",
        "secondaryMuscles": [
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/leg_extension.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Leg Extension (Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Constant Tension",
                    "Definition",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Sit and adjust the roller just above your ankles.\n2. Extend your legs fully and squeeze at the top.\n3. Return slowly without letting the weights crash.",
                "description": "The only exercise that completely isolates the quadriceps."
            },
            "es": {
                "name": "Extensión de Cuádriceps (Máquina)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Tensión Constante",
                    "Definición",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Siéntate y ajusta el rodillo sobre los tobillos.\n2. Extiende las piernas totalmente y aprieta arriba.\n3. Regresa despacio sin dejar que el peso golpee.",
                "description": "El único ejercicio que aísla totalmente el cuádriceps."
            },
            "pt": {
                "name": "Cadeira Extensora (Máquina)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Tensão Constante",
                    "Definição",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Sente e ajuste o rolo acima dos tornozelos.\n2. Estenda as pernas totalmente e contraia o músculo no topo.\n3. Volte devagar sem deixar os pesos baterem.",
                "description": "Único exercício que isola totalmente o quadríceps."
            }
        }
    },
    {
        "id": 227,
        "name": "v_squat_machine",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/v_squat_machine.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "V Squat (Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Step into the machine and unlock the safety handles.\n2. Perform a deep squat with control.\n3. Drive the platform up using the soles of your feet.",
                "description": "Natural movement simulating a squat with added support."
            },
            "es": {
                "name": "Sentadilla en V (Máquina)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Colócate en la máquina y quita el seguro.\n2. Realiza la sentadilla profunda con control.\n3. Empuja la plataforma con la planta de los pies.",
                "description": "Movimiento natural que simula la sentadilla con soporte."
            },
            "pt": {
                "name": "Agachamento V-Squat (Máquina)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Posicione-se na máquina e destrave o suporte.\n2. Realize o agachamento profundo com controle.\n3. Empurre a plataforma com a planta dos pés.",
                "description": "Movimento natural que simula o agachamento com mais suporte."
            }
        }
    },
    {
        "id": 228,
        "name": "bulgarian_split_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/bulgarian_split_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bulgarian Split Squat (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Rest one foot behind you on a bench and the other forward.\n2. Lower your back knee toward the floor.\n3. Keep your torso upright and drive up with the front leg.",
                "description": "Elite unilateral exercise for mass gains."
            },
            "es": {
                "name": "Bulgarian Split Squat (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Apoya un pie atrás en un banco y el otro adelante.\n2. Baja la rodilla trasera hacia el suelo.\n3. Mantén el tronco erguido y sube con la pierna delantera.",
                "description": "Ejercicio unilateral de élite para ganar masa."
            },
            "pt": {
                "name": "Agachamento Búlgaro (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Apoie um pé atrás em um banco e o outro à frente.\n2. Desça o joelho de trás em direção ao chão.\n3. Mantenha o tronco reto e suba com a perna da frente.",
                "description": "Exercício unilateral de elite para ganho de massa."
            }
        }
    },
    {
        "id": 229,
        "name": "barbell_walking_lunge",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/barbell_walking_lunge.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Walking Lunge (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. With the bar on your traps, take a large step forward.\n2. Drop your knee until it almost touches the ground.\n3. Step forward continuously with the next leg.",
                "description": "Develops strength, balance, and coordination."
            },
            "es": {
                "name": "Walking Lunge (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Con la barra en los trapecios, da un paso largo adelante.\n2. Baja la rodilla hasta que casi toque el suelo.\n3. Da el siguiente paso adelante de forma continua.",
                "description": "Desarrolla fuerza, equilibrio y coordinación."
            },
            "pt": {
                "name": "Passada / Afundo (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Com a barra no trapézio, dê um passo largo à frente.\n2. Flexione o joelho até quase tocar o chão.\n3. Dê o próximo passo à frente continuamente.",
                "description": "Desenvolve força, equilíbrio e coordenação."
            }
        }
    },
    {
        "id": 230,
        "name": "dumbbell_walking_lunge",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/dumbbell_walking_lunge.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Walking Lunge (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Compound"
                ],
                "howTo": "1. Hold a dumbbell in each hand at your sides.\n2. Step forward and lower your hips vertically.\n3. Alternate legs while walking.",
                "description": "Stable version of the lunge for volume focus."
            },
            "es": {
                "name": "Walking Lunge (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta una mancuerna en cada mano a los costados.\n2. Avanza una pierna y baja la cadera verticalmente.\n3. Alterna las piernas mientras caminas.",
                "description": "Versión estable de la zancada para enfoque en volumen."
            },
            "pt": {
                "name": "Passada / Afundo (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Composto"
                ],
                "howTo": "1. Segure um halter em cada mão ao lado do corpo.\n2. Avance uma perna e desça o quadril verticalmente.\n3. Alterne as pernas enquanto caminha.",
                "description": "Versão mais estável da passada para foco em volume."
            }
        }
    },
    {
        "id": 231,
        "name": "step_up",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/step_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Step Up (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Compound"
                ],
                "howTo": "1. Place one foot on a box or high bench.\n2. Step up using only the strength of the top leg.\n3. Lower yourself slowly and with control.",
                "description": "Great for functional strength and correcting imbalances."
            },
            "es": {
                "name": "Subidas al Banco (Step Up)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Compuesto"
                ],
                "howTo": "1. Pon un pie sobre un cajón o banco alto.\n2. Sube usando solo la fuerza de la pierna de arriba.\n3. Baja despacio y de forma controlada.",
                "description": "Excelente para fuerza funcional y corrección de asimetrías."
            },
            "pt": {
                "name": "Subida no Banco / Step Up",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Composto"
                ],
                "howTo": "1. Coloque um pé sobre uma caixa ou banco alto.\n2. Suba usando apenas a força da perna de cima.\n3. Desça devagar, controlando o movimento.",
                "description": "Ótimo para força funcional e correção de assimetrias."
            }
        }
    },
    {
        "id": 232,
        "name": "sissy_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/sissy_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Sissy Squat",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Bodyweight",
                    "Home",
                    "Isolation"
                ],
                "howTo": "1. Hold a support and lean your torso back.\n2. Project your knees forward as you lower your body.\n3. Drive back up by squeezing the front of your thighs.",
                "description": "Extreme quad isolation using bodyweight."
            },
            "es": {
                "name": "Sissy Squat",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Peso Corporal",
                    "En Casa",
                    "Aislamiento"
                ],
                "howTo": "1. Sujétate de un apoyo e inclina el tronco hacia atrás.\n2. Lleva las rodillas hacia adelante mientras bajas el cuerpo.\n3. Sube apretando intensamente la parte frontal del muslo.",
                "description": "Aislamiento extremo del cuádriceps con peso corporal."
            },
            "pt": {
                "name": "Agachamento Sissy",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Peso Corporal",
                    "Em Casa",
                    "Isolado"
                ],
                "howTo": "1. Segure em um apoio e incline o tronco para trás.\n2. Projete os joelhos para frente enquanto desce o corpo.\n3. Suba contraindo intensamente a frente das coxas.",
                "description": "Aislamiento extremo do quadríceps usando o peso do corpo."
            }
        }
    },
    {
        "id": 233,
        "name": "zercher_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/zercher_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Zercher Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Hold the bar in the crooks of your elbows against your core.\n2. Squat while keeping the bar stable and back straight.\n3. Rise while maintaining abdominal pressure.",
                "description": "Works quads and core brutally."
            },
            "es": {
                "name": "Sentadilla Zercher (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta la barra en el pliegue de los codos contra el torso.\n2. Haz la sentadilla manteniendo la barra estable.\n3. Sube manteniendo la presión abdominal.",
                "description": "Trabaja cuádriceps y core de forma brutal."
            },
            "pt": {
                "name": "Agachamento Zercher (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Segure a barra na dobra dos cotovelos junto ao abdômen.\n2. Agache mantendo a barra fixa e as costas retas.\n3. Suba mantendo a pressão no abdômen.",
                "description": "Trabalha quadríceps e core de forma brutal."
            }
        }
    },
    {
        "id": 234,
        "name": "landmine_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/landmine_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Landmine Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Landmine",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Cup both hands together holding the end of the landmine barbell at upper chest level.\n2. Set your feet shoulder-width apart with a slight forward lean.\n3. Squat down by flexing knees and hips while keeping your torso braced.\n4. Drive through mid-foot to stand up following the barbell natural path.",
                "description": "Squat variation performed with an anchored barbell, providing a natural arc that relieves lower back shear stress."
            },
            "es": {
                "name": "Sentadilla Landmine (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Sentadilla",
                    "Landmine",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta el extremo de la barra con ambas manos a la altura del pecho.\n2. Separa los pies al ancho de hombros con una ligera inclinación hacia adelante.\n3. Desciende en sentadilla flexionando rodillas y caderas con el abdomen firme.\n4. Empuja el suelo para regresar arriba siguiendo el arco de la barra.",
                "description": "Variación de sentadilla con barra anclada (landmine), ofreciendo un ángulo de movimiento natural y seguro para la columna."
            },
            "pt": {
                "name": "Agachamento no Landmine (Barra)",
                "tags": [
                    "Quadríceps",
                    "Agachamento",
                    "Landmine",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Segure a ponta da barra no peito com as duas mãos juntas (pegada em concha).\n2. Afaste os pés na largura dos ombros com o tronco levemente inclinado para a frente.\n3. Agache flexionando os joelhos e quadris mantendo o peso apoiado no meio dos pés.\n4. Empurre o chão estendendo as pernas e seguindo o arco natural da barra.",
                "description": "Agachamento realizado com a barra angular ancorada (landmine), proporcionando uma trajetória curva natural que reduz a sobrecarga na coluna lombar."
            }
        }
    },
    {
        "id": 235,
        "name": "dumbbell_reverse_lunge",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/dumbbell_reverse_lunge.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Reverse Lunge (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Compound"
                ],
                "howTo": "1. From standing, take a step backward instead of forward.\n2. Drop your back knee until it nearly touches the floor.\n3. Return to starting position by driving through the front leg.",
                "description": "Gentler on the knees than the forward lunge."
            },
            "es": {
                "name": "Reverse Lunge (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Compuesto"
                ],
                "howTo": "1. Desde posición de pie, da un paso atrás en lugar de adelante.\n2. Baja la rodilla trasera hasta que casi toque el suelo.\n3. Regresa al inicio empujando con la pierna delantera.",
                "description": "Más amable con las rodillas que la zancada frontal."
            },
            "pt": {
                "name": "Passada / Afundo (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Composto"
                ],
                "howTo": "1. Em pé, dê um passo para trás em vez de para frente.\n2. Desça o joelho traseiro até quase tocar o solo.\n3. Volte à posição inicial com um impulso da perna frontal.",
                "description": "Mais gentil com os joelhos que a passada frontal."
            }
        }
    },
    {
        "id": 236,
        "name": "dumbbell_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/dumbbell_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Squat (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Dumbbell",
                    "Compound"
                ],
                "howTo": "1. Stand tall holding dumbbells at your sides (or racked at your shoulders) with feet shoulder-width apart.\n2. Keep your chest up, shoulders back, and core braced.\n3. Squat down by bending at the hips and knees as if sitting back into a chair.\n4. Descend until thighs are parallel to the floor, then drive through heels to return to standing.",
                "description": "Squat performed holding dumbbells at your sides or resting on shoulders, an excellent lower body builder with reduced spinal loading."
            },
            "es": {
                "name": "Sentadilla Libre (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Sentadilla",
                    "Piernas",
                    "Mancuernas",
                    "Compuesto"
                ],
                "howTo": "1. De pie sujetando una mancuerna en cada mano a los costados con los pies al ancho de hombros.\n2. Mantén el pecho erguido y el core firme.\n3. Flexiona las rodillas y caderas bajando de forma controlada como si te sentaras.\n4. Desciende hasta el paralelo y empuja desde los talones para volver a la posición inicial.",
                "description": "Sentadilla realizada sujetando mancuernas a los lados o sobre los hombros, ideal para hipertrofia de piernas con menor carga axial en la columna."
            },
            "pt": {
                "name": "Agachamento Livre (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Agachamento",
                    "Membros Inferiores",
                    "Halteres",
                    "Composto"
                ],
                "howTo": "1. Fique em pé segurando um halter em cada mão ao lado do corpo (ou apoiados sobre os ombros) com os pés na largura dos ombros.\n2. Mantenha o peito aberto, escápulas retraídas e abdômen contraído.\n3. Agache flexionando os joelhos e projetando o quadril para trás como se fosse sentar em uma cadeira.\n4. Desça até as coxas ficarem paralelas ao chão e empurre com os calcanhares para retornar.",
                "description": "Agachamento realizado segurando halteres ao lado do corpo ou sobre os ombros, excelente alternativa para desenvolvimento de quadríceps com menor sobrecarga na coluna vertebral."
            }
        }
    },
    {
        "id": 237,
        "name": "vertical_leg_press",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 224,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/vertical_leg_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Vertical Leg Press 90° (Machine)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Leg Press",
                    "Machine",
                    "Vertical",
                    "Compound"
                ],
                "howTo": "1. Lie flat under the vertical leg press with lower back and hips firmly against the pad.\n2. Place feet shoulder-width on the platform.\n3. Release the safety handles and lower the platform bending knees toward a 90-degree angle without rounding your lower back.\n4. Press through your mid-foot and heels to drive the weight back up without locking out knees abruptly.",
                "description": "Vertical 90-degree leg press where the platform is pressed straight upward, delivering intense mechanical tension on the quadriceps and glutes."
            },
            "es": {
                "name": "Prensa Vertical 90° (Máquina)",
                "tags": [
                    "Cuádriceps",
                    "Prensa",
                    "Máquina",
                    "Vertical",
                    "Piernas",
                    "Compuesto"
                ],
                "howTo": "1. Túmbate en la máquina vertical con la espalda baja totalmente apoyada.\n2. Coloca los pies en la plataforma al ancho de los hombros.\n3. Quita los seguros y baja la plataforma flexionando las rodillas a 90 grados de forma controlada.\n4. Empuja con fuerza desde la planta del pie para subir la plataforma sin bloquear las rodillas.",
                "description": "Variación de prensa vertical a 90 grados donde se empuja la plataforma directamente hacia arriba, logrando gran activación de cuádriceps y glúteos."
            },
            "pt": {
                "name": "Leg Press 90° (Máquina)",
                "tags": [
                    "Quadríceps",
                    "Leg Press",
                    "Máquina",
                    "Vertical",
                    "Pernas",
                    "Composto"
                ],
                "howTo": "1. Deite-se no banco da máquina vertical com as costas totalmente apoiadas e quadris bem encaixados.\n2. Posicione os pés na plataforma na largura dos ombros.\n3. Destrave a máquina e desça a plataforma flexionando os joelhos em direção ao peito em ângulo de 90 graus sem deixar a lombar descolar do banco.\n4. Empurre a plataforma com a sola dos pés até a extensão controlada sem hiperestender os joelhos.",
                "description": "Variação de leg press vertical (90 graus) em que o atleta empurra a plataforma diretamente para cima, gerando grande ativação e tensão mecânica nos quadríceps e glúteos."
            }
        }
    },
    {
        "id": 534,
        "name": "barbell_box_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/barbell_box_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Box Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Barbell Box Squat."
            },
            "es": {
                "name": "Sentadilla a la Caja (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas con Barra."
            },
            "pt": {
                "name": "Agachamento na Caixa (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Barra."
            }
        }
    },
    {
        "id": 537,
        "name": "reverse_lunge",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "alternating",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/reverse_lunge.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Reverse Lunge (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Reverse Lunge."
            },
            "es": {
                "name": "Zancadas Inversas (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas con Mancuernas."
            },
            "pt": {
                "name": "Afundo Reverso (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Composto"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Halteres."
            }
        }
    },
    {
        "id": 574,
        "name": "pistol_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/pistol_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pistol Squat",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Bodyweight",
                    "Home",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Pistol Squat."
            },
            "es": {
                "name": "Pistol Squat",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas."
            },
            "pt": {
                "name": "Agachamento Pistol (Perna Única)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Perna Única."
            }
        }
    },
    {
        "id": 575,
        "name": "shrimp_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/shrimp_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shrimp Squat",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Bodyweight",
                    "Home",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Shrimp Squat."
            },
            "es": {
                "name": "Shrimp Squat",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas."
            },
            "pt": {
                "name": "Agachamento Camarão (Perna Única)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Perna Única."
            }
        }
    },
    {
        "id": 587,
        "name": "overhead_squat",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 220,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/overhead_squat.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Overhead Squat (Barbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Heavy Load",
                    "Strength",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Overhead Squat."
            },
            "es": {
                "name": "Overhead Squat (Barra)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Carga Pesada",
                    "Fuerza",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas con Barra."
            },
            "pt": {
                "name": "Agachamento Overhead (Barra)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Carga Pesada",
                    "Força",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Barra."
            }
        }
    },
    {
        "id": 601,
        "name": "sled_push",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "calves",
            "hamstrings",
            "core"
        ],
        "equipment": "none",
        "executionMode": "alternating",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/sled_push.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Sled Push",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Sled Push."
            },
            "es": {
                "name": "Sled Push",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas."
            },
            "pt": {
                "name": "Empurrar Trenó (Sled Push)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Composto"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Sled Push."
            }
        }
    },
    {
        "id": 602,
        "name": "dumbbell_box_step_up",
        "category": "quadriceps",
        "secondaryMuscles": [
            "glutes",
            "hamstrings",
            "calves",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "alternating",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/quadriceps/dumbbell_box_step_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Box Step Up (Dumbbell)",
                "tags": [
                    "Quads",
                    "Quad Dominant",
                    "Legs",
                    "Unilateral",
                    "Balance",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Dumbbell Box Step Up."
            },
            "es": {
                "name": "Box Step Up (Mancuernas)",
                "tags": [
                    "Cuádriceps",
                    "Dominante de Cuádriceps",
                    "Piernas",
                    "Unilateral",
                    "Equilibrio",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento de alta exigencia muscular para cuadríceps y piernas con Mancuernas."
            },
            "pt": {
                "name": "Subida na Caixa (Halteres)",
                "tags": [
                    "Quadríceps",
                    "Dominante de Quadríceps",
                    "Pernas",
                    "Unilateral",
                    "Equilíbrio",
                    "Composto"
                ],
                "howTo": "1. Afaste os pés e mantenha o joelho alinhado com a ponta dos pés.\n2. Flexione os joelhos e desça com controle mantendo o tronco firme.\n3. Empurre o chão com os calcanhares para retornar à posição inicial.",
                "description": "Movimento de alta exigência muscular para o quadríceps e membros inferiores com Halteres."
            }
        }
    }
];
