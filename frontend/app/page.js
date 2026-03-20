import ProductGrid from '@/components/ProductGrid';
import CartInitializer from '@/components/CartInitializer';

export default function Home() {
  return (
    <div className="mt-8">
      <CartInitializer>
        <ProductGrid />
      </CartInitializer>
    </div>
  );
}
