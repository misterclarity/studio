import { MetadataDisplay } from "@/components/MetadataDisplay";
import { AdditionalImageUploader } from "@/components/AdditionalImageUploader";
import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
  const item = await getExhibitItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="fade-in space-y-6">
        <MetadataDisplay itemId={item.id} initialMetadata={item.metadata} />
        <AdditionalImageUploader item={item} />
    </div>
  );
}
