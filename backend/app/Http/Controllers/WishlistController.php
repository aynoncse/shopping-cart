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
    public function __construct(private readonly WishlistService $wishlistService) {}

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

    /**
     * Generate or retrieve a share link for the authenticated user's wishlist.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function share()
    {
        $token = $this->wishlistService->getOrCreateShareToken(Auth::user());
        $shareUrl = rtrim((string) config('app.frontend_url'), '/') . '/wishlist/' . $token;

        return $this->successResponse(
            ['share_url' => $shareUrl],
            'Wishlist share link retrieved successfully.'
        );
    }

    /**
     * View a public wishlist by share token.
     *
     * @param string $token
     * @return \Illuminate\Http\JsonResponse
     */
    public function publicView(string $token)
    {
        $wishlist = $this->wishlistService->getWishlistByShareToken($token);

        if (!$wishlist) {
            return $this->errorResponse('Wishlist not found.', [], 404);
        }

        return $this->successResponse($wishlist, 'Wishlist retrieved successfully.');
    }
}
