import { db } from '@/config/db';
import { Session, History, Workout } from '@/config/types';
import Swal from 'sweetalert2';

export const SessionService = {

    async onPlayWorkout(workout: any, router: any, theme?: any) {
        Swal.fire({
            title: 'Iniciar Treino?',
            text: "Você está pronto para começar?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#22c55e', // lime-600
            cancelButtonColor: '#ef4444', // red-500
            confirmButtonText: 'Sim, vamos!',
            cancelButtonText: 'Agora não',
            // Adaptação de tema via Tailwind/CSS
            background: theme === 'dark' ? '#1f2937' : '#ffffff', // gray-800 ou white
            color: theme === 'dark' ? '#f9fafb' : '#111827',      // gray-50 ou gray-900
        }).then(async (result) => {
            if (result.isConfirmed) {
                const sessionId = await this.startSession(workout!);
                router.push(`/session/${sessionId}`);
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
            exercisesDone: [], // Começa vazio
            current: {
                exerciseIndex: 0,
                setIndex: 0,
                step: 'executing'
            }
        };

        return await db.sessions.add(newSession as any);
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
    async finishSession(sessionId: number, additionalData?: { weight?: number, description?: string }) {
        const session = await db.sessions.get(sessionId);
        if (!session) throw new Error("Sessão não encontrada");

        const historyRecord: History = {
            userId: session.userId,
            workoutId: session.workoutId,
            workoutName: session.workoutName,
            date: session.createdAt,
            endDate: new Date(),
            ...additionalData,
            executions: session.exercisesDone as any
        };

        // 1. Salva no histórico
        const historyId = await db.history.add(historyRecord);

        // 2. Remove a sessão ativa
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