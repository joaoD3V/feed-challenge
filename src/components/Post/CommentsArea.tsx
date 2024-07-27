import { CircleNotch } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { Comment as CommentType } from '@/@types/JSONPlaceholder';
import { queryClient } from '@/lib/react-query';
import { userMock } from '@/mocks/user';
import { getCommentsByPostId } from '@/requests/get-comments-by-post-id';
import { delay } from '@/utils/delay';
import { extractNameFromEmail } from '@/utils/extract-name-from-email';

import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Textarea } from '../ui/textarea';
import { Comment } from './Comment';

type CommentsAreaProps = {
  postId: number;
};

export function CommentsArea({ postId }: CommentsAreaProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentIdSelected, setCommentIdSelected] = useState<number | null>(
    null
  );

  const {
    data: comments,
    isLoading: isLoadingComments,
    isLoadingError: isLoadingCommentsError,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => getCommentsByPostId(postId),
    staleTime: 1000 * 60 * 15, // 15min,
  });

  async function handleAddNewComment() {
    if (!newComment) {
      return;
    }

    const comment: CommentType = {
      id: comments ? comments.length + 1 : 1,
      postId,
      email: userMock.email,
      body: newComment,
    };

    setIsSubmitting(true);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['comments', postId], (prev: CommentType[]) => [
      comment,
      ...prev,
    ]);

    toast.success('Comentário adicionado com sucesso! 😀');
    setNewComment('');
    setIsSubmitting(false);
  }

  async function handleRemoveComment(id: number) {
    setCommentIdSelected(id);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['comments', postId], (prev: CommentType[]) =>
      prev.filter((p) => p.id !== id)
    );

    toast.success('Comentário excluído com sucesso! 😀');
    setCommentIdSelected(null);
  }

  async function handleEditingComment(id: number, newCommentUpdated: string) {
    setCommentIdSelected(id);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['comments', postId], (prev: CommentType[]) => {
      const commentIndex = prev.findIndex((p) => p.id === id);
      prev[commentIndex].body = newCommentUpdated;
      return [...prev];
    });

    toast.success('Comentário atualizado com sucesso! 😀');
    setCommentIdSelected(null);
  }

  return (
    <div>
      <span className="text-base font-bold leading-[160%]">
        Deixe seu feedback
      </span>

      <Textarea
        placeholder="Escreva um comentário..."
        className="mt-4 h-24 resize-none rounded-lg border-none bg-zinc-950 px-4 py-3 placeholder:text-zinc-300"
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
      />

      {newComment && (
        <Button
          onClick={handleAddNewComment}
          className="mt-4 h-[49px] w-[108px] bg-green-light text-base font-bold text-zinc-50 hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <CircleNotch size={24} className="animate-spin" />
          ) : (
            'Publicar'
          )}
        </Button>
      )}

      {isLoadingCommentsError ? (
        <p className="mt-6 text-sm">
          Ocorreu um erro ao carregar os comentários.... Tente novamente mais
          tarde!
        </p>
      ) : (
        <>
          {isLoadingComments ? (
            <div className="mt-8 space-y-6 pl-8">
              <Skeleton className="h-[100px] w-full rounded-lg bg-zinc-700" />
              <Skeleton className="h-[100px] w-full rounded-lg bg-zinc-700" />
              <Skeleton className="h-[100px] w-full rounded-lg bg-zinc-700" />
              <Skeleton className="h-[100px] w-full rounded-lg bg-zinc-700" />
            </div>
          ) : (
            <div className="mt-8 flex flex-col gap-6 pl-8">
              {comments?.map((comment) => (
                <Comment
                  key={comment.id}
                  commentId={comment.id}
                  user={{
                    name: extractNameFromEmail(comment.email),
                    email: comment.email[0]
                      .toLowerCase()
                      .concat(comment.email.substring(1)),
                  }}
                  content={comment.body}
                  onRemoveComment={handleRemoveComment}
                  onEditingComment={handleEditingComment}
                  isOnAction={comment.id === commentIdSelected}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
