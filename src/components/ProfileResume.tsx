import { PencilSimpleLine } from '@phosphor-icons/react';

import { Button } from './ui/button';
import { Separator } from './ui/separator';

export function ProfileResume() {
  return (
    <div className="flex w-[296px] flex-col items-center justify-start rounded-lg bg-primary py-8">
      <p className="text-base font-bold leading-[160%]">John Doe</p>

      <span className="text-sm leading-[160%] text-muted-foreground">
        Front End Developer
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
