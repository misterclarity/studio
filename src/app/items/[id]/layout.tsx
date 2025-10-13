
'use client';

import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ItemTabs } from "@/components/ItemTabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { ExhibitItem } from "@/lib/types";
import { useEffect, useState } from "react";

export default function ItemDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [item, setItem] = useState<ExhibitItem | null>(null);
  const { id } = params;

  useEffect(() => {
    async function fetchItem() {
      const fetchedItem = await getExhibitItemById(id);
      if (fetchedItem) {
        setItem(fetchedItem);
      } else {
        notFound();
      }
    }
    fetchItem();
  }, [id]);


  if (!item) {
    // You can return a loading spinner or skeleton here
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        <div className="lg:w-1/3">
            <div className="sticky top-24">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-accent shadow-2xl bg-card cursor-pointer group">
                      <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 1023px) 100vw, 33vw"
                          data-ai-hint="artifact photo"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold text-lg">View Gallery</p>
                      </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl h-auto">
                    <DialogHeader>
                        <DialogTitle className="font-headline text-2xl text-primary">{item.name} - Image Gallery</DialogTitle>
                        <DialogDescription>
                            Browse through the images for this artifact.
                        </DialogDescription>
                    </DialogHeader>
                    <Carousel className="w-full">
                        <CarouselContent>
                            {item.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="p-1">
                                        <div className="relative aspect-square">
                                            <Image
                                                src={image}
                                                alt={`${item.name} image ${index + 1}`}
                                                fill
                                                className="object-contain"
                                                sizes="80vw"
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </DialogContent>
              </Dialog>
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
