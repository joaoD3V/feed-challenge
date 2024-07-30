/* eslint-disable react-hooks/exhaustive-deps */
import { CircleNotch } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { User } from '@/@types/JSONPlaceholder';
import { PostsArea } from '@/components/Post/PostsArea';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { makeUser } from '@/factories/user';
import { Error } from '@/pages/Error';
import { getComments } from '@/requests/get-comments';
import { getPosts } from '@/requests/get-posts';
import { getUsers } from '@/requests/get-users';

export function Feed() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')!)
      : null
  );

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

  const {
    data: users,
    isLoading: isLoadingUsers,
    isLoadingError: isLoadingUsersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
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

  // Usuário criado e autenticado hardcoded
  useEffect(() => {
    if (users && !sessionStorage.getItem('user')) {
      const user = makeUser({
        id: users[users.length - 1].id + 1,
        name: 'John',
        username: 'Doe',
        email: 'john@example.com',
      });

      sessionStorage.setItem('user', JSON.stringify(user));

      setCurrentUser(user);
    }
  }, [users]);

  if (isLoadingPostsError || isLoadingUsersError || isLoadingCommentsError) {
    return <Error />;
  }

  if (!currentUser) {
    // Representa um "placeholder" do usuário se logando
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotch className="animate-spin" size={80} />
      </div>
    );
  }

  return (
    <main className="relative flex flex-col items-start gap-8 lg:flex-row">
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
        <PostsArea posts={posts!} currentUser={currentUser!} />
      )}
    </main>
  );
}
