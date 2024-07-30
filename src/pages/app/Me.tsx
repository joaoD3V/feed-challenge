import { zodResolver } from '@hookform/resolvers/zod';
import { CircleNotch, FloppyDisk } from '@phosphor-icons/react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { User } from '@/@types/JSONPlaceholder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { delay } from '@/utils/delay';

import { NotFound } from '../404';

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
  const userOnStorage = sessionStorage.getItem('user');

  const currentUser: User | null = userOnStorage
    ? JSON.parse(userOnStorage)
    : null;

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

  return (
    <main
      className={`mx-auto min-h-[200px] w-[800px] rounded-lg p-8 ${isSubmitting ? 'bg-zinc-800' : 'bg-primary'}`}
    >
      <h1 className="mx-auto w-max text-3xl font-medium">Meu Perfil</h1>
      <form
        className={`mt-12 ${isSubmitting && 'pointer-events-none'}`}
        onSubmit={handleSubmit(handleUpdateUser)}
      >
        <span className="mb-4 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Basic Informations
        </span>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Name:</Label>
            <Input {...register('name')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Username:</Label>
            <Input {...register('username')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Email:</Label>
            <Input type="email" {...register('email')} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Phone:</Label>
            <Input {...register('phone')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Website:</Label>
            <Input {...register('website')} />
          </div>
        </div>

        <span className="mb-4 mt-10 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Address
        </span>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Street:</Label>
            <Input {...register('street')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Suite:</Label>
            <Input {...register('suite')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">City:</Label>
            <Input {...register('city')} />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Zip Code:</Label>
            <Input {...register('zipcode')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Latitude:</Label>
            <Input {...register('lat')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Longitude:</Label>
            <Input {...register('lng')} />
          </div>
        </div>

        <span className="mb-4 mt-10 block text-sm font-medium text-zinc-500 underline underline-offset-4">
          Company
        </span>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs font-medium">Name:</Label>
            <Input {...register('companyName')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Catch Phrase:</Label>
            <Input {...register('catchPhrase')} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-medium">Buzz Phrase:</Label>
            <Input {...register('bs')} />
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
