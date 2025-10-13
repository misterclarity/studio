import { Logo } from './Logo';
import { Button } from './ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Logo />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <Button asChild>
              <Link href="/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Analyze New Item
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
