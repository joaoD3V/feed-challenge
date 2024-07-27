import { Separator } from '../ui/separator';
import { CommentsArea } from './CommentsArea';

export type PostProps = {
  postId: number;
  user: {
    name: string;
    username: string;
    email: string;
  };
  content: string;
};

export function Post({ postId, user, content }: PostProps) {
  return (
    <section className="min-h-[100px] w-full rounded-lg bg-primary p-10">
      <div className="flex flex-col">
        <p className="text-base font-bold leading-[160%]">
          {user.name} ({user.username})
        </p>

        <span className="text-sm leading-[160%] text-muted-foreground">
          {user.email}
        </span>
      </div>

      <p className="mt-3 bg-zinc-800 p-6 text-base leading-[160%] text-zinc-300">
        {content}
      </p>

      <Separator className="my-6 h-[0.5px]" />

      <CommentsArea postId={postId} />
    </section>
  );
}
