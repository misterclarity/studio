import type { ExhibitItem } from './types';

// This is an in-memory store. Data will be lost on server restart.
let exhibitItems: ExhibitItem[] = [
  {
    id: 'vintage-radio-1',
    name: 'Vintage Sentinel Radio',
    description: 'A well-preserved tabletop tube radio from the post-war era, featuring a polished wood cabinet and large tuning dial.',
    images: ['https://picsum.photos/seed/radio/800/600'],
    metadata: {
      name: 'Vintage Sentinel Radio',
      description: 'A well-preserved tabletop tube radio from the post-war era, featuring a polished wood cabinet and large tuning dial.',
      size: 'Approx. 12" x 8" x 7"',
      productionPeriod: '1940s - 1950s',
      productionCompany: 'Sentinel Radio Corp',
      materials: 'Wood, Bakelite, glass, metal',
      colors: 'Brown, beige',
      weight: 'Approx. 8 lbs',
      suggestedCollection: 'Mid-Century Electronics',
      archivingMedium: 'Digital Photography, 3D Scan',
      topic: 'Home Entertainment',
      historicalContext: 'Represents the golden age of radio, a primary source of news and entertainment for families before the widespread adoption of television.',
    },
  },
  {
    id: 'film-camera-1',
    name: 'Classic 35mm SLR Camera',
    description: 'A manual single-lens reflex camera, a workhorse for photographers in the mid-20th century.',
    images: ['https://picsum.photos/seed/camera/800/600'],
    metadata: {
      name: 'Classic 35mm SLR Camera',
      description: 'A manual single-lens reflex camera, a workhorse for photographers in the mid-20th century.',
      productionPeriod: '1960s - 1970s',
      materials: 'Metal alloy, leatherette, glass',
      suggestedCollection: 'History of Photography',
      topic: 'Analog Photography',
    },
  },
  {
    id: 'pocket-watch-1',
    name: 'Engraved Pocket Watch',
    description: 'An elegant, gold-plated pocket watch with a chain, showcasing the craftsmanship of early 20th-century watchmaking.',
    images: ['https://picsum.photos/seed/watch/800/600'],
    metadata: {
        name: 'Engraved Pocket Watch',
        description: 'An elegant, gold-plated pocket watch with a chain, showcasing the craftsmanship of early 20th-century watchmaking.',
        productionPeriod: 'c. 1910',
        materials: 'Gold plate, brass, enamel',
        suggestedCollection: 'Horology',
        topic: 'Personal Timekeeping',
    },
  },
    {
    id: 'typewriter-1',
    name: 'Manual Typewriter',
    description: 'A classic manual typewriter, representing a key tool of 20th-century communication and literature.',
    images: ['https://picsum.photos/seed/typewriter/800/600'],
    metadata: {
        name: 'Manual Typewriter',
        description: 'A classic manual typewriter, representing a key tool of 20th-century communication and literature.',
        productionPeriod: '1920s-1930s',
        materials: 'Cast iron, steel, rubber',
        suggestedCollection: 'Office & Communication Technology',
        topic: 'Writing & Printing',
    },
  },
];

// Functions to interact with the in-memory store.
// In a real application, these would interact with a database.

export async function getExhibitItems(query: string | null): Promise<ExhibitItem[]> {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  if (!query) {
    return exhibitItems;
  }
  const lowercasedQuery = query.toLowerCase();
  return exhibitItems.filter(item => 
    item.name.toLowerCase().includes(lowercasedQuery) ||
    item.description.toLowerCase().includes(lowercasedQuery) ||
    Object.values(item.metadata).some(val => 
      typeof val === 'string' && val.toLowerCase().includes(lowercasedQuery)
    )
  );
}

export async function getExhibitItemById(id: string): Promise<ExhibitItem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
  return exhibitItems.find(item => item.id === id);
}

export async function addExhibitItem(item: Omit<ExhibitItem, 'id'>): Promise<ExhibitItem> {
  const newItem: ExhibitItem = {
    ...item,
    id: `${item.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  };
  exhibitItems.unshift(newItem); // Add to the beginning
  return newItem;
}

export async function updateExhibitItem(id: string, updatedData: Partial<ExhibitItem>): Promise<ExhibitItem | undefined> {
  const itemIndex = exhibitItems.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    exhibitItems[itemIndex] = { ...exhibitItems[itemIndex], ...updatedData };
    return exhibitItems[itemIndex];
  }
  return undefined;
}
