"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageSquare } from "lucide-react";

export function ItemTabs({ itemId }: { itemId: string }) {
    const pathname = usePathname();
    const activeTab = pathname.includes("/chat") ? "chat" : "details";
    
    return (
        <Tabs value={activeTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details" asChild>
                    <Link href={`/items/${itemId}`}>
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                    </Link>
                </TabsTrigger>
                <TabsTrigger value="chat" asChild>
                    <Link href={`/items/${itemId}/chat`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        AI Chat
                    </Link>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
