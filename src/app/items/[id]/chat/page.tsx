import { ChatInterface } from "@/components/ChatInterface";
import type { ExhibitItem } from "@/lib/types";

// The item is passed as a prop from the layout
export default async function ItemChatPage({ item }: { item: ExhibitItem }) {
    return (
        <div className="fade-in">
            <ChatInterface itemId={item.id} />
        </div>
    );
}
