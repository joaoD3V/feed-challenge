import { useState } from 'react';
import { toast } from 'sonner';

import { Post as PostType, User } from '@/@types/JSONPlaceholder';
import { queryClient } from '@/lib/react-query';
import { delay } from '@/utils/delay';
import { userMapper } from '@/utils/user-mapper';

import { Post } from '.';

type PostsAreaProps = {
  posts: PostType[];
  currentUser: User;
};

export function PostsArea({ posts, currentUser }: PostsAreaProps) {
  const [postIdSelected, setPostIdSelected] = useState<number | null>(null);

  const usersList = queryClient.getQueryData<User[]>(['users']) ?? [];

  async function handleRemovePost(id: number) {
    setPostIdSelected(id);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['posts'], (prev: PostType[]) =>
      prev.filter((p) => p.id !== id)
    );

    queryClient.setQueryData(['comments', postIdSelected], []);

    toast.success('Post excluído com sucesso! 😀');
    setPostIdSelected(null);
  }

  async function handleEditingPost(id: number, newPostUpdated: string) {
    setPostIdSelected(id);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['posts'], (prev: PostType[]) => {
      const postIndex = prev.findIndex((p) => p.id === id);
      prev[postIndex].body = newPostUpdated;
      return [...prev];
    });

    toast.success('Post atualizado com sucesso! 😀');
    setPostIdSelected(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-8">
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          user={userMapper({
            usersList,
            id: post.userId,
            currentUser: currentUser!,
          })}
          content={post.body}
          onRemovePost={handleRemovePost}
          onEditingPost={handleEditingPost}
          isOnAction={post.id === postIdSelected}
        />
      ))}
    </div>
  );
}
