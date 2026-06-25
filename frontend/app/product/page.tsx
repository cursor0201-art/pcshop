'use client';

import { Suspense } from 'react';
import ProductPageClient from './ProductClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white">Загрузка товара...</div>}>
      <ProductPageClient />
    </Suspense>
  );
}
