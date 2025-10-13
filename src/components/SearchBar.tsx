'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import Link from 'next/link';

export function SearchBar({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  return (
    <div className="relative flex items-center gap-2">
      <form action="/" method="GET" className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="query"
          className="w-full pl-12 pr-12 py-6 text-base rounded-full shadow-inner bg-card focus-visible:ring-accent"
          placeholder={placeholder}
          defaultValue={query?.toString()}
          aria-label="Search exhibits"
          key={query} // Add key to reset input on navigation
        />
        <Button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full" variant="ghost" size="icon" aria-label="Search">
           <Search className="h-5 w-5 text-primary" />
        </Button>
      </form>
      {query && (
        <Button asChild variant="outline" className="rounded-full">
            <Link href="/" className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
            </Link>
        </Button>
      )}
    </div>
  );
}
