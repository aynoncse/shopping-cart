import Image from 'next/image';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="group animated-border bg-white border border-gray-200 rounded-sm">
      <div className="overflow-hidden rounded-sm bg-white">
        <div className="aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="eager"
            priority={true}
            fetchPriority="high"
          />
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="mb-1 line-clamp-1 text-base font-semibold text-gray-800 sm:text-lg">
            {product.name}
          </h3>
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {product.description}
          </p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="site-text text-lg font-bold sm:text-xl">
              ${product.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="site-bg site-bg-hover site-ring w-full rounded-sm px-4 py-2 text-sm text-white transition-colors focus:ring-2 focus:ring-offset-2 sm:w-auto">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
