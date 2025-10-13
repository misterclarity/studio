'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  onClear: () => void;
}

export function SearchBar({ placeholder, onChange, query, onClear }: SearchBarProps) {
  return (
    <div className="relative flex items-center gap-2">
      <div className="relative flex-grow">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          name="query"
          className="w-full pl-12 pr-12 py-6 text-base rounded-full shadow-inner bg-card focus-visible:ring-accent"
          placeholder={placeholder}
          value={query}
          onChange={onChange}
          aria-label="Search exhibits"
        />
      </div>
      {query && (
        <Button variant="outline" className="rounded-full" onClick={onClear}>
            <div className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
            </div>
        </Button>
      )}
    </div>
  );
}
