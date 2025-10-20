'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ExhibitItem } from '@/lib/types';
import { ItemDetailView } from '@/components/ItemDetailView';
import { MetadataDisplay } from '@/components/MetadataDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AnalysisResultPage() {
  const [item, setItem] = useState<ExhibitItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const itemJson = sessionStorage.getItem('analyzedArtifact');
    if (itemJson) {
      try {
        const parsedItem = JSON.parse(itemJson);
        setItem(parsedItem);
      } catch (e) {
        setError('Could not read the analysis result. It might be corrupted.');
      }
    } else {
      setError('No analysis result found in this session. Please analyze an image first.');
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="max-w-md mx-auto">
            <CardHeader>
                <CardTitle className='text-destructive'>Error</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/add">Analyze a New Item</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading analysis results...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/3">
          <div className="sticky top-24 space-y-6">
            <ItemDetailView item={item} />
          </div>
        </div>
        <div className="lg:w-2/3">
          <MetadataDisplay itemId={item.id} initialMetadata={item.metadata} isEditable={false} />
        </div>
      </div>
    </div>
  );
}
