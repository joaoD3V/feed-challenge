import { User } from '@/@types/JSONPlaceholder';
import { api } from '@/lib/axios';

export async function getUsers() {
  try {
    const usersReponse = await api.get<User[]>('/users');
    return usersReponse.data;
  } catch {
    throw new Error('Request failed.');
  }
}
