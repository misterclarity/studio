import { getExhibitItems } from '@/lib/data';
import { ItemGrid } from '@/components/ItemGrid';
import { SearchBar } from '@/components/SearchBar';
import { Suspense } from 'react';

export default async function Home({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || null;
  const items = await getExhibitItems(query);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold tracking-tight text-primary">
          The Curator's Collection
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80">
          Discover artifacts, analyze their history, and chat with our AI curator.
        </p>
      </div>

      <div className="mb-8 max-w-2xl mx-auto">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchBar placeholder="Search by name, material, era..." />
        </Suspense>
      </div>

      {items.length > 0 ? (
        <ItemGrid items={items} />
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-2">No Items Found</h2>
          <p className="text-muted-foreground">
            Your search for "{query}" did not match any items. Try a different search term.
          </p>
        </div>
      )}
    </div>
  );
}
