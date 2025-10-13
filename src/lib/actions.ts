'use server';

import { revalidatePath } from 'next/cache';
import { analyzeExhibitImage, type AnalyzeExhibitImageOutput } from '@/ai/flows/analyze-exhibit-image';
import { updateExhibitImage } from '@/ai/flows/update-exhibit-image';
import { chatAboutExhibitContext } from '@/ai/flows/chat-about-exhibit-context';
import { addExhibitItem, getExhibitItemById, updateExhibitItem } from './data';
import type { ChatMessage, ExhibitItem, ExhibitMetadata } from './types';

export async function analyzeImageAction(formData: FormData): Promise<{ error?: string, newItemId?: string }> {
  const photoDataUri = formData.get('image-data-uri') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  if (!photoDataUri) {
    return { error: 'No image data provided.' };
  }

  try {
    const analysisResult: AnalyzeExhibitImageOutput = await analyzeExhibitImage({ photoDataUri, description });

    const finalName = name || analysisResult.metadata.name || 'Untitled';
    const finalDescription = description || analysisResult.metadata.description || 'No description provided.';
    
    const newItemData: Omit<ExhibitItem, 'id'> = {
      name: finalName,
      description: finalDescription,
      images: [photoDataUri],
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
  revalidatePath(`/items/${itemId}/chat`);
}

export async function updateImageAction(itemId: string, formData: FormData): Promise<{ newInfoFound: boolean, updatedMetadata?: ExhibitMetadata }> {
  const photoDataUri = formData.get('image-data-uri') as string;
  const item = await getExhibitItemById(itemId);

  if (!photoDataUri) {
    throw new Error('No image file provided.');
  }
  if (!item) {
    throw new Error('Exhibit item not found.');
  }

  const result = await updateExhibitImage({
    newPhotoDataUri: photoDataUri,
    existingMetadata: item.metadata
  });

  if (result.newInfoFound && result.updatedMetadata) {
    const updatedItem: Partial<ExhibitItem> = {
      images: [...item.images, photoDataUri],
      metadata: result.updatedMetadata,
      name: result.updatedMetadata.name || item.name,
      description: result.updatedMetadata.description || item.description,
    };
    await updateExhibitItem(itemId, updatedItem);
    revalidatePath(`/items/${itemId}`);
    revalidatePath(`/items/${itemId}/chat`);
    return { newInfoFound: true, updatedMetadata: result.updatedMetadata };
  } else {
    // If user forces add, we just add the image
    const forceAdd = formData.get('force-add') === 'true';
    if (forceAdd) {
        await updateExhibitItem(itemId, { images: [...item.images, photoDataUri] });
        revalidatePath(`/items/${itemId}`);
        revalidatePath(`/items/${itemId}/chat`);
    }
    return { newInfoFound: false };
  }
}
