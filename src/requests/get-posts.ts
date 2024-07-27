import { Post } from '@/@types/JSONPlaceholder';
import { api } from '@/lib/axios';

export async function getPosts() {
  try {
    const postsResponse = await api.get<Post[]>('/posts');

    return postsResponse.data;
  } catch {
    throw new Error('Request failed.');
  }
}
