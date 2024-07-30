import { RssSimple } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="flex h-20 w-full items-center justify-center bg-primary lg:h-[100px]">
      <Link
        to="/"
        className="flex items-center text-2xl font-medium tracking-widest lg:text-4xl"
      >
        <RssSimple
          className="mr-4 h-8 w-8 text-green-light lg:h-12 lg:w-12"
          weight="bold"
        />{' '}
        F<strong className="font-medium text-green-light">ee</strong>d Cha
        <strong className="font-medium text-green-light">ll</strong>enge
      </Link>
    </header>
  );
}
