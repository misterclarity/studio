'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { getAIChatResponse } from '@/lib/actions';
import type { ChatMessage } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const initialMessages: ChatMessage[] = [
    {
      role: 'assistant',
      content: "Hello! I'm your AI curator. What would you like to know about this item's history or context?",
    },
];

export function ChatInterface({ itemId }: { itemId: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState('');
    const [isPending, startTransition] = useTransition();
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!input.trim() || isPending) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');

        startTransition(async () => {
            try {
                const aiResponse = await getAIChatResponse(itemId, newMessages);
                setMessages(prev => [...prev, aiResponse]);
            } catch (error) {
                const errorMessage: ChatMessage = { role: 'assistant', content: "Sorry, I couldn't process that request. Please try again." };
                setMessages(prev => [...prev, errorMessage]);
            }
        });
    }
  
    return (
        <Card className="h-[70vh] flex flex-col shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Chat with AI Curator</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-hidden flex flex-col">
                <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
                    <div className="space-y-6 pb-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={cn("flex items-start gap-4 animate-in fade-in duration-500", msg.role === 'user' ? 'justify-end' : '')}>
                                {msg.role === 'assistant' && (
                                    <Avatar className="border-2 border-primary">
                                        <AvatarFallback><Bot /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "max-w-md rounded-lg p-3 text-base shadow-md",
                                    msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                )}>
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <Avatar className="border-2 border-accent">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                        {isPending && (
                            <div className="flex items-start gap-4">
                                <Avatar className="border-2 border-primary">
                                    <AvatarFallback><Bot /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-md rounded-lg p-3 bg-muted flex items-center shadow-md">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className='pt-6 border-t'>
                <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about the item's context..."
                        className="flex-grow"
                        disabled={isPending}
                        aria-label="Chat message input"
                    />
                    <Button type="submit" size="icon" disabled={isPending || !input.trim()} aria-label="Send message">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}
