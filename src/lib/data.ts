'use server';

import type { ExhibitItem } from './types';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';

// Initialize Firebase Admin for server-side operations
const app = getFirebaseAdminApp();
const db = getFirestore(app);

const EXHIBITS_COLLECTION = 'exhibits';

export async function getExhibitItems(
  searchQuery: string | null
): Promise<ExhibitItem[]> {
  const exhibitsCollection = collection(db, EXHIBITS_COLLECTION);
  let q = query(exhibitsCollection, orderBy('createdAt', 'desc'), limit(50));
  
  const querySnapshot = await getDocs(q);
  let items = querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as ExhibitItem[];

  if (searchQuery) {
    const lowercasedQuery = searchQuery.toLowerCase();
    items = items.filter(item => 
        (item.name && item.name.toLowerCase().includes(lowercasedQuery)) ||
        (item.description && item.description.toLowerCase().includes(lowercasedQuery)) ||
        (item.metadata && Object.values(item.metadata).some(val => 
            typeof val === 'string' && val.toLowerCase().includes(lowercasedQuery)
        ))
    );
  }

  return items;
}

export async function getExhibitItemById(
  id: string
): Promise<ExhibitItem | undefined> {
  const docRef = doc(db, EXHIBITS_COLLECTION, id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as ExhibitItem;
  } else {
    return undefined;
  }
}

export async function addExhibitItem(
  item: Omit<ExhibitItem, 'id'>
): Promise<ExhibitItem> {
    const newItem = {
        ...item,
        createdAt: new Date().toISOString(),
    };
  const docRef = await addDoc(collection(db, EXHIBITS_COLLECTION), newItem);
  return { id: docRef.id, ...newItem } as ExhibitItem;
}

export async function updateExhibitItem(
  id: string,
  updatedData: Partial<ExhibitItem>
): Promise<ExhibitItem | undefined> {
  const docRef = doc(db, EXHIBITS_COLLECTION, id);
  await updateDoc(docRef, updatedData);
  const updatedDoc = await getDoc(docRef);
  return { id: updatedDoc.id, ...updatedDoc.data() } as ExhibitItem;
}

export async function deleteExhibitItem(id: string): Promise<void> {
  const docRef = doc(db, EXHIBITS_COLLECTION, id);
  await deleteDoc(docRef);
}
