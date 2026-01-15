import { db } from '@/config/db';
import { Session, History, Workout } from '@/config/types';
import Swal from 'sweetalert2';

export const SessionService = {

    async onPlayWorkout(workout: Workout, router: any, theme?: any) {
        Swal.fire({
            title: 'Iniciar Treino?',
            text: "Você está pronto para começar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#ef4444',
            confirmButtonText: 'Sim, vamos!',
            cancelButtonText: 'Agora não',
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#f4f4f5' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const sessionId = await this.startSession(workout!);
                router.push(`/session/${sessionId}`);
            }
        });
    },

    async onResumeWorkout(sessionId: number, router: any, theme?: any) {
        Swal.fire({
            title: 'Continuar Treino?',
            text: "Você tem um treino em andamento. Vamos voltar?",
            icon: 'info',
            showCancelButton: true,
            showDenyButton: true, // Adicionado botão para deletar caso queira desistir
            confirmButtonColor: '#22c55e',
            denyButtonColor: '#ef4444',
            confirmButtonText: 'Continuar!',
            denyButtonText: 'Descartar Treino',
            cancelButtonText: 'Agora não',
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#f4f4f5' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await this.resumeSession(sessionId); // Atualiza referencial de tempo
                router.push(`/session/${sessionId}`);
            } else if (result.isDenied) {
                // Caso o usuário queira apagar a sessão velha e começar de novo
                await this.deleteSession(sessionId);
                Swal.fire('Deletado!', 'A sessão foi descartada.', 'success');
            }
        });
    },

    async onExitSession(sessionId: number, router: any, theme?: any) {
        return Swal.fire({
            title: 'Pausar Treino?',
            text: "O tempo será pausado e você poderá continuar mais tarde na Home.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#22c55e',
            cancelButtonColor: '#71717a',
            confirmButtonText: 'Sim, pausar e sair',
            cancelButtonText: 'Cancelar',
            background: theme === 'dark' ? '#18181b' : '#ffffff',
            color: theme === 'dark' ? '#f4f4f5' : '#18181b',
        }).then(async (result) => {
            if (result.isConfirmed) {
                await this.pauseSession(sessionId); // Salva o tempo e marca pause
                router.push('/home');
            }
        });
    },



    /**
   * 1. INICIAR SESSÃO
   * Cria uma nova sessão baseada em um treino (Workout).
   * Faz o snapshot dos exercícios para garantir que alterações no treino original
   * não afetem a sessão em andamento.
   */
    async startSession(workout: Workout): Promise<number> {
        const newSession: Session = {
            userId: workout.userId,
            workoutId: workout.id as number,
            workoutName: workout.name,
            createdAt: new Date(),
            exercisesToDo: workout.exercises,
            exercisesDone: [],
            current: {
                exerciseIndex: 0,
                setIndex: 0,
                step: 'executing'
            },
            duration: 0, // Inicia com 0ms
            pausedAt: null, // null significa que está em andamento
            resumedAt: new Date()
        };

        return await db.sessions.add(newSession as any);
    },

    async resumeSession(sessionId: number) {
        const session = await db.sessions.get(sessionId);
        if (!session) return;

        return await db.sessions.update(sessionId, {
            pausedAt: null,
            resumedAt: new Date()
        });
    },

    async pauseSession(sessionId: number) {

        const session = await db.sessions.get(sessionId);

        if (!session || !session.resumedAt || session.pausedAt) return;

        const now = new Date();
        const lastReference = session.resumedAt;
        const additionalDuration = now.getTime() - lastReference.getTime();

        return await db.sessions.update(sessionId, {
            pausedAt: now,
            duration: session.duration + additionalDuration
        });
    },

    /**
     * Busca o sessão dentro de um intervalo de datas (para gráficos).
     */
    async getSessionByRange(userId: number, startDate: Date, endDate: Date) {
        return await db.sessions
            .where('userId')
            .equals(userId)
            .filter(log => log.createdAt >= startDate && log.createdAt <= endDate)
            .toArray();
    },

    /**
   * 2. BUSCAR SESSÃO ATIVA
   * Recupera a sessão atual do usuário para continuar de onde parou.
   */
    async getSessionsByUserId(userId: number) {
        return await db.sessions
            .where('userId')
            .equals(userId)
            .reverse()
            .toArray();
    },

    async getSessionById(sessionId: number) {
        return await db.sessions.get(sessionId)
    },

    /**
  * 3. SINCRONIZAR PROGRESSO (Real-time)
  * Atualiza o estado da sessão conforme o usuário completa séries ou exercícios.
  */
    async syncSessionProgress(sessionId: number, updates: Partial<Session>): Promise<void> {
        await db.sessions.update(sessionId, updates);
    },


    /**
     * 4. FINALIZAR SESSÃO E GERAR HISTÓRICO
     * Transforma a sessão em um registro de histórico e remove a sessão ativa.
     */
    async finishSession(sessionId: number, additionalData?: { weight?: number, description?: string, usingCreatine?: boolean }) {
        const session = await db.sessions.get(sessionId);
        if (!session) throw new Error("Sessão não encontrada");

        const historyRecord: History = {
            userId: session.userId,
            workoutId: session.workoutId,
            workoutName: session.workoutName,
            date: session.createdAt,
            endDate: new Date(),
            duration: session.duration,
            ...additionalData,
            executions: session.exercisesDone as any
        };

        const historyId = await db.history.add(historyRecord);

        await db.sessions.delete(sessionId);

        return historyId as number;
    },

    /**
     * 5. CANCELAR/EXCLUIR SESSÃO
     * Caso o usuário queira desistir do treino sem salvar nada.
     */
    async deleteSession(sessionId: number) {
        await db.sessions.delete(sessionId);
    },

    /**
     * 6. BUSCAR HISTÓRICO RECENTE
     * Utiliza a lógica solicitada anteriormente.
     */
    async getUserHistory(userId: number) {
        return await db.history
            .where('userId')
            .equals(userId)
            .reverse()
            .sortBy('date');
    }
};