import { getExhibitItems } from '@/lib/data';
import { Collection } from '@/components/Collection';

export default async function Home() {
  const items = await getExhibitItems(null);

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

      <Collection items={items} />
    </div>
  );
}
