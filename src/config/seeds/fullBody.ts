import { Exercise } from '../types';

export const FULL_BODY_EXERCISES: Exercise[] = [
    {
        "id": 480,
        "name": "barbell_clean_and_press",
        "category": "full_body",
        "secondaryMuscles": [
            "back",
            "quadriceps",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/barbell_clean_and_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Clean And Press (Barbell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Pull the bar from the floor with an explosive move to your shoulders (Clean).\n2. Stabilize your body and press the bar overhead (Press).\n3. Keep your core tight to protect your lower back throughout the movement.",
                "description": "A classic strength movement that takes the weight from the floor to overhead."
            },
            "es": {
                "name": "Clean And Press (Barra)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Tira de la barra desde el suelo con un movimiento explosivo hasta los hombros (Clean).\n2. Estabiliza el cuerpo y empuja la barra sobre la cabeza (Press).\n3. Mantén el core firme para proteger la zona lumbar durante todo el trayecto.",
                "description": "Un movimiento de fuerza clásico que lleva el peso desde el suelo hasta por encima de la cabeza."
            },
            "pt": {
                "name": "Clean & Press / Arremesso (Barra)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Tire a barra do chão com um movimento explosivo até aos ombros (Clean).\n2. Estabilize o corpo e empurre a barra acima da cabeça (Press).\n3. Mantenha o core firme para proteger a lombar durante todo o trajeto.",
                "description": "Um movimento clássico de força que leva o peso do chão até acima da cabeça."
            }
        }
    },
    {
        "id": 481,
        "name": "barbell_snatch",
        "category": "full_body",
        "secondaryMuscles": [
            "shoulders",
            "back",
            "quadriceps",
            "glutes",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/barbell_snatch.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Snatch (Barbell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. With a wide grip, pull the bar from the floor explosively.\n2. In a single motion, catch the bar overhead while dropping into a squat.\n3. Stand up completely with the bar stabilized.",
                "description": "The most complex Olympic weightlifting lift, requiring speed and precision."
            },
            "es": {
                "name": "Snatch (Barra)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Con un agarre ancho, tira de la barra desde el suelo de forma explosiva.\n2. En un solo movimiento, recibe la barra sobre la cabeza mientras te pones en cuclillas.\n3. Ponte de pie completamente con la barra estabilizada.",
                "description": "El levantamiento más complejo del pesas olímpicas, requiere velocidad y precisión."
            },
            "pt": {
                "name": "Snatch / Arranco (Barra)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Com uma pegada larga, puxe a barra do chão de forma explosiva.\n2. Num movimento único, receba a barra acima da cabeça enquanto agacha.\n3. Fique em pé completamente com a barra estabilizada.",
                "description": "O exercício mais complexo do levantamento de peso olímpico, exigindo velocidade e precisão."
            }
        }
    },
    {
        "id": 482,
        "name": "barbell_thruster",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/barbell_thruster.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Thruster (Barbell)",
                "tags": [
                    "Full Body",
                    "Functional",
                    "High Intensity",
                    "Power",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. With the bar on your shoulders, perform a deep front squat.\n2. As you rise, use the leg drive to push the bar overhead.\n3. The movement should be continuous and rhythmic.",
                "description": "A fluid combination of a front squat and an overhead press."
            },
            "es": {
                "name": "Thruster (Barra)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Alta Intensidad",
                    "Potencia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Con la barra en los hombros, realiza una sentadilla frontal profunda.\n2. Al subir, usa el impulso de las piernas para empujar la barra sobre la cabeza.\n3. El movimiento debe ser continuo y rítmico.",
                "description": "Combinación fluida de sentadilla frontal y press de hombros."
            },
            "pt": {
                "name": "Thruster (Barra)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Alta Intensidade",
                    "Potência",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Com a barra nos ombros, realize um agachamento profundo.\n2. Ao subir, use o impulso das pernas para empurrar a barra acima da cabeça.\n3. O movimento deve ser contínuo e rítmico.",
                "description": "Combinação fluida de agachamento frontal e desenvolvimento de ombros."
            }
        }
    },
    {
        "id": 484,
        "name": "dumbbell_man_makers",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/dumbbell_man_makers.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Man Makers (Dumbbell)",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. In a plank position holding dumbbells, perform a push-up and a row with each arm.\n2. Jump into a squat position and stand up with dumbbells on your shoulders.\n3. Finish by pressing the dumbbells overhead.",
                "description": "An intense sequence mixing push-ups, rows, squats, and overhead presses."
            },
            "es": {
                "name": "Man Makers (Mancuernas)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. En posición de plancha con mancuernas, haz una flexión y un remo con cada brazo.\n2. Salta a posición de sentadilla y sube con las mancuernas en los hombros.\n3. Finaliza empujando las mancuernas sobre la cabeza.",
                "description": "Secuencia intensa que mezcla flexión, remo, sentadilla y press de hombros."
            },
            "pt": {
                "name": "Man Makers (Halteres)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Na posição de prancha com halteres, faça uma flexão e uma remada com cada braço.\n2. Salte para a posição de agachamento e suba com os halteres nos ombros.\n3. Finalize empurrando os halteres acima da cabeça.",
                "description": "Sequência intensa que mistura flexão, remada, agachamento e desenvolvimento."
            }
        }
    },
    {
        "id": 485,
        "name": "dumbbell_snatch_unilateral",
        "category": "full_body",
        "secondaryMuscles": [
            "shoulders",
            "back",
            "quadriceps",
            "glutes",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/dumbbell_snatch_unilateral.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Snatch Unilateral (Dumbbell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. With the dumbbell on the floor between your feet, pull it up rapidly.\n2. Keep the weight close to your body and extend your arm overhead in one motion.\n3. Alternate arms for each repetition.",
                "description": "An accessible snatch version that builds explosion and coordination."
            },
            "es": {
                "name": "Arrancada Unilateral (Mancuerna)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Con la mancuerna en el suelo entre los pies, tira de ella hacia arriba rápidamente.\n2. Mantén el peso cerca del cuerpo y extiende el brazo sobre la cabeza en un solo movimiento.\n3. Alterna los brazos en cada repetición.",
                "description": "Versión accesible del snatch que trabaja explosión y coordinación."
            },
            "pt": {
                "name": "Arranco Unilateral (Haltere)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Com o halter no chão entre os pés, puxe-o para cima rapidamente.\n2. Mantenha o peso rente ao corpo e estenda o braço acima da cabeça num só movimento.\n3. Alterne os braços em cada repetição.",
                "description": "Versão acessível do snatch que trabalha explosão e coordenação."
            }
        }
    },
    {
        "id": 486,
        "name": "turkish_get_up",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "kettlebell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/turkish_get_up.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Turkish Get Up (Kettlebell)",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Kettlebell",
                    "Compound"
                ],
                "howTo": "1. Start lying down with one arm extended holding the weight.\n2. Follow the steps to sit up, kneel, and finally stand up, never bending the arm.\n3. Reverse the process until you are lying down again.",
                "description": "The ultimate test of stability, mobility, and total body strength."
            },
            "es": {
                "name": "Levantamiento Turco (Turkish Get-Up)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Pesa Rusa",
                    "Compuesto"
                ],
                "howTo": "1. Comienza tumbado con un brazo estirado sosteniendo el peso.\n2. Sigue los pasos para sentarte, arrodillarte y finalmente ponerte de pie, sin doblar el brazo.\n3. Invierte el proceso hasta estar tumbado de nuevo.",
                "description": "La prueba definitiva de estabilidad, movilidad y fuerza total del cuerpo."
            },
            "pt": {
                "name": "Levantamento Turco (Turkish Get-Up)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Kettlebell",
                    "Composto"
                ],
                "howTo": "1. Comece deitado com um braço esticado segurando o peso.\n2. Siga as etapas para se sentar, ajoelhar e finalmente ficar em pé, sem nunca dobrar o braço.\n3. Inverta o processo até estar deitado novamente.",
                "description": "O teste definitivo de estabilidade, mobilidade e força total do corpo."
            }
        }
    },
    {
        "id": 488,
        "name": "bear_crawl",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/bear_crawl.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Bear Crawl",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. On all fours (hands and feet), keep your hips low and your back flat.\n2. Walk forward by moving the opposite arm and foot simultaneously.\n3. Keep your knees close to the ground without touching it.",
                "description": "Locomotion movement that challenges the core, shoulders, and coordination."
            },
            "es": {
                "name": "Paso de Oso (Bear Crawl)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. En 4 apoyos (manos y pies), mantén la cadera baja y la espalda plana.\n2. Camina hacia adelante moviendo el brazo y el pie opuestos simultáneamente.\n3. Mantén las rodillas cerca del suelo sin tocarlo.",
                "description": "Movimiento de locomoción que desafía el core, hombros y coordinación."
            },
            "pt": {
                "name": "Caminhada do Urso (Bear Crawl)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Em 4 apoios (mãos e pés), mantenha o quadril baixo e as costas retas.\n2. Caminhe para a frente movendo o braço e o pé opostos simultaneamente.\n3. Mantenha os joelhos próximos ao chão, mas sem tocá-lo.",
                "description": "Movimento de locomoção que desafia o core, ombros e coordenação."
            }
        }
    },
    {
        "id": 489,
        "name": "medicine_ball_slam",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/medicine_ball_slam.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Medicine Ball Slam",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. Raise the ball overhead with arms extended.\n2. Throw the ball against the floor with maximum force, using your entire body.\n3. Squat to pick up the ball and repeat.",
                "description": "Develops explosive power and abdominal strength."
            },
            "es": {
                "name": "Lanzamiento Potente de Balón Medicinal",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. Eleva el balón sobre la cabeza con los brazos estirados.\n2. Lanza el balón contra el suelo con la máxima fuerza posible, usando todo el cuerpo.\n3. Haz una sentadilla para recoger el balón y repite.",
                "description": "Desarrolla potencia explosiva y fuerza abdominal."
            },
            "pt": {
                "name": "Slam com Medicine Ball",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Eleve a bola acima da cabeça com os braços esticados.\n2. Arremesse a bola contra o chão com o máximo de força possível, usando todo o corpo.\n3. Agache para apanhar a bola e repita.",
                "description": "Desenvolve potência explosiva e força abdominal."
            }
        }
    },
    {
        "id": 490,
        "name": "tire_flip",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "none",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/tire_flip.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Tire Flip",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. Squat deep and place your hands under the tire.\n2. Explode upward using your legs and push the tire over.\n3. Keep your chest against the tire and your spine neutral.",
                "description": "Functional brute strength exercise recruiting legs, back, and arms."
            },
            "es": {
                "name": "Volteo de Neumático (Tire Flip)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. Haz una sentadilla profunda y coloca las manos bajo el neumático.\n2. Explota hacia arriba usando las piernas y empuja el neumático para que vuelque.\n3. Mantén el pecho contra el neumático y la columna neutra.",
                "description": "Ejercicio de fuerza bruta funcional que recluta piernas, espalda y brazos."
            },
            "pt": {
                "name": "Tombamento de Pneu (Tire Flip)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Agache profundamente e coloque as mãos sob o pneu.\n2. Exploda para cima usando as pernas e empurre o pneu para que ele tombe.\n3. Mantenha o peito contra o pneu e a coluna neutra.",
                "description": "Exercício de força bruta funcional que recruta pernas, costas e braços."
            }
        }
    },
    {
        "id": 576,
        "name": "wall_ball_shot",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "medicine_ball",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/wall_ball_shot.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Wall Ball Shot (Medicine Ball)",
                "tags": [
                    "Full Body",
                    "Functional",
                    "High Intensity",
                    "Power",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Wall Ball Shot."
            },
            "es": {
                "name": "Wall Ball Shot (Balón Medicinal)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Alta Intensidad",
                    "Potencia",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Wall Ball (Lançamento de Bola)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Alta Intensidade",
                    "Potência",
                    "Composto"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 579,
        "name": "burpee_box_jump_over",
        "category": "full_body",
        "secondaryMuscles": [
            "chest",
            "quadriceps",
            "back",
            "core",
            "shoulders"
        ],
        "equipment": "bodyweight",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": 428,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/burpee_box_jump_over.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Burpee Box Jump Over",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Bodyweight",
                    "Home",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Burpee Box Jump Over."
            },
            "es": {
                "name": "Burpee Box Jump Over",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Peso Corporal",
                    "En Casa",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Burpee com Salto na Caixa",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Peso Corporal",
                    "Em Casa",
                    "Composto"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 580,
        "name": "dumbbell_devil_press",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "dumbbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/dumbbell_devil_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Devil Press (Dumbbell)",
                "tags": [
                    "Full Body",
                    "Functional",
                    "Strength",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Dumbbell Devil Press."
            },
            "es": {
                "name": "Devil Press (Mancuernas)",
                "tags": [
                    "Cuerpo Completo",
                    "Funcional",
                    "Fuerza",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Devil Press (Halteres)",
                "tags": [
                    "Corpo Todo",
                    "Funcional",
                    "Força",
                    "Composto"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 581,
        "name": "kettlebell_snatch",
        "category": "full_body",
        "secondaryMuscles": [
            "shoulders",
            "back",
            "quadriceps",
            "glutes",
            "core"
        ],
        "equipment": "kettlebell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/kettlebell_snatch.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Snatch (Kettlebell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Kettlebell",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Kettlebell Snatch."
            },
            "es": {
                "name": "Arrancada / Snatch (Kettlebell)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Pesa Rusa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Snatch / Arranco (Kettlebell)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Kettlebell",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 582,
        "name": "kettlebell_clean_and_press",
        "category": "full_body",
        "secondaryMuscles": [
            "back",
            "quadriceps",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "kettlebell",
        "executionMode": "unilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/kettlebell_clean_and_press.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Clean And Press (Kettlebell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Kettlebell",
                    "Compound",
                    "Unilateral"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Kettlebell Clean And Press."
            },
            "es": {
                "name": "Cargada y Press (Kettlebell)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Pesa Rusa",
                    "Compuesto",
                    "Unilateral"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Clean & Press (Kettlebell)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Kettlebell",
                    "Composto",
                    "Unilateral"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 586,
        "name": "power_clean",
        "category": "full_body",
        "secondaryMuscles": [
            "back",
            "quadriceps",
            "glutes",
            "hamstrings",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "intermediate",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/power_clean.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Power Clean (Barbell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Power Clean."
            },
            "es": {
                "name": "Power Clean (Barra)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Power Clean (Barra)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    },
    {
        "id": 600,
        "name": "split_jerk",
        "category": "full_body",
        "secondaryMuscles": [
            "quadriceps",
            "shoulders",
            "triceps",
            "glutes",
            "core"
        ],
        "equipment": "barbell",
        "executionMode": "bilateral",
        "mechanics": "compound",
        "level": "advanced",
        "parentId": null,
        "imageUrl": "https://fkoppszkihbgpsottpfq.supabase.co/storage/v1/object/public/exercises/full_body/split_jerk.webp",
        "videoUrl": null,
        "gallery": [],
        "created_by_type": "system",
        "translations": {
            "en": {
                "name": "Split Jerk (Barbell)",
                "tags": [
                    "Full Body",
                    "Olympic",
                    "Explosive",
                    "Power",
                    "Barbell",
                    "Compound"
                ],
                "howTo": "1. Set up proper body alignment and lock your core.\n2. Execute the concentric phase focusing on target muscle contraction.\n3. Control the eccentric return through a full range of motion.",
                "description": "Technical execution for Split Jerk."
            },
            "es": {
                "name": "Split Jerk (Barra)",
                "tags": [
                    "Cuerpo Completo",
                    "Olímpico",
                    "Explosivo",
                    "Potencia",
                    "Barra",
                    "Compuesto"
                ],
                "howTo": "1. Mantenga una postura recta y el abdomen contraído.\n2. Realice la fase de contracción enfocado en el músculo objetivo.\n3. Controle el retorno de forma lenta completando el rango de movimiento.",
                "description": "Movimiento funcional para el desarrollo físico completo y acondicionamiento."
            },
            "pt": {
                "name": "Split Jerk (Barra)",
                "tags": [
                    "Corpo Todo",
                    "Olímpico",
                    "Explosivo",
                    "Potência",
                    "Barra",
                    "Composto"
                ],
                "howTo": "1. Inicie na posição de alinhamento postural correto.\n2. Execute a fase concêntrica do movimento com foco na contração do músculo alvo.\n3. Retorne de forma lenta e controlada completando a amplitude adequada.",
                "description": "Movimento funcional potente para desenvolvimento físico completo e condicionamento."
            }
        }
    }
];
