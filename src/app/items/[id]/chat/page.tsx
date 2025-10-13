import { ChatInterface } from "@/components/ChatInterface";
import { getExhibitItemById } from "@/lib/data";
import { notFound } from "next/navigation";

export default async function ItemChatPage({ params }: { params: { id: string } }) {
    const item = await getExhibitItemById(params.id);
    if (!item) {
        notFound();
    }
    
    return (
        <div className="fade-in">
            <ChatInterface itemId={item.id} />
        </div>
    );
}
