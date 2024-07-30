import {
  CircleNotch,
  PencilSimpleLine,
  TrashSimple,
} from '@phosphor-icons/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { User } from '@/@types/JSONPlaceholder';

import { ConfirmationAlert } from '../ConfirmationAlert';
import { Tip } from '../Tip';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Textarea } from '../ui/textarea';
import { CommentsArea } from './CommentsArea';

export type PostProps = {
  postId: number;
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
  content: string;
  onRemovePost: (id: number) => void;
  onEditingPost: (id: number, newPostUpdated: string) => void;
  isOnAction: boolean;
};

export function Post({
  postId,
  user,
  content,
  onRemovePost,
  onEditingPost,
  isOnAction,
}: PostProps) {
  const [currentPost, setCurrentPost] = useState(content);
  const [isEditingMode, setIsEditingMode] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '') as User;

  return (
    <section
      className={`min-h-[100px] w-full rounded-lg p-10 ${isOnAction ? 'bg-zinc-700' : 'bg-primary'}`}
    >
      <div className="flex items-start justify-between">
        <Link
          to={
            currentUser.id === user.id
              ? `/user?id=${user.id}&isNew=true`
              : `/user?id=${user.id}`
          }
          className="flex flex-col"
        >
          <p className="text-base font-bold leading-[160%]">
            {user.name} ({user.username})
          </p>

          <span className="text-sm leading-[160%] text-muted-foreground">
            {user.email}
          </span>
        </Link>

        {isEditingMode ? (
          <p className="text-xs font-medium">Modo de edição</p>
        ) : (
          <>
            {user.id === currentUser.id && (
              <>
                {isOnAction ? (
                  <CircleNotch size={18} className="animate-spin" />
                ) : (
                  <div className="flex items-center gap-2">
                    <Tip message="Editar post">
                      <Button
                        variant="ghost"
                        className="p-1"
                        onClick={() => setIsEditingMode(true)}
                      >
                        <PencilSimpleLine size={18} />
                      </Button>
                    </Tip>

                    <ConfirmationAlert
                      title="Remover post"
                      description="Você tem certeza que gostaria de remover este post?"
                      idToRemove={postId}
                      onConfirm={onRemovePost}
                    >
                      <Button variant="ghost" className="p-1">
                        <Tip message="Remover post">
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
            placeholder="Edite seu post..."
            className="mt-4 h-24 resize-none rounded-lg border-none bg-zinc-950 px-4 py-3 placeholder:text-zinc-300"
            value={currentPost}
            onChange={(e) => setCurrentPost(e.target.value)}
          />

          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                onEditingPost(postId, currentPost);
                setIsEditingMode(false);
              }}
              className="mt-4 h-[49px] w-[108px] bg-green-light text-base font-bold text-zinc-50 hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              Atualizar
            </Button>
            <Button
              onClick={() => {
                setIsEditingMode(false);
                setCurrentPost(content);
              }}
              className="mt-4 h-[49px] w-[108px] bg-rose-500 text-base font-bold text-zinc-50 hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </Button>
          </div>
        </>
      ) : (
        <p className="mt-3 bg-zinc-800 p-6 text-base leading-[160%] text-zinc-300">
          {content}
        </p>
      )}

      <Separator className="my-6 h-[0.5px]" />

      <CommentsArea postId={postId} />
    </section>
  );
}
