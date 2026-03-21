<?php

namespace App\Http\Controllers;

use App\Services\Product\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(private readonly ProductService $productService)
    {
    }

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 12);
        $products = $this->productService->getPaginatedProducts($perPage);

        return $this->successResponse(
            $products->items(),
            'Products retrieved successfully.',
            200,
            [
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total' => $products->total(),
            ]
        );
    }
}
