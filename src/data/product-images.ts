import type { ImageMetadata } from 'astro';
import tomato from '@/assets/products/product-tomatoes.png';
import potato from '@/assets/products/product-potatoes.png';
import pepper from '@/assets/products/product-peppers.png';
import courgette from '@/assets/products/product-courgettes.png';
import orange from '@/assets/products/product-oranges.png';
import strawberry from '@/assets/products/product-strawberries.png';
import onion from '@/assets/products/product-onions.png';
import redOnion from '@/assets/products/product-red-onions.png';
import egg from '@/assets/products/product-eggs.png';
import kombucha from '@/assets/products/product-kombucha.png';
import oliveOil from '@/assets/products/product-olive-oil.png';
import birdhouse from '@/assets/media/daily-wooden-birdhouses.jpeg';

const productImages: Record<string, ImageMetadata> = {
  tomato,
  potato,
  pepper,
  courgette,
  orange,
  strawberry,
  onion,
  'red-onion': redOnion,
  egg,
  kombucha,
  'olive-oil': oliveOil,
  birdhouse,
};

export function productImageFor(productId: string): ImageMetadata {
  const image = productImages[productId];
  if (!image) throw new Error(`Product image missing: ${productId}`);
  return image;
}
