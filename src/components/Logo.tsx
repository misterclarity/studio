import { Landmark } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors group">
      <Landmark className="h-8 w-8 transition-transform group-hover:rotate-[-5deg]" />
      <span className="text-2xl font-headline font-bold">ExhibitAI</span>
    </Link>
  );
}
