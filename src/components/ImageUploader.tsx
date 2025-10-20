
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { analyzeImageAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';

const MAX_IMAGE_SIZE = 1024; // Max width or height in pixels

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height) {
          if (width > MAX_IMAGE_SIZE) {
            height = Math.round((height * MAX_IMAGE_SIZE) / width);
            width = MAX_IMAGE_SIZE;
          }
        } else {
          if (height > MAX_IMAGE_SIZE) {
            width = Math.round((width * MAX_IMAGE_SIZE) / height);
            height = MAX_IMAGE_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get canvas context'));
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.9)); // Use JPEG for better compression
      };
      img.onerror = reject;
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsSubmitting(true); // Show loading state while resizing
      setError(null);
      try {
        const resizedDataUrl = await resizeImage(selectedFile);
        setPreview(resizedDataUrl);
      } catch (err) {
        setError('Failed to process image. Please try another file.');
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
    const fileInput = document.getElementById('image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!preview) {
      setError('Please select an image file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    formData.append('image-data-uri', preview);
    
    try {
      const result = await analyzeImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.newItemId) {
        router.push(`/items/${result.newItemId}`);
      } else {
        setError('An unexpected error occurred: The server did not return an error or a new item ID.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred. Please check the server logs.';
      setError(`Analysis Failed: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name (Optional)</Label>
        <Input id="name" name="name" placeholder="e.g., Vintage Sentinel Radio" disabled={isSubmitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Brief Description (Optional)</Label>
        <Textarea id="description" name="description" placeholder="A short description of the item and its condition." disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-upload" className="text-base">Upload Image</Label>
        <div className="relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-accent transition-colors bg-card/50">
          <Input id="image-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isSubmitting || !!preview} name="image" />
          {preview ? (
            <>
              <Image src={preview} alt="Image preview" fill className="object-contain rounded-lg p-2" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={handleRemoveImage} disabled={isSubmitting}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </>
          ) : (
             <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                {isSubmitting ? (
                    <>
                        <Loader2 className="h-10 w-10 text-muted-foreground animate-spin mb-2" />
                        <p className="text-sm text-muted-foreground">Processing image...</p>
                    </>
                ) : (
                    <>
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground"><span className="font-semibold text-accent">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, or other image formats</p>
                    </>
                )}
             </label>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Analysis Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting || !file}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyzing...
          </>
        ) : 'Analyze Exhibit'}
      </Button>
    </form>
  );
}
