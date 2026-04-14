import Image from 'next/image';

export default function ProductCard({
  product,
  onAddToCart,
  onWishlistToggle,
  isWishlisted = false,
  showAddToCart = true,
}) {
  return (
    <div className="group animated-border bg-white border border-gray-200 rounded-sm">
      <div className="relative overflow-hidden rounded-sm bg-white">
        {onWishlistToggle && (
          <button
            type="button"
            onClick={() => onWishlistToggle(product)}
            className={`absolute right-3 top-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 transition-colors ${
              isWishlisted
                ? 'border-red-200 text-red-500'
                : 'border-gray-200 text-gray-500 hover:text-red-500'
            }`}
            aria-label={
              isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'
            }>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isWishlisted ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5">
              <path d="M12 21s-6.716-4.35-9.192-8.01C.407 9.434 2.16 5 6.5 5A5.38 5.38 0 0 1 12 8.09 5.38 5.38 0 0 1 17.5 5c4.34 0 6.093 4.434 3.692 7.99C18.716 16.65 12 21 12 21Z" />
            </svg>
          </button>
        )}

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
            {showAddToCart && onAddToCart && (
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="site-bg site-bg-hover site-ring w-full rounded-sm px-4 py-2 text-sm text-white transition-colors focus:ring-2 focus:ring-offset-2 sm:w-auto">
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
