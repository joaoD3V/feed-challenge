/* eslint-disable react-hooks/rules-of-hooks */
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

import { User as UserType } from '@/@types/JSONPlaceholder';
import { Post } from '@/components/Post';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { queryClient } from '@/lib/react-query';
import { getPostByUserId } from '@/requests/get-posts-by-user-id';

import { NotFound } from '../404';
import { Error } from '../Error';

export function User() {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('id');

  const usersList = queryClient.getQueryData<UserType[]>(['users']);
  const user = usersList?.find((user) => user.id === Number(userId));

  if (!user) {
    return <NotFound />;
  }

  const {
    data: posts,
    isLoading: isLoadingPosts,
    isLoadingError: isLoadingPostsError,
  } = useQuery({
    queryKey: ['user_posts', userId],
    queryFn: () => getPostByUserId(Number(userId)),
    staleTime: 1000 * 60 * 15, // 15min,
  });

  if (isLoadingPostsError) {
    return <Error />;
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

      {isLoadingPosts ? (
        <div className="flex-1 space-y-8">
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          {posts?.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              user={{
                id: user.id,
                email: user.email[0]
                  .toLowerCase()
                  .concat(user.email.substring(1)),
                name: user.name,
                username: user.username,
              }}
              content={post.body}
            />
          ))}
        </div>
      )}
    </main>
  );
}
