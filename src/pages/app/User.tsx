/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Post as PostType, User as UserType } from '@/@types/JSONPlaceholder';
import { PostsArea } from '@/components/Post/PostsArea';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { queryClient } from '@/lib/react-query';

import { NotFound } from '../404';

export function User() {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState<PostType[]>([]);

  const userId = searchParams.get('id');
  const isNew = searchParams.get('isNew');

  const usersList = queryClient.getQueryData<UserType[]>(['users']);
  const user: UserType = isNew
    ? JSON.parse(sessionStorage.getItem('user') ?? '')
    : usersList?.find((user) => user.id === Number(userId));

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
        setPosts(getNewUserPosts());
      }, 1000 * 1); // 1s;

      return () => {
        clearInterval(intervalId);
      };
    } else {
      setPosts(getNewUserPosts());
    }
  }, [isNew]);

  if (!user) {
    return <NotFound />;
  }

  return (
    <main className="relative flex items-start gap-8">
      <ProfileResume
        user={{
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email[0].toLowerCase().concat(user.email.substring(1)),
        }}
      />

      {posts.length === 0 ? (
        <div className="flex-1 space-y-8">
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          <PostsArea posts={posts ?? []} />
        </div>
      )}
    </main>
  );
}
