import ProductList from './ProductList';
import ProductListError from './ProductListError';

async function fetchProducts(page = 1, perPage = 12) {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  const response = await fetch(
    `${baseUrl}/v1/products?page=${page}&per_page=${perPage}`,
  );
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
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
      key={`${initialData.current_page}-${initialData.last_page}-${productIds}`}
      initialProducts={initialData.data}
      initialMeta={initialData}
    />
  );
}
