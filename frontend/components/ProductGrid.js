import ProductList from "./ProductList";

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
  const initialData = await fetchProducts(1, 12);
  return (
    <ProductList
      initialProducts={initialData.data}
      initialMeta={initialData}
    />
  );
}