import { RssSimple } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex h-[100px] w-full items-center justify-center bg-primary">
      <Link
        to="/"
        className="flex items-center text-4xl font-medium tracking-widest"
      >
        <RssSimple className="mr-4 text-green-light" weight="bold" size={48} />{' '}
        F<strong className="font-medium text-green-light">ee</strong>d Cha
        <strong className="font-medium text-green-light">ll</strong>enge
      </Link>
    </header>
  );
}
