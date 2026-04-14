<?php

namespace App\Http\Controllers;

use App\Http\Requests\ToggleWishlistRequest;
use App\Services\Wishlist\WishlistService;
use Illuminate\Support\Facades\Auth;

/**
 * Class WishlistController
 *
 * Handles API requests related to the user's wishlist.
 */
class WishlistController extends Controller
{
    /**
     * WishlistController constructor.
     *
     * @param WishlistService $wishlistService The service handling wishlist business logic.
     */
    public function __construct(private readonly WishlistService $wishlistService)
    {
    }

    /**
     * Retrieve the authenticated user's wishlist.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $wishlist = $this->wishlistService->getUserWishlist(Auth::user());

        return $this->successResponse($wishlist, 'Wishlist retrieved successfully.');
    }

    /**
     * Toggle a product in the authenticated user's wishlist.
     *
     * @param ToggleWishlistRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function toggle(ToggleWishlistRequest $request)
    {
        $result = $this->wishlistService->toggleProduct(
            Auth::user(),
            (int) $request->validated('product_id')
        );

        return $this->successResponse($result, 'Wishlist updated successfully.');
    }
}
