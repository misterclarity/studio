import type { ExhibitItem } from '@/lib/types';
import { ItemCard } from './ItemCard';

export function ItemGrid({ items }: { items: ExhibitItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item, index) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
