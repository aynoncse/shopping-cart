<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncCartRequest;
use App\Services\Cart\CartService;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService)
    {
    }

    public function index()
    {
        $cart = $this->cartService->getUserCart(Auth::user());
        return $this->successResponse($cart, 'Cart retrieved successfully.');
    }

    public function sync(SyncCartRequest $request)
    {
        $user = Auth::user();
        $cart = $this->cartService->syncUserCart($user, collect($request->validated('items', [])));
        return $this->successResponse($cart, 'Cart synchronized successfully.');
    }
}
