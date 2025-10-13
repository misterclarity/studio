import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TriangleAlert } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[60vh]">
      <TriangleAlert className="w-24 h-24 text-accent" />
      <h1 className="mt-8 text-6xl md:text-8xl font-headline font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-semibold">Page Not Found</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Return to Collection</Link>
      </Button>
    </div>
  )
}
