'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now redirects because data is handled by the analysis-specific page.
export default function ItemDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  useEffect(() => {
    // If someone lands here directly, redirect them to the home page,
    // as there's no persistent data to show for a specific ID.
    // The only valid "item" page is the temporary one at /items/analysis.
    if (id !== 'analysis') {
      router.replace('/');
    }
  }, [router, id]);

  // Render nothing while redirecting
  return null;
}
