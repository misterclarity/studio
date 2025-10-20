'use server';

import { analyzeExhibitImage, type AnalyzeExhibitImageOutput } from '@/ai/flows/analyze-exhibit-image';
import type { ExhibitItem } from './types';


export async function analyzeImageAction(formData: FormData): Promise<{ error?: string, newItem?: Omit<ExhibitItem, 'id'> }> {
  const photoDataUri = formData.get('image-data-uri') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!photoDataUri) {
    return { error: 'No image data provided.' };
  }

  try {
    const analysisResult: AnalyzeExhibitImageOutput = await analyzeExhibitImage({ photoDataUri, description });

    const finalName = name || analysisResult.metadata.name || 'Untitled Artifact';
    const finalDescription = description || analysisResult.metadata.description || 'No description provided.';
    
    // This item is missing the ID, which will be handled client-side.
    const newItemData: Omit<ExhibitItem, 'id'> = {
      name: finalName,
      description: finalDescription,
      images: [photoDataUri],
      metadata: {
        ...analysisResult.metadata,
        name: finalName,
        description: finalDescription,
      },
      createdAt: new Date().toISOString(),
    };

    return { newItem: newItemData };

  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    return { error: `An unexpected error occurred during analysis: ${errorMessage}` };
  }
}

// These actions are no longer used in the sessionStorage implementation,
// but are kept for potential future use if persistence is re-introduced.
export async function getAIChatResponse(itemId: string, history: any[]): Promise<any> {
    return { role: 'assistant', content: 'Chat is not enabled in this version.' };
}
export async function updateExhibitItemAction(itemId: string, data: Partial<ExhibitItem>) {}
export async function updateImageAction(itemId: string, formData: FormData) {}
export async function deleteExhibitItemAction(itemId: string) {}
