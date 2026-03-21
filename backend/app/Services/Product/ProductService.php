<?php

namespace App\Services\Product;

use App\Models\Product;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductService
{
    public function getPaginatedProducts(int $perPage = 12): LengthAwarePaginator
    {
        return Product::latest()->paginate($perPage);
    }
}
