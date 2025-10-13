import type { ExhibitItem } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

export function ItemCard({ item }: { item: ExhibitItem }) {
  return (
    <Link href={`/items/${item.id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:border-accent group-hover:-translate-y-1 bg-card">
        <CardHeader className="p-0">
          <div className="relative h-60 w-full">
            <Image
              src={item.images[0]}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              data-ai-hint="artifact photo"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 flex flex-col justify-between flex-grow">
          <div>
            <CardTitle className="font-headline text-2xl mb-2 text-primary">{item.name}</CardTitle>
            <CardDescription className="line-clamp-3 mb-4">{item.description}</CardDescription>
          </div>
          <div className="flex items-center text-sm font-semibold text-accent group-hover:underline mt-4">
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
