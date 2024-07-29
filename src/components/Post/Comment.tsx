import {
  CircleNotch,
  PencilSimpleLine,
  TrashSimple,
} from '@phosphor-icons/react';
import { useState } from 'react';

import { User } from '@/@types/JSONPlaceholder';

import { ConfirmationAlert } from '../ConfirmationAlert';
import { Tip } from '../Tip';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

type CommentProps = {
  commentId: number;
  user: {
    name: string;
    email: string;
  };
  content: string;
  onRemoveComment: (id: number) => void;
  onEditingComment: (id: number, newCommentUpdated: string) => void;
  isOnAction: boolean;
};

export function Comment({
  commentId,
  user,
  content,
  onRemoveComment,
  onEditingComment,
  isOnAction,
}: CommentProps) {
  const [currentComment, setCurrentComment] = useState(content);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '') as User;

  return (
    <div
      className={`min-h-[100px] w-full rounded-lg p-4 ${isOnAction ? 'bg-zinc-700' : 'bg-zinc-800'}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-px">
          <span className="text-sm font-bold leading-[160%]">{user.name}</span>
          <span className="text-xs leading-[160%] text-zinc-300">
            {user.email}
          </span>
        </div>

        {isEditingMode ? (
          <p className="text-xs font-medium">Modo de edição</p>
        ) : (
          <>
            {user.email === currentUser.email && (
              <>
                {isOnAction ? (
                  <CircleNotch size={18} className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Tip message="Editar comentário">
                      <Button
                        variant="ghost"
                        className="p-1"
                        onClick={() => setIsEditingMode(true)}
                      >
                        <PencilSimpleLine size={18} />
                      </Button>
                    </Tip>

                    <ConfirmationAlert
                      title="Remover comentário"
                      description="Você tem certeza que gostaria de remover este comentário?"
                      onConfirm={onRemoveComment}
                      idToRemove={commentId}
                    >
                      <Button variant="ghost" className="p-1">
                        <Tip message="Remover comentário">
                          <TrashSimple size={18} />
                        </Tip>
                      </Button>
                    </ConfirmationAlert>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {isEditingMode ? (
        <>
          <Textarea
            placeholder="Edite seu comentário..."
            className="mt-4 h-24 resize-none rounded-lg border-none bg-zinc-950 px-4 py-3 placeholder:text-zinc-300"
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                onEditingComment(commentId, currentComment);
                setIsEditingMode(false);
              }}
              className="mt-4 h-[49px] w-[108px] bg-green-light text-base font-bold text-zinc-50 hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atualizar
            </Button>
            <Button
              onClick={() => {
                setIsEditingMode(false);
                setCurrentComment(content);
              }}
              className="mt-4 h-[49px] w-[108px] bg-rose-500 text-base font-bold text-zinc-50 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-4 w-full text-sm leading-[160%]">{content}</p>
      )}
    </div>
  );
}
