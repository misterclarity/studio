import type { ExhibitMetadata } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const METADATA_LABELS: Record<string, string> = {
    size: 'Size',
    productionPeriod: 'Production Period',
    productionCompany: 'Production Company',
    materials: 'Materials',
    colors: 'Colors',
    weight: 'Weight',
    suggestedCollection: 'Suggested Collection',
    archivingMedium: 'Archiving Medium',
    topic: 'Topic',
    historicalContext: 'Historical Context',
};

export function MetadataDisplay({ metadata }: { metadata: ExhibitMetadata }) {
    const entries = Object.entries(metadata).filter(([key, value]) => value && METADATA_LABELS[key]);

    if (entries.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">Artifact Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No specific metadata was extracted for this item.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Artifact Details</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {entries.map(([key, value]) => (
                        <div key={key} className="p-3 bg-card rounded-md border">
                            <dt className="text-sm font-medium text-muted-foreground">{METADATA_LABELS[key]}</dt>
                            <dd className="mt-1 text-base text-foreground">
                                {key === 'materials' || key === 'colors' ?
                                    String(value).split(',').map(v => <Badge key={v.trim()} variant="secondary" className="mr-1 mb-1">{v.trim()}</Badge>)
                                    : String(value)
                                }
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
