import { PencilSimpleLine } from '@phosphor-icons/react';

import { userMock } from '@/factories/user';

import { CreateNewPost } from './CreateNewPost';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

type ProfileResumeProps = {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
};

export function ProfileResume({ user }: ProfileResumeProps) {
  return (
    <div className="flex w-[296px] flex-col items-center justify-start rounded-lg bg-primary py-8">
      <h4 className="mb-6 text-xl">
        {user.id === userMock.id ? 'Seu Perfil:' : 'Perfil do Autor:'}
      </h4>

      <p className="text-base font-bold leading-[160%]">{user.name}</p>
      <p className="text-base font-bold leading-[160%]">({user.username})</p>

      <span className="mt-3 text-sm leading-[160%] text-muted-foreground">
        {user.email}
      </span>

      {user.id === userMock.id && (
        <>
          <Separator className="my-6 h-[0.5px]" />

          <div className="space-y-6">
            <Button className="flex h-[50px] w-[192px] items-center gap-2 border border-zinc-50 text-base font-medium text-zinc-50 hover:bg-zinc-800">
              <PencilSimpleLine size={22} /> Editar perfil
            </Button>

            <CreateNewPost />
          </div>
        </>
      )}
    </div>
  );
}
