'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ItemChatPage() {
    return (
        <Card>
            <CardContent className="pt-6">
                <Alert>
                    <AlertTitle>Chat Not Available</AlertTitle>
                    <AlertDescription>
                        AI chat is not available for temporarily analyzed items. To use this feature, data persistence would need to be enabled.
                        <div className="mt-4">
                            <Button asChild variant="outline">
                                <Link href="/">Return to Collection</Link>
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            </CardContent>
        </Card>
    );
}
