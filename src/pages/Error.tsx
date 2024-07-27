import { useRouteError } from 'react-router-dom';

export function Error() {
  const error = useRouteError() as Error;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2 bg-white">
      <h1 className="text-4xl font-bold text-black">
        Whoops, algo aconteceu...
      </h1>
      <p className="text-accent-foreground">Um erro aconteceu na aplicação</p>
      <pre>{error?.message || JSON.stringify(error)}</pre>
      <p className="text-accent-foreground">Tente novamente mais tarde</p>
    </div>
  );
}
