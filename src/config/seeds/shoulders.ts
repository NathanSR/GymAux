import { Exercise } from '../types';

export const SHOULDERS_EXERCISES: Exercise[] = [
    {
        "id": 90,
        "name": "overhead_barbell_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/overhead_barbell_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Overhead Press (Barbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Bar at chest height, hands wider than shoulders.\n2. Press the bar overhead until arms are fully extended.\n3. Control the descent back to the upper chest.",
                "description": "The ultimate exercise for raw strength and shoulder mass."
            },
            "es": {
                "name": "Press Militar OHP (Barra)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Barra a la altura del pecho, manos más allá de hombros.\n2. Empuja la barra sobre la cabeza hasta estirar los brazos.\n3. Controla el descenso hasta la parte alta del pecho.",
                "description": "El mejor ejercicio para fuerza bruta y masa en los hombros."
            },
            "pt": {
                "name": "Desenvolvimento OHP (Barra)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Barra na altura do peito, mãos além dos ombros.\n2. Empurre a barra acima da cabeça até estender os braços.\n3. Controle a descida até a parte alta do peito.",
                "description": "O melhor exercício para força bruta e massa nos ombros."
            }
        }
    },
    {
        "id": 91,
        "name": "dumbbell_shoulder_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/dumbbell_shoulder_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shoulder Press (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Compound"
                ],
                "howTo": "1. Seated or standing, dumbbells at ear height.\n2. Press upward without clanking dumbbells at the top.\n3. Lower slowly to a 90-degree angle.",
                "description": "Allows for greater range of motion and individual stability."
            },
            "es": {
                "name": "Press de Hombros (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Compuesto"
                ],
                "howTo": "1. Sentado o de pie, mancuernas a la altura de las orejas.\n2. Empuja hacia arriba sin chocar las mancuernas.\n3. Baja lentamente hasta un ángulo de 90 grados.",
                "description": "Permite mayor rango de movimiento y estabilidad individual."
            },
            "pt": {
                "name": "Desenvolvimento (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Composto"
                ],
                "howTo": "1. Sentado ou em pé, halteres na altura das orelhas.\n2. Empurre para o alto sem bater os halteres no topo.\n3. Desça lentamente até o ângulo de 90 graus.",
                "description": "Permite maior amplitude e trabalha a estabilidade individual."
            }
        }
    },
    {
        "id": 92,
        "name": "arnold_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/arnold_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Arnold Press (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Compound"
                ],
                "howTo": "1. Start with dumbbells in front of face, palms facing you.\n2. Rotate hands outward as you press up.\n3. Return by rotating palms back toward your face.",
                "description": "Variation that recruits all three deltoid heads."
            },
            "es": {
                "name": "Press Arnold (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Compuesto"
                ],
                "howTo": "1. Inicia con mancuernas frente a la cara, palmas hacia ti.\n2. Gira las manos hacia afuera mientras empujas.\n3. Regresa girando las palmas hacia tu cara.",
                "description": "Variación que recluta las tres cabezas del deltoides."
            },
            "pt": {
                "name": "Desenvolvimento Arnold (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Composto"
                ],
                "howTo": "1. Comece com halteres à frente do rosto, palmas para você.\n2. Gire as mãos para fora enquanto empurra para cima.\n3. Retorne girando as palmas para o rosto novamente.",
                "description": "Variação que recruta as três cabeças do deltoide."
            }
        }
    },
    {
        "id": 93,
        "name": "smith_machine_shoulder_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "smith",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/smith_machine_shoulder_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shoulder Press (Smith Machine)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Compound"
                ],
                "howTo": "1. Adjust bench under the guided bar.\n2. Press the bar keeping elbows under the load.\n3. Control the descent to chin level.",
                "description": "Full stability to focus on the muscle and train to failure."
            },
            "es": {
                "name": "Shoulder Press (Máquina Smith)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Compuesto"
                ],
                "howTo": "1. Ajusta el banco bajo la barra guiada.\n2. Empuja la barra manteniendo los codos bajo la carga.\n3. Controla el descenso hasta la línea de la barbilla.",
                "description": "Estabilidad total para enfocar el músculo y entrenar al fallo."
            },
            "pt": {
                "name": "Desenvolvimento (Smith)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Composto"
                ],
                "howTo": "1. Ajuste o banco sob a barra guiada.\n2. Empurre a barra mantendo os cotovelos sob a carga.\n3. Controle a descida até a linha do queixo.",
                "description": "Estabilidade total para focar no músculo e treinar até a falha."
            }
        }
    },
    {
        "id": 94,
        "name": "seated_military_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/seated_military_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Seated Military Press (Barbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Sit on a bench with a straight backrest.\n2. Pronated grip on the bar.\n3. Press vertically while keeping the core tight.",
                "description": "Strict focus on the anterior deltoid without leg assistance."
            },
            "es": {
                "name": "Seated Military Press (Barra)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Sentado en banco con respaldo recto.\n2. Agarre pronado en la barra.\n3. Empuja verticalmente manteniendo el core firme.",
                "description": "Enfoque estricto en la porción anterior sin ayuda de piernas."
            },
            "pt": {
                "name": "Desenvolvimento Militar (Barra)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Sentado em banco com encosto reto.\n2. Pegada pronada na barra.\n3. Empurre verticalmente mantendo o core contraído.",
                "description": "Foco rigoroso na porção anterior sem auxílio das pernas."
            }
        }
    },
    {
        "id": 95,
        "name": "dumbbell_lateral_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/dumbbell_lateral_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lateral Raise (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Medial Deltoid",
                    "Shaping",
                    "Isolation"
                ],
                "howTo": "1. Dumbbells at your sides.\n2. Raise arms laterally to shoulder height.\n3. Lower slowly resisting the weight.",
                "description": "Key exercise for wide shoulders and lateral aesthetics."
            },
            "es": {
                "name": "Elevaciones Laterales (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Medial",
                    "Esculpido",
                    "Aislamiento"
                ],
                "howTo": "1. Mancuernas a los lados del cuerpo.\n2. Eleva los brazos lateralmente hasta la altura de los hombros.\n3. Baja despacio resistiendo el peso.",
                "description": "Ejercicio clave para hombros anchos y estética lateral."
            },
            "pt": {
                "name": "Elevação Lateral (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Medial",
                    "Lapidação/Desenho",
                    "Isolado"
                ],
                "howTo": "1. Halteres ao lado do corpo.\n2. Eleve os braços lateralmente até a altura dos ombros.\n3. Desça devagar resistindo ao peso.",
                "description": "O exercício chave para ombros largos e estética lateral."
            }
        }
    },
    {
        "id": 96,
        "name": "cable_lateral_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "cable",
        "executionMode": "unilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/cable_lateral_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lateral Raise (Cable)",
                "tags": [
                    "Shoulders",
                    "Medial Deltoid",
                    "Shaping",
                    "Unilateral",
                    "Isolation"
                ],
                "howTo": "1. Set the pulley to the lowest setting positioned at your side.\n2. Raise the cable out to the side until your arm is parallel to the floor.\n3. Lower with control without letting the weight stack touch.",
                "description": "Maintains constant tension throughout the entire movement arc, isolating the lateral deltoid unilaterally."
            },
            "es": {
                "name": "Elevaciones Laterales (Polea)",
                "tags": [
                    "Hombros",
                    "Deltoide Medial",
                    "Esculpido",
                    "Unilateral",
                    "Aislamiento"
                ],
                "howTo": "1. Coloca la polea baja al lado de tu cuerpo.\n2. Eleva el cable lateralmente hasta la altura del hombro.\n3. Controla la bajada sin dejar que las placas choquen.",
                "description": "Mantiene tensión constante en todo el arco del movimiento, aislando el deltoides lateral de forma unilateral."
            },
            "pt": {
                "name": "Elevação Lateral (Polia)",
                "tags": [
                    "Ombros",
                    "Deltoide Medial",
                    "Lapidação/Desenho",
                    "Unilateral",
                    "Isolado"
                ],
                "howTo": "1. Use a polia baixa posicionada ao lado do corpo.\n2. Puxe o cabo elevando o braço lateralmente até a altura do ombro.\n3. Controle o retorno desacelerando a descida sem deixar o peso bater.",
                "description": "Mantém tensão constante em todo o arco do movimento, isolando o deltoide lateral de forma unilateral."
            }
        }
    },
    {
        "id": 97,
        "name": "machine_lateral_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/machine_lateral_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lateral Raise (Machine)",
                "tags": [
                    "Shoulders",
                    "Medial Deltoid",
                    "Shaping",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Rest arms against the machine pads.\n2. Force elbows upward and outward.\n3. Hold for 1 second at the top and return.",
                "description": "Ideal mechanical isolation for beginners or burnout sets."
            },
            "es": {
                "name": "Lateral Raise (Máquina)",
                "tags": [
                    "Hombros",
                    "Deltoide Medial",
                    "Esculpido",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Apoya los brazos en los soportes de la máquina.\n2. Fuerza los codos hacia arriba lateralmente.\n3. Mantén 1 segundo arriba y regresa.",
                "description": "Aislamiento mecánico ideal para principiantes o fatiga."
            },
            "pt": {
                "name": "Elevação Lateral (Máquina)",
                "tags": [
                    "Ombros",
                    "Deltoide Medial",
                    "Lapidação/Desenho",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Apoie os braços nos suportes da máquina.\n2. Force os cotovelos para cima lateralmente.\n3. Segure 1 segundo no topo e retorne.",
                "description": "Isolamento mecânico ideal para iniciantes ou exaustão."
            }
        }
    },
    {
        "id": 98,
        "name": "lean_away_lateral_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/lean_away_lateral_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Lean Away Lateral Raise (Cable)",
                "tags": [
                    "Shoulders",
                    "Medial Deltoid",
                    "Shaping",
                    "Isolation"
                ],
                "howTo": "1. Hold a firm support and lean your body outward.\n2. Raise the dumbbell or cable laterally.\n3. Feel the extra stretch at the bottom.",
                "description": "Increases lateral deltoid stretch at the starting position."
            },
            "es": {
                "name": "Lean Away Lateral Raise (Polea)",
                "tags": [
                    "Hombros",
                    "Deltoide Medial",
                    "Esculpido",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta un soporte firme e inclina el cuerpo hacia afuera.\n2. Eleva la mancuerna o cable lateralmente.\n3. Siente el estiramiento extra abajo.",
                "description": "Aumenta el estiramiento del deltoides lateral al inicio."
            },
            "pt": {
                "name": "Elevação Lateral Inclinada (Polia)",
                "tags": [
                    "Ombros",
                    "Deltoide Medial",
                    "Lapidação/Desenho",
                    "Isolado"
                ],
                "howTo": "1. Segure em um suporte firme e incline o corpo para fora.\n2. Eleve o haltere ou cabo lateralmente.\n3. Sinta o alongamento extra na parte de baixo.",
                "description": "Aumenta o alongamento do deltoide lateral no início."
            }
        }
    },
    {
        "id": 99,
        "name": "dumbbell_front_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "chest"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/dumbbell_front_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Front Raise (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Isolation"
                ],
                "howTo": "1. Dumbbells in front of thighs.\n2. Raise forward to eye level.\n3. Alternate arms or perform simultaneously.",
                "description": "Isolates the anterior (front) head of the shoulder."
            },
            "es": {
                "name": "Elevaciones Frontales (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Aislamiento"
                ],
                "howTo": "1. Mancuernas frente a los muslos.\n2. Eleva al frente hasta la línea de los ojos.\n3. Alterna brazos o hazlo simultáneamente.",
                "description": "Aísla la porción anterior (frente) del hombro."
            },
            "pt": {
                "name": "Elevação Frontal (Halteres)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Isolado"
                ],
                "howTo": "1. Halteres à frente das coxas.\n2. Eleve à frente até a linha dos olhos.\n3. Alterne os braços ou faça simultaneamente.",
                "description": "Isola a porção anterior (frente) do ombro."
            }
        }
    },
    {
        "id": 100,
        "name": "barbell_front_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "chest"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/barbell_front_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Front Raise (Barbell)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Barbell",
                    "Isolation"
                ],
                "howTo": "1. Grip the bar with a pronated grip.\n2. Lift the bar to shoulder height.\n3. Keep elbows nearly straight.",
                "description": "Works the anterior portion with a fixed, stable load."
            },
            "es": {
                "name": "Front Raise (Barra)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Barra",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta la barra con agarre pronado.\n2. Levanta la barra hasta la altura de los hombros.\n3. Mantén los codos casi rectos.",
                "description": "Trabaja la porción anterior con carga fija y estable."
            },
            "pt": {
                "name": "Elevação Frontal (Barra)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Barra",
                    "Isolado"
                ],
                "howTo": "1. Segure a barra com pegada pronada.\n2. Levante a barra até a altura dos ombros.\n3. Mantenha os cotovelos quase retos.",
                "description": "Trabalha a porção anterior com carga fixa e estável."
            }
        }
    },
    {
        "id": 101,
        "name": "cable_front_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "chest"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/cable_front_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Front Raise (Cable)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Isolation"
                ],
                "howTo": "1. Back to the low pulley, cable between legs.\n2. Raise arms in front of your body.\n3. Lower while resisting the cable's pull.",
                "description": "Constant tension to define the front of the shoulder."
            },
            "es": {
                "name": "Front Raise (Polea)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Aislamiento"
                ],
                "howTo": "1. De espaldas a la polea baja, cable entre piernas.\n2. Eleva los brazos frente al cuerpo.\n3. Baja resistiendo la tracción del cable.",
                "description": "Tensión constante para definir el frente del hombro."
            },
            "pt": {
                "name": "Elevação Frontal (Polia)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Isolado"
                ],
                "howTo": "1. De costas para a polia baixa, cabo entre as pernas.\n2. Eleve os braços à frente do corpo.\n3. Desça resistindo à tração do cabo.",
                "description": "Tensão constante para desenhar a frente do ombro."
            }
        }
    },
    {
        "id": 102,
        "name": "plate_front_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "chest"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/plate_front_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Plate Front Raise",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Isolation"
                ],
                "howTo": "1. Hold a plate by the sides (9 and 3 o'clock).\n2. Raise to face height.\n3. Keep body stable without swinging.",
                "description": "Functional variation that also builds grip strength."
            },
            "es": {
                "name": "Plate Front Raise",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Aislamiento"
                ],
                "howTo": "1. Sujeta un disco por los lados (posición 9 y 3).\n2. Eleva hasta la altura de la cara.\n3. Mantén el cuerpo estable sin balanceos.",
                "description": "Variación funcional que trabaja también la fuerza de agarre."
            },
            "pt": {
                "name": "Elevação Frontal (Anilha)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Isolado"
                ],
                "howTo": "1. Segure uma anilha pelas laterais (posição 9 e 15h).\n2. Eleve até a altura do rosto.\n3. Mantenha o corpo estável sem balançar.",
                "description": "Variação funcional que trabalha também a força da pegada."
            }
        }
    },
    {
        "id": 103,
        "name": "rear_delt_dumbbell_fly",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/rear_delt_dumbbell_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rear Delt Fly (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Posterior Deltoid",
                    "Rear Delts",
                    "Shoulder Health",
                    "Isolation"
                ],
                "howTo": "1. Lean torso forward (nearly parallel to floor).\n2. Open arms laterally like wings.\n3. Squeeze the back of the shoulders.",
                "description": "Focuses on rear delts and improves posture."
            },
            "es": {
                "name": "Pájaro / Elevação Posterior (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Salud del Hombro",
                    "Aislamiento"
                ],
                "howTo": "1. Tronco inclinado adelante (casi paralelo al suelo).\n2. Abre los brazos lateralmente como alas.\n3. Aprieta la parte trasera de los hombros.",
                "description": "Foco en deltoides posterior y mejora de postura."
            },
            "pt": {
                "name": "Crucifixo Invertido (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Saúde do Ombro",
                    "Isolado"
                ],
                "howTo": "1. Tronco inclinado à frente (quase paralelo ao chão).\n2. Abra os braços lateralmente como asas.\n3. Aperte a parte de trás dos ombros.",
                "description": "Foco no deltoide posterior e melhora da postura."
            }
        }
    },
    {
        "id": 104,
        "name": "rear_delt_machine_fly",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/rear_delt_machine_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rear Delt Fly (Machine)",
                "tags": [
                    "Shoulders",
                    "Posterior Deltoid",
                    "Rear Delts",
                    "Shoulder Health",
                    "Machine",
                    "Isolation"
                ],
                "howTo": "1. Sit facing the machine.\n2. Push the handles back keeping arms firm.\n3. Focus on shoulder movement, not hands.",
                "description": "The safest way to isolate the posterior deltoid."
            },
            "es": {
                "name": "Rear Delt Fly (Máquina)",
                "tags": [
                    "Hombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Salud del Hombro",
                    "Máquina",
                    "Aislamiento"
                ],
                "howTo": "1. Siéntate de frente a la máquina.\n2. Empuja los agarres hacia atrás con brazos firmes.\n3. Enfócate en el hombro, no en las manos.",
                "description": "La forma más segura de aislar el deltoides posterior."
            },
            "pt": {
                "name": "Voador Invertido (Máquina)",
                "tags": [
                    "Ombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Saúde do Ombro",
                    "Máquina",
                    "Isolado"
                ],
                "howTo": "1. Sente-se de frente para a máquina.\n2. Empurre as alças para trás mantendo os braços firmes.\n3. Foque no movimento dos ombros, não das mãos.",
                "description": "A forma mais segura de isolar o deltoide posterior."
            }
        }
    },
    {
        "id": 105,
        "name": "cable_rear_delt_fly",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/cable_rear_delt_fly.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Rear Delt Fly (Cable)",
                "tags": [
                    "Shoulders",
                    "Posterior Deltoid",
                    "Rear Delts",
                    "Shoulder Health",
                    "Isolation"
                ],
                "howTo": "1. Pulleys at high position (cross hands).\n2. Pull arms back and out.\n3. Control the return, crossing hands again.",
                "description": "Excellent for defining the back of the shoulders."
            },
            "es": {
                "name": "Rear Delt Fly (Polea)",
                "tags": [
                    "Hombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Salud del Hombro",
                    "Aislamiento"
                ],
                "howTo": "1. Poleas altas (cruza las manos).\n2. Tira de los brazos hacia atrás y afuera.\n3. Controla el regreso cruzando manos de nuevo.",
                "description": "Excelente para definir la parte trasera de los hombros."
            },
            "pt": {
                "name": "Crucifixo Invertido (Polia)",
                "tags": [
                    "Ombros",
                    "Deltoide Posterior",
                    "Deltoide Posterior",
                    "Saúde do Ombro",
                    "Isolado"
                ],
                "howTo": "1. Cabos na polia alta (cruze as mãos).\n2. Puxe os braços para trás e para fora.\n3. Controle o retorno cruzando as mãos novamente.",
                "description": "Excelente para definir a parte de trás dos ombros."
            }
        }
    },
    {
        "id": 106,
        "name": "barbell_upright_row",
        "category": "shoulders",
        "secondaryMuscles": [
            "biceps",
            "back",
            "forearms"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/barbell_upright_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Upright Row (Barbell)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Bar close to the body.\n2. Pull vertically leading with the elbows.\n3. Stop at chest height to protect shoulders.",
                "description": "Works traps and shoulder width."
            },
            "es": {
                "name": "Upright Row (Barra)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Barra pegada ao corpo.\n2. Tira verticalmente llevando los codos arriba.\n3. Para en el pecho para proteger hombros.",
                "description": "Trabaja trapecio y el ancho de los hombros."
            },
            "pt": {
                "name": "Remada Alta (Barra)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Barra próxima ao corpo.\n2. Puxe verticalmente levando os cotovelos para cima.\n3. Pare na altura do peito para proteger os ombros.",
                "description": "Trabalha trapézio e a largura dos ombros."
            }
        }
    },
    {
        "id": 107,
        "name": "dumbbell_upright_row",
        "category": "shoulders",
        "secondaryMuscles": [
            "biceps",
            "back",
            "forearms"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/dumbbell_upright_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Upright Row (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Compound"
                ],
                "howTo": "1. Dumbbells in front of thighs.\n2. Pull toward chin elevating elbows.\n3. Keep weights close to the torso.",
                "description": "More comfortable for the wrists than the barbell."
            },
            "es": {
                "name": "Upright Row (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Compuesto"
                ],
                "howTo": "1. Mancuernas frente a muslos.\n2. Tira hacia la barbilla elevando codos.\n3. Mantén pesos cerca del tronco.",
                "description": "Más cómodo para las muñecas que la barra."
            },
            "pt": {
                "name": "Remada Alta (Halteres)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Composto"
                ],
                "howTo": "1. Halteres à frente das coxas.\n2. Puxe em direção ao queixo elevando os cotovelos.\n3. Mantenha os pesos próximos ao tronco.",
                "description": "Mais confortável para os pulsos do que a barra."
            }
        }
    },
    {
        "id": 108,
        "name": "cable_upright_row",
        "category": "shoulders",
        "secondaryMuscles": [
            "biceps",
            "back",
            "forearms"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/cable_upright_row.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Upright Row (Cable)",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Compound"
                ],
                "howTo": "1. Use straight bar on low pulley.\n2. Pull to chest, keeping elbows above hands.\n3. Lower with control.",
                "description": "Continuous tension for traps and deltoids."
            },
            "es": {
                "name": "Upright Row (Polea)",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Compuesto"
                ],
                "howTo": "1. Usa barra recta en polea baja.\n2. Tira al pecho, codos sobre las manos.\n3. Baja con control.",
                "description": "Tensión continua para trapecio y deltoides."
            },
            "pt": {
                "name": "Remada Alta (Polia)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Composto"
                ],
                "howTo": "1. Use a barra reta na polia baixa.\n2. Puxe até o peito, mantendo cotovelos acima das mãos.\n3. Desça controladamente.",
                "description": "Tensão contínua para o trapézio e deltoides."
            }
        }
    },
    {
        "id": 109,
        "name": "pike_push_up",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/pike_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Pike Push Up",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Inverted V-position (hips high).\n2. Lower face toward the floor between hands.\n3. Push back to starting position.",
                "description": "Calisthenics exercise for shoulder strength at home."
            },
            "es": {
                "name": "Pike Push Up",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Posición de V invertida (cadera alta).\n2. Baja la cara hacia el suelo entre las manos.\n3. Empuja de vuelta a la posición inicial.",
                "description": "Ejercicio de calistenia para hombros en casa."
            },
            "pt": {
                "name": "Flexão Pike (Ombros)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Posição de V invertido (quadril para o alto).\n2. Desça o rosto em direção ao chão entre as mãos.\n3. Empurre de volta à posição inicial.",
                "description": "Exercício de calistenia para força de ombro em casa."
            }
        }
    },
    {
        "id": 110,
        "name": "handstand_push_up",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/handstand_push_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Handstand Push Up",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Kick up into a handstand against a wall.\n2. Lower the top of your head to the floor.\n3. Explosively push back up.",
                "description": "Peak bodyweight strength for shoulders."
            },
            "es": {
                "name": "Handstand Push Up",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Ponte de manos contra una pared.\n2. Baja el tope de la cabeza al suelo.\n3. Empuja explosivamente hacia arriba.",
                "description": "Máxima fuerza de hombros con peso corporal."
            },
            "pt": {
                "name": "Flexão em Bananeira / HSPU",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Fique de cabeça para baixo contra uma parede.\n2. Desça o topo da cabeça até o chão.\n3. Empurre explosivamente para cima.",
                "description": "O nível máximo de força de ombros com peso do corpo."
            }
        }
    },
    {
        "id": 111,
        "name": "cable_external_rotation",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "cable",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/cable_external_rotation.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "External Rotation (Cable)",
                "tags": [
                    "Shoulders",
                    "Rotator Cuff",
                    "Shoulder Health",
                    "Prehab",
                    "Compound"
                ],
                "howTo": "1. Pulley at elbow height.\n2. Rotate forearm outward keeping elbow tucked.\n3. Use slow and controlled movements.",
                "description": "Strengthens the rotator cuff and prevents injuries."
            },
            "es": {
                "name": "External Rotation (Polea)",
                "tags": [
                    "Hombros",
                    "Manguito Rotador",
                    "Salud del Hombro",
                    "Prehab",
                    "Compuesto"
                ],
                "howTo": "1. Polea a la altura del codo.\n2. Gira el antebrazo afuera con codo pegado.\n3. Movimientos lentos y controlados.",
                "description": "Fortalece el manguito rotador y previene lesiones."
            },
            "pt": {
                "name": "Rotação Externa (Polia)",
                "tags": [
                    "Ombros",
                    "Manguito Rotador",
                    "Saúde do Ombro",
                    "Pré-habilitação",
                    "Composto"
                ],
                "howTo": "1. Polia na altura do cotovelo.\n2. Gire o antebraço para fora mantendo o cotovelo colado.\n3. Faça movimentos lentos e controlados.",
                "description": "Fortalece o manguito rotador e previne lesões."
            }
        }
    },
    {
        "id": 112,
        "name": "dumbbell_external_rotation",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/dumbbell_external_rotation.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "External Rotation (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Rotator Cuff",
                    "Shoulder Health",
                    "Prehab",
                    "Compound"
                ],
                "howTo": "1. Lying on side or seated.\n2. Rotate dumbbell away from body keeping elbow at 90°.\n3. Use light weights for cuff focus.",
                "description": "Basic joint health for any lifter."
            },
            "es": {
                "name": "External Rotation (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Manguito Rotador",
                    "Salud del Hombro",
                    "Prehab",
                    "Compuesto"
                ],
                "howTo": "1. Tumbado de lado o sentado.\n2. Gira la mancuerna lejos del cuerpo (codo 90°).\n3. Usa poco peso para enfocar el manguito.",
                "description": "Salud articular básica para cualquier atleta."
            },
            "pt": {
                "name": "Rotação Externa (Halteres)",
                "tags": [
                    "Ombros",
                    "Manguito Rotador",
                    "Saúde do Ombro",
                    "Pré-habilitação",
                    "Composto"
                ],
                "howTo": "1. Deitado de lado ou sentado.\n2. Gire o halter para longe do corpo mantendo o cotovelo em 90°.\n3. Use cargas leves para foco no manguito.",
                "description": "Saúde articular básica para qualquer praticante."
            }
        }
    },
    {
        "id": 113,
        "name": "landmine_single_arm_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/landmine_single_arm_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Single Arm Landmine Press (Barbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Landmine",
                    "Unilateral",
                    "Barbell",
                    "Hypertrophy",
                    "Compound"
                ],
                "howTo": "1. Hold the end of the loaded barbell at shoulder height with one hand in a sturdy athletic stance.\n2. Brace your core and press the barbell up and forward in a natural diagonal path.\n3. Reach full arm extension focusing on deltoid and upper chest contraction.\n4. Lower the bar slowly under control back to shoulder level.",
                "description": "Unilateral overhead pressing variation using a landmine barbell setup, offering a natural diagonal arc that is shoulder-friendly and builds pressing power and core stability."
            },
            "es": {
                "name": "Press Unilateral en Landmine (Barra)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Landmine",
                    "Unilateral",
                    "Barra",
                    "Hipertrofia",
                    "Compuesto"
                ],
                "howTo": "1. Sujeta el extremo de la barra a la altura del hombro con una mano y una postura firme.\n2. Activa el core y empuja la barra hacia adelante y arriba en diagonal hasta extender el brazo.\n3. Aprieta el deltoide en la parte superior.\n4. Desciende la carga de forma controlada hasta la altura del hombro.",
                "description": "Variación de press unilateral con barra en soporte landmine, que proporciona un arco diagonal óptimo para la fuerza del hombro y la estabilidad del core."
            },
            "pt": {
                "name": "Prensa Unilateral no Landmine (Barra)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Landmine",
                    "Unilateral",
                    "Barra",
                    "Hipertrofia",
                    "Composto"
                ],
                "howTo": "1. Posicione a ponta da barra no ombro segurando com uma das mãos, mantendo a postura firme e base dos pés estável.\n2. Ative o core e empurre a ponta da barra para frente e para cima em trajetória diagonal.\n3. Estenda o braço sem hiperextender o cotovelo, contraindo o deltoide.\n4. Retorne controlando a descida até a altura do ombro antes de iniciar a próxima repetição.",
                "description": "Desenvolvimento unilateral realizado com a barra apoiada em suporte landmine, permitindo uma trajetória diagonal anatômica e altamente segura para a articulação do ombro."
            }
        }
    },
    {
        "id": 511,
        "name": "machine_shoulder_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "machine",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "beginner",
        "parentId": 90,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/machine_shoulder_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Shoulder Press (Machine)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Machine",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Machine Shoulder Press."
            },
            "es": {
                "name": "Shoulder Press (Máquina)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Máquina",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Desarrolla fuerza, estabilidad y volumen en los deltoides con Máquina."
            },
            "pt": {
                "name": "Desenvolvimento (Máquina)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Máquina",
                    "Composto"
                ],
                "howTo": "1. Ajuste a carga na altura dos ombros e trave o core.\n2. Empurre o peso para cima até a extensão dos braços acima da cabeça.\n3. Controle o retorno até a linha das orelhas/queixo.",
                "description": "Desenvolve força, estabilidade e volume nas três porções do deltoide com Máquina."
            }
        }
    },
    {
        "id": 527,
        "name": "single_arm_dumbbell_shoulder_press",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 90,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/single_arm_dumbbell_shoulder_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Single Arm Shoulder Press (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Full Shoulder",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Single Arm Dumbbell Shoulder Press."
            },
            "es": {
                "name": "Single Arm Shoulder Press (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Hombro Completo",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Desarrolla fuerza, estabilidad y volumen en los deltoides con Mancuernas."
            },
            "pt": {
                "name": "Desenvolvimento Unilateral (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Ombro Completo",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Ajuste a carga na altura dos ombros e trave o core.\n2. Empurre o peso para cima até a extensão dos braços acima da cabeça.\n3. Controle o retorno até a linha das orelhas/queixo.",
                "description": "Desenvolve força, estabilidade e volume nas três porções do deltoide com Halteres."
            }
        }
    },
    {
        "id": 528,
        "name": "incline_dumbbell_lateral_raise",
        "category": "shoulders",
        "secondaryMuscles": [
            "back"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "isolation",
        "level": "intermediate",
        "parentId": 95,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/incline_dumbbell_lateral_raise.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Incline Lateral Raise (Dumbbell)",
                "tags": [
                    "Shoulders",
                    "Medial Deltoid",
                    "Shaping",
                    "Isolation"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Incline Dumbbell Lateral Raise."
            },
            "es": {
                "name": "Incline Lateral Raise (Mancuernas)",
                "tags": [
                    "Hombros",
                    "Deltoide Medial",
                    "Esculpido",
                    "Aislamiento"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Desarrolla fuerza, estabilidad y volumen en los deltoides con Mancuernas."
            },
            "pt": {
                "name": "Elevação Lateral Banco Inclinado (Halteres)",
                "tags": [
                    "Ombros",
                    "Deltoide Medial",
                    "Lapidação/Desenho",
                    "Isolado"
                ],
                "howTo": "1. Mantenha a postura ereta e o abdômen contraído.\n2. Eleve os braços de forma controlada até a altura dos ombros.\n3. Desça resistindo à gravidade sem usar impulso do tronco.",
                "description": "Desenvolve força, estabilidade e volume nas três porções do deltoide com Halteres."
            }
        }
    },
    {
        "id": 596,
        "name": "handstand_walk",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "chest",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "alternating",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": 109,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/handstand_walk.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Handstand Walk",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Handstand Walk."
            },
            "es": {
                "name": "Handstand Walk",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Desarrolla fuerza, estabilidad y volumen en los deltoides."
            },
            "pt": {
                "name": "Caminhada em Bananeira (Handstand Walk)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Ajuste a carga na altura dos ombros e trave o core.\n2. Empurre o peso para cima até a extensão dos braços acima da cabeça.\n3. Controle o retorno até a linha das orelhas/queixo.",
                "description": "Desenvolve força, estabilidade e volume nas três porções do deltoide com Handstand Walk."
            }
        }
    },
    {
        "id": 597,
        "name": "wall_walk",
        "category": "shoulders",
        "secondaryMuscles": [
            "triceps",
            "back"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 109,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/wall_walk.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Wall Walk",
                "tags": [
                    "Shoulders",
                    "Full Shoulder",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Wall Walk."
            },
            "es": {
                "name": "Wall Walk",
                "tags": [
                    "Hombros",
                    "Hombro Completo",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Desarrolla fuerza, estabilidad y volumen en los deltoides."
            },
            "pt": {
                "name": "Escalada na Parede (Wall Walk)",
                "tags": [
                    "Ombros",
                    "Ombro Completo",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Ajuste a carga na altura dos ombros e trave o core.\n2. Empurre o peso para cima até a extensão dos braços acima da cabeça.\n3. Controle o retorno até a linha das orelhas/queixo.",
                "description": "Desenvolve força, estabilidade e volume nas três porções do deltoide com Wall Walk."
            }
        }
    },
    {
        "id": 603,
        "name": "planche_hold",
        "category": "shoulders",
        "secondaryMuscles": [
            "chest",
            "core",
            "biceps",
            "forearms"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/shoulders/planche_hold.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Planche Hold (Calisthenics)",
                "tags": [
                    "Shoulders",
                    "Anterior Deltoid",
                    "Calisthenics",
                    "Isometric",
                    "Bodyweight",
                    "Advanced",
                    "Compound"
                ],
                "howTo": "1. Place hands on the floor or parallettes with arms completely straight and elbows locked.\n2. Lean your shoulders forward with strong scapular protraction and hollow body position.\n3. Lift your feet off the floor, keeping your legs and torso straight and parallel to the ground.\n4. Hold the static position for the target duration with steady breathing.",
                "description": "Elite calisthenics isometric hold demanding extreme anterior deltoid strength, scapular protraction, and full-body tension to suspend the body parallel to the ground."
            },
            "es": {
                "name": "Planche Isométrica (Calistenia)",
                "tags": [
                    "Hombros",
                    "Deltoide Anterior",
                    "Calistenia",
                    "Isometría",
                    "Peso Corporal",
                    "Avanzado",
                    "Compuesto"
                ],
                "howTo": "1. Apoya las manos en el suelo o barras paralelas con los brazos completamente rectos y codos bloqueados.\n2. Inclina los hombros hacia adelante con protracción escapular manteniendo el cuerpo alineado.\n3. Eleva los pies del suelo manteniendo piernas y torso paralelos al suelo.\n4. Sostén la posición isométrica durante el tiempo establecido respirando de forma controlada.",
                "description": "Movimiento estático avanzado de calistenia que demanda máxima fuerza en los deltoides anteriores, protracción escapular y tensión del core para mantener el cuerpo paralelo al suelo."
            },
            "pt": {
                "name": "Planche Isométrica (Calistenia)",
                "tags": [
                    "Ombros",
                    "Deltoide Anterior",
                    "Calistenia",
                    "Isometria",
                    "Peso Corporal",
                    "Avançado",
                    "Composto"
                ],
                "howTo": "1. Apoie as mãos no chão ou em parallettes com os braços totalmente estendidos e cotovelos bloqueados.\n2. Projete os ombros para a frente (protração escapular) mantendo o corpo reto e paralelo ao solo.\n3. Contraia glúteos, abdômen e pernas mantendo os pés fora do chão.\n4. Sustente a posição isométrica pelo tempo determinado respirando de forma controlada.",
                "description": "Exercício estático avançado de calistenia que exige extrema força dos deltoides anteriores, serrátil e core para sustentar o corpo suspenso no ar."
            }
        }
    }
];
