'use server';

import type { ExhibitItem } from './types';

// This file is simplified. The main collection view will be empty by default,
// and analyzed items are only stored in sessionStorage on the client.

export async function getExhibitItems(
  searchQuery: string | null
): Promise<ExhibitItem[]> {
  // In this new model, the main collection page will always be empty
  // as there is no persistent storage.
  return [];
}

export async function getExhibitItemById(
  id: string
): Promise<ExhibitItem | undefined> {
  // This function is no longer able to fetch by ID from the server.
  // Data is only available in the client's sessionStorage.
  return undefined;
}

// The following functions are no longer used but are kept for reference.
export async function addExhibitItem(item: Omit<ExhibitItem, 'id'>): Promise<ExhibitItem> {
  throw new Error("addExhibitItem is not implemented for client-side storage.");
}
export async function updateExhibitItem(id: string, updatedData: Partial<ExhibitItem>): Promise<ExhibitItem | undefined> {
    return undefined;
}
export async function deleteExhibitItem(id: string): Promise<void> {}
