import { Post } from '@/@types/JSONPlaceholder';
import { api } from '@/lib/axios';

export async function getPostByUserId(userId: number) {
  try {
    const postsResponse = await api.get<Post[]>(`/users/${userId}/posts`);

    return postsResponse.data;
  } catch {
    throw new Error('Request failed.');
  }
}
