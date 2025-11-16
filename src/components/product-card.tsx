import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <Card className="flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
        <CardHeader className="p-0">
          <div className="relative aspect-[4/3]">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.imageHint}
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-4">
          <CardTitle className="mb-2 text-lg leading-snug group-hover:text-primary">
            {product.name}
          </CardTitle>
          <Badge variant="secondary">{product.condition}</Badge>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-xl font-bold text-primary">
            RM{product.price.toFixed(2)}
          </p>
        </CardFooter>
      </Card>
    </Link>
  );
}
