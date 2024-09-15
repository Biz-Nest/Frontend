'use client';
import { Suspense } from 'react';
import ProductDetail from "@/app/components/ProductDetail/ProductDetail";

export default function Hpo() {
    return (
        <Suspense fallback={<div>Loading Product Details...</div>}>
            <ProductDetail />
        </Suspense>
    );
}
