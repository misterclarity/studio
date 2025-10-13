'use server';

import { revalidatePath } from 'next/cache';
import { analyzeExhibitImage, type AnalyzeExhibitImageOutput } from '@/ai/flows/analyze-exhibit-image';
import { chatAboutExhibitContext } from '@/ai/flows/chat-about-exhibit-context';
import { addExhibitItem, getExhibitItemById, updateExhibitItem } from './data';
import type { ChatMessage, ExhibitItem, ExhibitMetadata } from './types';
import { PlaceHolderImages } from './placeholder-images';

export async function analyzeImageAction(formData: FormData): Promise<{ error?: string, newItemId?: string }> {
  const photoDataUri = formData.get('image-data-uri') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const file = formData.get('image') as File;

  if (!photoDataUri && !file) {
    return { error: 'No image file provided.' };
  }

  let dataUri = photoDataUri;
  if (file) {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    dataUri = `data:${file.type};base64,${base64}`;
  }


  try {
    const analysisResult: AnalyzeExhibitImageOutput = await analyzeExhibitImage({ photoDataUri: dataUri, description });

    const finalName = name || analysisResult.metadata.name || 'Untitled';
    const finalDescription = description || analysisResult.metadata.description || 'No description provided.';
    
    const newItemData: Omit<ExhibitItem, 'id'> = {
      name: finalName,
      description: finalDescription,
      images: [dataUri],
      metadata: {
        ...analysisResult.metadata,
        name: finalName,
        description: finalDescription,
      },
    };

    const newItem = await addExhibitItem(newItemData);

    revalidatePath('/');
    revalidatePath(`/items/${newItem.id}`);
    return { newItemId: newItem.id };

  } catch (error) {
    console.error('Error in analyzeImageAction:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { error: `Failed to analyze image: ${errorMessage}` };
  }
}

export async function getAIChatResponse(itemId: string, history: ChatMessage[]): Promise<ChatMessage> {
    const item = await getExhibitItemById(itemId);
    if (!item) {
        throw new Error("Item not found");
    }

    const userQuery = history.length > 0 ? history[history.length - 1].content : '';
    if (!userQuery) {
        return { role: 'assistant', content: "I'm sorry, I didn't receive a question."};
    }
    const itemDescription = item.description + '\n\n' + JSON.stringify(item.metadata);

    try {
        const result = await chatAboutExhibitContext({
            itemDescription,
            userQuery,
        });

        return {
            role: 'assistant',
            content: result.answer,
        };
    } catch (error) {
        console.error('Error in getAIChatResponse:', error);
        return { role: 'assistant', content: 'There was an issue communicating with the AI. Please try again later.'}
    }
}


export async function updateExhibitItemAction(itemId: string, data: Partial<ExhibitItem>) {
  await updateExhibitItem(itemId, data);
  revalidatePath(`/items/${itemId}`);
}
