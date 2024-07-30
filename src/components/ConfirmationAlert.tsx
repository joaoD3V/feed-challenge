import { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

type ConfirmationAlertProps = {
  title: string;
  description: string;
  idToRemove: number;
  onConfirm: (id: number) => void;
  children: ReactNode;
};

export function ConfirmationAlert({
  title,
  description,
  idToRemove,
  onConfirm,
  children,
}: ConfirmationAlertProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="flex min-h-[238px] w-5/6 flex-col items-center justify-center gap-10 border-none bg-primary px-8 py-6 text-zinc-100 lg:w-[432px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-2xl font-bold leading-[140%]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-base leading-[160%] text-zinc-200">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-none hover:bg-transparent hover:text-zinc-100">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(idToRemove)}
            className="bg-rose-500 text-zinc-100 hover:bg-rose-700"
          >
            Sim, remover
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
