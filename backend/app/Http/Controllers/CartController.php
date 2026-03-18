<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncCartRequest;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Get the current user's cart with product details.
     */
    public function index()
    {
        $cart = Auth::user()->cartItems()->with('product')->get();
        return response()->json($cart);
    }

    public function sync(SyncCartRequest $request)
    {
        $user = Auth::user();
        $items = $request->input('items');

        // Delete all existing cart items for this user
        Cart::where('user_id', $user->id)->delete();

        // Prepare items for insertion
        $cartItems = collect($items)->map(function ($item) use ($user) {
            return [
                'user_id'    => $user->id,
                'product_id' => $item['product_id'],
                'quantity'   => $item['quantity'],
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        Cart::insert($cartItems);

        $cart = Cart::where('user_id', $user->id)->with('product')->get();
        return response()->json($cart);
    }
}
