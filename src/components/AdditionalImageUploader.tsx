'use client';

import { useState } from 'react';
import Image from 'next/image';
import { updateImageAction } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2, AlertCircle, PlusCircle } from 'lucide-react';
import type { ExhibitItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export function AdditionalImageUploader({ item }: { item: ExhibitItem }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setError(null);
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
    const fileInput = document.getElementById('additional-image-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetState = () => {
    setFile(null);
    setPreview(null);
    setIsSubmitting(false);
    setError(null);
    setShowConfirmation(false);
  }

  const submitImage = async (forceAdd = false) => {
    if (!preview) {
      setError('Please select an image file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    if (showConfirmation) setShowConfirmation(false);
    
    const formData = new FormData();
    formData.append('image-data-uri', preview);
    if (forceAdd) {
      formData.append('force-add', 'true');
    }
    
    try {
      const result = await updateImageAction(item.id, formData);
      
      if (result.newInfoFound) {
        toast({
          title: "Analysis Complete",
          description: "New information was found and the artifact details have been updated.",
        });
        resetState();
      } else {
        if (!forceAdd) {
            setShowConfirmation(true);
        } else {
            toast({
                title: "Image Added",
                description: "The image has been added to the artifact's gallery.",
            });
            resetState();
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Analysis failed: ${errorMessage}`);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: errorMessage,
      });
    } finally {
      if (!showConfirmation && !forceAdd) {
        setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submitImage(false);
  };
  
  const handleConfirmAdd = async () => {
    await submitImage(true);
    setIsSubmitting(false);
  };
  
  const handleCancelAdd = () => {
    setShowConfirmation(false);
    resetState();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <PlusCircle className="mr-2 h-6 w-6" /> Add Another Image
        </CardTitle>
        <CardDescription>Upload an additional photo to enhance this artifact's information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="additional-image-upload" className="text-base">Upload Image</Label>
            <div className="relative flex justify-center items-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:border-accent transition-colors bg-card/50">
              <Input id="additional-image-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} disabled={isSubmitting || !!preview} name="image" />
              {preview ? (
                <>
                  <Image src={preview} alt="Image preview" fill className="object-contain rounded-lg p-2" />
                  <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 z-10" onClick={handleRemoveImage} disabled={isSubmitting}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove image</span>
                  </Button>
                </>
              ) : (
                 <label htmlFor="additional-image-upload" className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
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
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting || !file}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing...
              </>
            ) : 'Analyze New Image'}
          </Button>
        </form>
        <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>No New Information Found</AlertDialogTitle>
              <AlertDialogDescription>
                The AI analysis did not find any new, relevant details in this photo. Would you still like to add this image to the artifact's gallery?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelAdd}>Discard Image</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmAdd}>Add to Gallery</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
