import { ImageUploader } from '@/components/ImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AddItemPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline text-primary">Analyze a New Exhibit</CardTitle>
            <CardDescription className="text-lg">
              Upload a photo of an artifact, and our AI will extract its details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImageUploader />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
