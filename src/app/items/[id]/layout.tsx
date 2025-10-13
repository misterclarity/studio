import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ItemTabs } from "@/components/ItemTabs";

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
                <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-accent shadow-2xl bg-card">
                    <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1023px) 100vw, 33vw"
                        data-ai-hint="artifact photo"
                    />
                </div>
                <h1 className="font-headline text-3xl lg:text-4xl font-bold mt-6 text-primary">{item.name}</h1>
                <p className="mt-2 text-lg text-foreground/80">{item.description}</p>
            </div>
        </div>
        <div className="lg:w-2/3">
            <ItemTabs itemId={item.id} />
            <div className="mt-6">
                {children}
            </div>
        </div>
      </div>
    </div>
  );
}
