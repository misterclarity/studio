'use server';

import { revalidatePath } from 'next/cache';
import { analyzeExhibitImage, type AnalyzeExhibitImageOutput } from '@/ai/flows/analyze-exhibit-image';
import { chatAboutExhibitContext } from '@/ai/flows/chat-about-exhibit-context';
import { addExhibitItem, getExhibitItemById } from './data';
import type { ChatMessage, ExhibitItem, ExhibitMetadata } from './types';
import { PlaceHolderImages } from './placeholder-images';

function fileToDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeImageAction(formData: FormData): Promise<{ error?: string, newItemId?: string }> {
  const imageFile = formData.get('image') as File;
  const name = (formData.get('name') as string) || 'Untitled';
  const description = (formData.get('description') as string) || 'No description provided.';

  if (!imageFile || imageFile.size === 0) {
    return { error: 'No image file provided.' };
  }

  try {
    const photoDataUri = await fileToDataUri(imageFile);

    const analysisResult: AnalyzeExhibitImageOutput = await analyzeExhibitImage({ photoDataUri, description });
    
    // In a real app, we'd upload the image to a storage bucket and use the URL.
    // For this example, we'll use a random placeholder image to avoid storing large data URIs.
    const placeholderImage = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

    const newItemData: Omit<ExhibitItem, 'id'> = {
      name,
      description,
      images: [placeholderImage.imageUrl],
      metadata: {
        ...analysisResult.metadata,
        name,
        description,
      },
    };

    const newItem = await addExhibitItem(newItemData);

    revalidatePath('/');
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
