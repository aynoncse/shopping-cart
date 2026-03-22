<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncCartRequest;
use App\Services\Cart\CartService;
use Illuminate\Support\Facades\Auth;

/**
 * Class CartController
 *
 * Handles API requests related to the user's shopping cart.
 */
class CartController extends Controller
{
    /**
     * CartController constructor.
     *
     * @param CartService $cartService The service handling cart business logic.
     */
    public function __construct(private readonly CartService $cartService)
    {
    }

    /**
     * Retrieve the authenticated user's current cart.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $cart = $this->cartService->getUserCart(Auth::user());
        return $this->successResponse($cart, 'Cart retrieved successfully.');
    }

    /**
     * Synchronize the given items with the authenticated user's cart.
     *
     * @param SyncCartRequest $request The validated request containing the new cart state.
     * @return \Illuminate\Http\JsonResponse
     */
    public function sync(SyncCartRequest $request)
    {
        $user = Auth::user();
        $cart = $this->cartService->syncUserCart($user, collect($request->validated('items', [])));
        return $this->successResponse($cart, 'Cart synchronized successfully.');
    }
}
