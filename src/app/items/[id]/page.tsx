import { MetadataDisplay } from "@/components/MetadataDisplay";
import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
  const item = await getExhibitItemById(params.id);
  if (!item) {
    notFound();
  }

  return (
    <div className="fade-in">
        <MetadataDisplay metadata={item.metadata} />
    </div>
  );
}
