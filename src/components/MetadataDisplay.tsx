'use client';

import { useState } from "react";
import type { ExhibitMetadata } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Pencil, Save, X } from "lucide-react";
import { Textarea } from "./ui/textarea";

const METADATA_LABELS: Record<string, string> = {
    name: 'Name',
    description: 'Description',
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

const EDITABLE_FIELDS = [
    'name', 'description', 'size', 'productionPeriod', 'productionCompany', 'materials',
    'colors', 'weight', 'suggestedCollection', 'archivingMedium', 'topic', 'historicalContext'
];

export function MetadataDisplay({ itemId, initialMetadata, isEditable = true }: { itemId: string; initialMetadata: ExhibitMetadata, isEditable?: boolean }) {
    const [metadata, setMetadata] = useState(initialMetadata);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    const handleEditClick = (key: string) => {
        setEditingKey(key);
        setEditValue(metadata[key as keyof ExhibitMetadata] || '');
    };

    const handleCancel = () => {
        setEditingKey(null);
        setEditValue('');
    };

    const handleSave = async () => {
        if (editingKey) {
            const updatedMetadata = { ...metadata, [editingKey]: editValue };
            setMetadata(updatedMetadata);
            // In a sessionStorage model, we can update the session storage item
            const sessionItem = sessionStorage.getItem('analyzedArtifact');
            if (sessionItem) {
                const parsed = JSON.parse(sessionItem);
                parsed.metadata = updatedMetadata;
                // Also update top-level name/description if they were changed
                if (editingKey === 'name') parsed.name = editValue;
                if (editingKey === 'description') parsed.description = editValue;
                sessionStorage.setItem('analyzedArtifact', JSON.stringify(parsed));
            }
            setEditingKey(null);
        }
    };
    
    const entries = Object.entries(metadata)
        .filter(([key, value]) => value && METADATA_LABELS[key])
        .sort(([keyA], [keyB]) => EDITABLE_FIELDS.indexOf(keyA) - EDITABLE_FIELDS.indexOf(keyB));


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
                        <div key={key} className={`p-3 bg-card rounded-md border ${key === 'description' || key === 'historicalContext' ? 'sm:col-span-2' : ''}`}>
                            <dt className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                                {METADATA_LABELS[key]}
                                {isEditable && editingKey !== key && (
                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleEditClick(key)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                )}
                            </dt>
                            <dd className="mt-1 text-base text-foreground">
                                {isEditable && editingKey === key ? (
                                    <div className="flex flex-col gap-2">
                                        {key === 'description' || key === 'historicalContext' ? (
                                             <Textarea value={editValue} onChange={(e) => setEditValue(e.target.value)} className="min-h-[120px]" />
                                        ) : (
                                             <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} />
                                        )}
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button variant="ghost" size="sm" onClick={handleCancel}>
                                                <X className="mr-1 h-4 w-4"/> Cancel
                                            </Button>
                                            <Button size="sm" onClick={handleSave}>
                                                <Save className="mr-1 h-4 w-4"/> Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    key === 'materials' || key === 'colors' ?
                                        String(value).split(',').map(v => <Badge key={v.trim()} variant="secondary" className="mr-1 mb-1">{v.trim()}</Badge>)
                                        : <p className="whitespace-pre-wrap">{String(value)}</p>
                                )}
                            </dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}
