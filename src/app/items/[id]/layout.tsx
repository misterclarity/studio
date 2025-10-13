
import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";
import { ItemDetailView } from "@/components/ItemDetailView";
import React from "react";

export default async function ItemDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const item = await getExhibitItemById(params.id);

  if (!item) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/3">
            <div className="sticky top-24">
               <ItemDetailView item={item} />
            </div>
        </div>
        <div className="lg:w-2/3">
            <ItemDetailView item={item} isTabsOnly />
            <div className="mt-6">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
}
