/* eslint-disable react-hooks/exhaustive-deps */
import { CircleNotch } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Post as PostType, User as UserType } from '@/@types/JSONPlaceholder';
import { PostsArea } from '@/components/Post/PostsArea';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { makeUser } from '@/factories/user';
import { queryClient } from '@/lib/react-query';
import { getComments } from '@/requests/get-comments';
import { getPosts } from '@/requests/get-posts';
import { getUsers } from '@/requests/get-users';

import { NotFound } from '../404';

export function User() {
  const [currentUser, setCurrentUser] = useState<UserType | null>(
    sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')!)
      : null
  );
  const [userSelected, setUserSelected] = useState<UserType | null>(null);
  const [searchParams] = useSearchParams();
  const [postsToShow, setPostsToShow] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSelectingUser, setIsLoadingSelectingUser] = useState(true);

  const userId = searchParams.get('id');
  const isNew = searchParams.get('isNew');

  const {
    data: users,
    isLoading: isLoadingUsers,
    isLoadingError: isLoadingUsersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    staleTime: Infinity,
  });

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isLoadingError: isLoadingPostsError,
  } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
    staleTime: Infinity,
  });

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

  useEffect(() => {
    if (users && users.length > 0) {
      if (isNew) {
        if (currentUser) {
          setUserSelected(currentUser);
          return setIsLoadingSelectingUser(false);
        } else {
          setUserSelected(null);
          return setIsLoadingSelectingUser(false);
        }
      } else {
        const userFinded = users.find((user) => user.id === Number(userId));

        if (!userFinded) {
          setUserSelected(null);
          return setIsLoadingSelectingUser(false);
        }

        setUserSelected(userFinded);
        return setIsLoadingSelectingUser(false);
      }
    }
  }, [isNew, currentUser, users]);

  function getNewUserPosts() {
    const allPosts = queryClient.getQueryData<PostType[]>(['posts']) ?? [];
    const currentUserPosts = allPosts.filter(
      (post) => post.userId === Number(userId)
    );
    return currentUserPosts;
  }

  useEffect(() => {
    if (isNew) {
      const intervalId = setInterval(() => {
        setIsLoading(true);
        setPostsToShow(getNewUserPosts());
        setIsLoading(false);
      }, 500); // 500ms;

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setIsLoading(true);
      setPostsToShow(getNewUserPosts());
      setIsLoading(false);
    }
  }, [isNew, isLoadingPosts]);

  if (!currentUser || isLoadingSelectingUser) {
    // Representa um "placeholder" do usuário se logando
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotch className="animate-spin" size={80} />
      </div>
    );
  }

  if (
    !userSelected ||
    isLoadingPostsError ||
    isLoadingCommentsError ||
    isLoadingUsersError
  ) {
    return <NotFound />;
  }

  return (
    <main className="relative flex flex-col items-start gap-8 lg:flex-row">
      <ProfileResume
        user={{
          id: userSelected.id,
          name: userSelected.name,
          username: userSelected.username,
          email: userSelected.email[0]
            .toLowerCase()
            .concat(userSelected.email.substring(1)),
        }}
      />

      {isLoading || isLoadingPosts || isLoadingComments || isLoadingUsers ? (
        <div className="w-full flex-1 space-y-8">
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
        </div>
      ) : (
        <>
          {postsToShow.length > 0 ? (
            <div className="flex w-full flex-1 flex-col gap-8">
              <PostsArea posts={postsToShow ?? []} currentUser={currentUser} />
            </div>
          ) : (
            <span className="mx-auto w-max text-3xl">
              Nenhum post encontrado
            </span>
          )}
        </>
      )}
    </main>
  );
}
