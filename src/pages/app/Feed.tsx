import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Post as PostType } from '@/@types/JSONPlaceholder';
import { Post } from '@/components/Post';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { userMock } from '@/factories/user';
import { queryClient } from '@/lib/react-query';
import { Error } from '@/pages/Error';
import { getComments } from '@/requests/get-comments';
import { getPosts } from '@/requests/get-posts';
import { getUsers } from '@/requests/get-users';
import { delay } from '@/utils/delay';
import { userMapper } from '@/utils/user-mapper';

export function Feed() {
  const [postIdSelected, setPostIdSelected] = useState<number | null>(null);

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isLoadingError: isLoadingPostsError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: Infinity,
  });

  // Infelizmente, dada a limitção da API, não consegui outra forma de obter o número total de comments a não ser por esse request
  // Preciso do último id do comment para garantir ids únicos nas operações necessárias
  const {
    data: comments,
    isLoading: isLoadingComments,
    isLoadingError: isLoadingCommentsError,
  } = useQuery({
    queryKey: ['comments'],
    queryFn: () => getComments(),
    staleTime: Infinity,
  });

  useEffect(() => {
    // O id do post será recupedado no CreateNewPost.tsx
    if (posts && !sessionStorage.getItem('postId')) {
      sessionStorage.setItem('postId', String(posts[posts.length - 1].id));
    }
  }, [posts]);

  useEffect(() => {
    // O id do comment será recupedado no CommentsArea.tsx
    if (comments && !sessionStorage.getItem('commentId')) {
      sessionStorage.setItem(
        'commentId',
        String(comments[comments.length - 1].id)
      );
    }
  }, [comments]);

  const {
    data: users,
    isLoading: isLoadingUsers,
    isLoadingError: isLoadingUsersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    staleTime: Infinity,
    select(data) {
      return [...data, userMock];
    },
  });

  if (isLoadingPostsError || isLoadingUsersError || isLoadingCommentsError) {
    return <Error />;
  }

  const currentUser = userMock;

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
    <main className="relative flex items-start gap-8">
      <ProfileResume
        user={{
          id: currentUser.id,
          name: currentUser.name,
          username: currentUser.username,
          email: currentUser.email,
        }}
      />

      {isLoadingPosts || isLoadingUsers || isLoadingComments ? (
        <div className="flex-1 space-y-8">
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          {posts!.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              user={userMapper({ usersList: users!, id: post.userId })}
              content={post.body}
              onRemovePost={handleRemovePost}
              onEditingPost={handleEditingPost}
              isOnAction={post.id === postIdSelected}
            />
          ))}
        </div>
      )}
    </main>
  );
}
