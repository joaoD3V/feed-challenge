import { Comment } from '@/@types/JSONPlaceholder';
import { api } from '@/lib/axios';

export async function getCommentsByPostId(postId: number) {
  try {
    const commentsResponse = await api.get<Comment[]>(
      `/posts/${postId}/comments`
    );

    return commentsResponse.data;
  } catch {
    throw new Error('Request failed.');
  }
}
