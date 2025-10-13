import { MetadataDisplay } from "@/components/MetadataDisplay";
import { AdditionalImageUploader } from "@/components/AdditionalImageUploader";
import type { ExhibitItem } from "@/lib/types";

// The item is passed as a prop from the layout
export default async function ItemDetailsPage({ item }: { item: ExhibitItem }) {
  return (
    <div className="fade-in space-y-6">
        <MetadataDisplay itemId={item.id} initialMetadata={item.metadata} />
        <AdditionalImageUploader item={item} />
    </div>
  );
}
