import { PencilSimpleLine } from '@phosphor-icons/react';

import { userMock } from '@/factories/user';

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

      <Separator className="my-6 h-[0.5px]" />

      <Button
        variant="outline"
        className="flex h-[50px] w-[192px] items-center gap-2 border-green-light text-base font-bold text-green-light hover:bg-green-light hover:text-zinc-100"
      >
        <PencilSimpleLine size={20} /> Editar seu perfil
      </Button>
    </div>
  );
}
