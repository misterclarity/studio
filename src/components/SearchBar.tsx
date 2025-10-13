'use client';

import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();

  return (
    <form action="/" method="GET" className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        name="query"
        className="w-full pl-12 pr-12 py-6 text-base rounded-full shadow-inner bg-card focus-visible:ring-accent"
        placeholder={placeholder}
        defaultValue={searchParams.get('query')?.toString()}
        aria-label="Search exhibits"
      />
      <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" variant="ghost" size="icon" aria-label="Search">
         <Search className="h-5 w-5 text-primary" />
      </Button>
    </form>
  );
}
