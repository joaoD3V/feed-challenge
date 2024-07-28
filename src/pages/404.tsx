import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex h-screen flex-1 flex-col items-center justify-center gap-2 bg-foreground text-zinc-100">
      <h1 className="text-4xl font-bold">Página não encontrada</h1>
      <p className="mt-4 text-zinc-100">
        Voltar para o{' '}
        <Link to="/" className="text-green-light dark:text-green">
          Feed
        </Link>
      </p>
    </div>
  );
}
