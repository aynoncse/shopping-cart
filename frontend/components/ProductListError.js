export default function ProductListError({
  message = 'Failed to load products. Please refresh the page.',
}) {
  return (
    <div className="text-center py-12">
      <p className="text-red-500">{message}</p>
    </div>
  );
}
