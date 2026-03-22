<?php

namespace App\Services\Product;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

/**
 * Class ProductService
 *
 * Service for managing product operations.
 */
class ProductService
{
    /**
     * Get a paginated list of products.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedProducts(int $perPage = 12): LengthAwarePaginator
    {
        return Product::latest()->paginate($perPage);
    }
}
