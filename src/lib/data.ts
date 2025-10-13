'use server';

import type { ExhibitItem } from './types';
import { PlaceHolderImages } from './placeholder-images';

// In-memory store for exhibit items.
// Using `global` to preserve data across hot reloads in development.
// In production, this will be a clean slate on every server restart.
declare global {
  var __exhibitItems: ExhibitItem[];
}

const initialItems: ExhibitItem[] = [];

if (process.env.NODE_ENV === 'production') {
  global.__exhibitItems = initialItems;
} else {
  if (!global.__exhibitItems) {
    global.__exhibitItems = initialItems;
  }
}

let items: ExhibitItem[] = global.__exhibitItems;
let nextId = items.length > 0 ? Math.max(...items.map(item => parseInt(item.id))) + 1 : 1;


export async function getExhibitItems(
  searchQuery: string | null
): Promise<ExhibitItem[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Simulate network delay
  
  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    return items.filter(item => 
        (item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowercasedQuery)) ||
        (item.metadata && Object.values(item.metadata).some(val => 
            typeof val === 'string' && val.toLowerCase().includes(lowercasedQuery)
        ))
    );
  }
  
  return [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getExhibitItemById(
  id: string
): Promise<ExhibitItem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return items.find(item => item.id === id);
}

export async function addExhibitItem(
  item: Omit<ExhibitItem, 'id'>
): Promise<ExhibitItem> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const newItem: ExhibitItem = {
    id: String(nextId++),
    ...item,
  };
  items.push(newItem);
  return newItem;
}

export async function updateExhibitItem(
  id: string,
  updatedData: Partial<ExhibitItem>
): Promise<ExhibitItem | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    items[itemIndex] = { ...items[itemIndex], ...updatedData };
    return items[itemIndex];
  }
  return undefined;
}

export async function deleteExhibitItem(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const itemIndex = items.findIndex(item => item.id === id);
  if (itemIndex > -1) {
    items.splice(itemIndex, 1);
  }
}
