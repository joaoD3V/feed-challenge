import { CircleNotch, PlusCircle } from '@phosphor-icons/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Post, User } from '@/@types/JSONPlaceholder';
import { queryClient } from '@/lib/react-query';
import { delay } from '@/utils/delay';

import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Textarea } from './ui/textarea';

export function CreateNewPost() {
  const [newPost, setNewPost] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentUser = JSON.parse(sessionStorage.getItem('user') ?? '') as User;

  async function handleAddNewPost() {
    if (!newPost) {
      return;
    }

    // Solucionando o problema da criação de posts com id único
    const newId = Number(sessionStorage.getItem('postId')) + 1;

    sessionStorage.setItem('postId', String(newId));

    const post: Post = {
      id: newId,
      userId: currentUser.id,
      body: newPost,
    };

    setIsSubmitting(true);
    await delay(); // Mockando o tempo de espera de um fake request

    queryClient.setQueryData(['posts'], (prev: Post[]) => [post, ...prev]);

    setIsModalOpen(false);

    setNewPost('');
    setIsSubmitting(false);
    toast.success('Post adicionado com sucesso! 😀');
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button className="flex h-[50px] w-[192px] items-center gap-2 bg-green text-base font-medium text-zinc-50 hover:bg-green-light">
          <PlusCircle size={22} /> Criar novo post
        </Button>
      </DialogTrigger>
      <DialogContent className="w-5/6 border-none bg-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-xl">Criar novo post</DialogTitle>
          <DialogDescription className="text-zinc-200">
            Compartilhe seus pensamentos e novidades com a comunidade! O que
            está em sua mente hoje? 😆
          </DialogDescription>
        </DialogHeader>

        <Textarea
          placeholder="Escreva o que quiser..."
          className="mt-4 h-24 resize-none rounded-lg border-none bg-zinc-950 px-4 py-3 placeholder:text-zinc-300"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />

        {newPost && (
          <Button
            onClick={handleAddNewPost}
            className="h-[49px] w-[108px] bg-green-light text-base font-bold text-zinc-50 hover:bg-green disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircleNotch size={24} className="animate-spin" />
            ) : (
              'Publicar'
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
