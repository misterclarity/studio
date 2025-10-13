'use client';

import { useState, useMemo } from 'react';
import { ItemGrid } from '@/components/ItemGrid';
import { SearchBar } from '@/components/SearchBar';
import type { ExhibitItem } from '@/lib/types';

export function Collection({ items }: { items: ExhibitItem[] }) {
  const [query, setQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!query) {
      return items;
    }
    const lowercasedQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowercasedQuery) ||
      item.description.toLowerCase().includes(lowercasedQuery) ||
      Object.values(item.metadata).some(val =>
        typeof val === 'string' && val.toLowerCase().includes(lowercasedQuery)
      )
    );
  }, [items, query]);

  return (
    <>
      <div className="mb-8 max-w-2xl mx-auto">
        <SearchBar
          placeholder="Search by name, material, era..."
          onChange={(e) => setQuery(e.target.value)}
          query={query}
          onClear={() => setQuery('')}
        />
      </div>

      {filteredItems.length > 0 ? (
        <ItemGrid items={filteredItems} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No Items Found</h2>
          <p className="text-muted-foreground">
            {query ? `Your search for "${query}" did not match any items. Try a different search term.` : "Your collection is empty. Add a new item to get started!"}
          </p>
        </div>
      )}
    </>
  );
}
