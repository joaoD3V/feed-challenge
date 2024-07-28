import { useQuery } from '@tanstack/react-query';

import { Post } from '@/components/Post';
import { ProfileResume } from '@/components/ProfileResume';
import { Skeleton } from '@/components/ui/skeleton';
import { userMock } from '@/factories/user';
import { Error } from '@/pages/Error';
import { getPosts } from '@/requests/get-posts';
import { getUsers } from '@/requests/get-users';
import { shuffleArray } from '@/utils/shuffle-array';
import { userMapper } from '@/utils/user-mapper';

export function Feed() {
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

  if (isLoadingPostsError || isLoadingUsersError) {
    return <Error />;
  }

  const currentUser = userMock;

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

      {isLoadingPosts || isLoadingUsers ? (
        <div className="flex-1 space-y-8">
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
          <Skeleton className="h-[400px] flex-1 rounded-lg bg-zinc-700" />
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          {shuffleArray(posts!)?.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
              user={userMapper({ usersList: users!, id: post.userId })}
              content={post.body}
            />
          ))}
        </div>
      )}
    </main>
  );
}
