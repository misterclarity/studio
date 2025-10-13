import type { ExhibitItem } from './types';

// This is an in-memory store. Data will be lost on server restart.
// We use a global to make it persistent across hot reloads in development.
declare global {
  var __exhibitItems: ExhibitItem[] | undefined;
}

const initialItems: ExhibitItem[] = [];

if (process.env.NODE_ENV === 'production') {
  global.__exhibitItems = initialItems;
} else {
  if (!global.__exhibitItems) {
    global.__exhibitItems = initialItems;
  }
}

const exhibitItems = global.__exhibitItems!;


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

export async function deleteExhibitItem(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const itemIndex = exhibitItems.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      exhibitItems.splice(itemIndex, 1);
    }
}
