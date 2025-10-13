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

export function ImageUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  const handleRemoveImage = () => {
    setFile(null);
    setPreview(null);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await analyzeImageAction(formData);
      if (result.error) {
        setError(result.error);
      } else if (result.newItemId) {
        router.push(`/items/${result.newItemId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Item Name</Label>
        <Input id="name" name="name" placeholder="e.g., Vintage Sentinel Radio" required disabled={isSubmitting} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Brief Description</Label>
        <Textarea id="description" name="description" placeholder="A short description of the item and its condition." required disabled={isSubmitting} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-upload" className="text-base">Upload Image</Label>
        <div className="relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-accent transition-colors bg-card/50">
          <Input id="image-upload" name="image" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isSubmitting || !!preview} />
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
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground"><span className="font-semibold text-accent">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, or other image formats</p>
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
