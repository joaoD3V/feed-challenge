import { Comment } from '@/@types/JSONPlaceholder';
import { api } from '@/lib/axios';

export async function getComments() {
  try {
    const commentsResponse = await api.get<Comment[]>('/comments');

    return commentsResponse.data;
  } catch {
    throw new Error('Request failed.');
  }
}
