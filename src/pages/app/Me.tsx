import { zodResolver } from '@hookform/resolvers/zod';
import { CircleNotch, FloppyDisk } from '@phosphor-icons/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { User } from '@/@types/JSONPlaceholder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { makeUser } from '@/factories/user';
import { getUsers } from '@/requests/get-users';
import { delay } from '@/utils/delay';

import { NotFound } from '../404';
import { Error } from '../Error';

const userProfileSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  lat: z.string(),
  lng: z.string(),
  phone: z.string(),
  website: z.string(),
  companyName: z.string(),
  catchPhrase: z.string(),
  bs: z.string(),
});

type UserProfileSchema = z.infer<typeof userProfileSchema>;

export function Me() {
  const [currentUser, setCurrentUser] = useState<User | null>(
    sessionStorage.getItem('user')
      ? JSON.parse(sessionStorage.getItem('user')!)
      : null
  );

  const {
    data: users,
    isLoading: isLoadingUsers,
    isLoadingError: isLoadingUsersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    staleTime: Infinity,
  });

  // Usuário criado e autenticado hardcoded
  useEffect(() => {
    if (users && !sessionStorage.getItem('user')) {
      const user = makeUser({
        id: users[users.length - 1].id + 1,
        name: 'John',
        username: 'Doe',
        email: 'john@example.com',
      });

      sessionStorage.setItem('user', JSON.stringify(user));

      setCurrentUser(user);
    }
  }, [users]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useForm<UserProfileSchema>({
    resolver: zodResolver(userProfileSchema),
    values: {
      name: currentUser?.name ?? '',
      username: currentUser?.username ?? '',
      email: currentUser?.email ?? '',
      street: currentUser?.address.street ?? '',
      suite: currentUser?.address.suite ?? '',
      city: currentUser?.address.city ?? '',
      zipcode: currentUser?.address.zipcode ?? '',
      lat: currentUser?.address.geo.lat ?? '',
      lng: currentUser?.address.geo.lng ?? '',
      phone: currentUser?.phone ?? '',
      website: currentUser?.website ?? '',
      companyName: currentUser?.company.name ?? '',
      catchPhrase: currentUser?.company.catchPhrase ?? '',
      bs: currentUser?.company.bs ?? '',
    },
  });

  if (isLoadingUsersError) {
    return <Error />;
  }

  if (!currentUser) {
    // Representa um "placeholder" do usuário se logando
    return (
      <div className="flex flex-1 items-center justify-center">
        <CircleNotch className="animate-spin" size={80} />
      </div>
    );
  }

  async function handleUpdateUser(data: UserProfileSchema) {
    await delay(); // Mockando o tempo de espera de um fake request

    const updateUser: User = {
      id: currentUser!.id,
      name: data.name,
      username: data.username,
      email: data.email,
      phone: data.phone,
      website: data.website,
      address: {
        street: data.street,
        suite: data.suite,
        city: data.city,
        zipcode: data.zipcode,
        geo: {
          lat: data.lat,
          lng: data.lng,
        },
      },
      company: {
        name: data.companyName,
        catchPhrase: data.catchPhrase,
        bs: data.bs,
      },
    };

    sessionStorage.setItem('user', JSON.stringify(updateUser));
    toast.success('Usuário atualizado com sucesso! 😀');
  }

  if (!currentUser) {
    return <NotFound />;
  }

  if (isLoadingUsers) {
    return (
      <Skeleton className="mx-auto min-h-[500px] w-full rounded-lg p-8 lg:w-[800px]" />
    );
  }

  return (
    <main
      className={`mx-auto min-h-[200px] w-full rounded-lg p-8 lg:w-[800px] ${isSubmitting ? 'bg-zinc-800' : 'bg-primary'}`}
    >
      <h1 className="mx-auto w-max text-3xl font-medium">Meu Perfil</h1>
      <form
        className={`mt-12 ${isSubmitting && 'pointer-events-none'}`}
        onSubmit={handleSubmit(handleUpdateUser)}
      >
        <span className="mb-4 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Basic Informations
        </span>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Name:</Label>
            <Input className="h-[50px]" {...register('name')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Username:</Label>
            <Input className="h-[50px]" {...register('username')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Email:</Label>
            <Input className="h-[50px]" type="email" {...register('email')} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Phone:</Label>
            <Input className="h-[50px]" {...register('phone')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Website:</Label>
            <Input className="h-[50px]" {...register('website')} />
          </div>
        </div>

        <span className="mb-4 mt-10 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Address
        </span>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Street:</Label>
            <Input className="h-[50px]" {...register('street')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Suite:</Label>
            <Input className="h-[50px]" {...register('suite')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">City:</Label>
            <Input className="h-[50px]" {...register('city')} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Zip Code:</Label>
            <Input className="h-[50px]" {...register('zipcode')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Latitude:</Label>
            <Input className="h-[50px]" {...register('lat')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Longitude:</Label>
            <Input className="h-[50px]" {...register('lng')} />
          </div>
        </div>

        <span className="mb-4 mt-10 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Company
        </span>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Name:</Label>
            <Input className="h-[50px]" {...register('companyName')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Catch Phrase:</Label>
            <Input className="h-[50px]" {...register('catchPhrase')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Buzz Phrase:</Label>
            <Input className="h-[50px]" {...register('bs')} />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-20 flex h-[50px] w-[192px] items-center gap-2 bg-green text-xl font-medium text-zinc-50 hover:bg-green-light disabled:cursor-not-allowed"
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? (
            <CircleNotch size={24} className="animate-spin" />
          ) : (
            <>
              <FloppyDisk size={24} /> Salvar
            </>
          )}
        </Button>
      </form>
    </main>
  );
}
