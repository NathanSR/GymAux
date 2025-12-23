import { db } from '@/config/db';
import { User } from '@/config/types';

export const userService = {
    // Buscar todos
    async getAllUsers() {
        return await db.users.toArray();
    },

    // Buscar por ID
    async getUserById(id: number) {
        return await db.users.get(id);
    },

    // Criar novo com regras de negócio
    async createUser(userData: Omit<User, 'id' | 'createdAt'>) {
        // Exemplo de regra de negócio: Garantir que o nome esteja capitalizado
        const formattedName = userData.name.trim();

        if (formattedName.length < 2) {
            throw new Error("Name too short");
        }

        return await db.users.add({
            ...userData,
            name: formattedName,
            createdAt: new Date()
        });
    },

    // Deletar usuário e seus treinos (cascata manual)
    async deleteUser(id: number) {
        return await db.transaction('rw', [db.users, db.workouts, db.history], async () => {
            await db.history.where('userId').equals(id).delete();
            await db.workouts.where('userId').equals(id).delete();
            await db.users.delete(id);
        });
    }
};