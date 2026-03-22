<?php

namespace App\Http\Controllers;

use App\Services\Product\ProductService;
use Illuminate\Http\Request;

/**
 * Class ProductController
 *
 * Handles public API requests related to products.
 */
class ProductController extends Controller
{
    /**
     * ProductController constructor.
     *
     * @param ProductService $productService The service handling product business logic.
     */
    public function __construct(private readonly ProductService $productService)
    {
    }

    /**
     * Get a paginated list of products.
     *
     * @param Request $request The incoming HTTP request.
     * @return \Illuminate\Http\JsonResponse
     */
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
