import ProductList from './ProductList';
import ProductListError from './ProductListError';

async function fetchProducts(page = 1, perPage = 12) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const response = await fetch(
    `${baseUrl}/v1/products?page=${page}&per_page=${perPage}`,
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  const payload = await response.json();

  return {
    data: payload.data || [],
    meta: payload.meta || null,
  };
}

export default async function ProductGrid() {
  let initialData;

  try {
    initialData = await fetchProducts(1, 12);
  } catch {
    return (
      <ProductListError message="Failed to load products right now. Please try again shortly." />
    );
  }

  const productIds = (initialData.data || []).map((product) => product.id).join('-');

  return (
    <ProductList
      key={`${initialData.meta?.current_page}-${initialData.meta?.last_page}-${productIds}`}
      initialProducts={initialData.data}
      initialMeta={initialData.meta}
    />
  );
}
