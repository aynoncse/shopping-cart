<?php

namespace App\Http\Controllers;

use App\Http\Requests\SyncCartRequest;
use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

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
        $items = collect($request->validated('items', []));

        DB::transaction(function () use ($user, $items) {
            $productIds = $items->pluck('product_id')->all();

            $query = Cart::where('user_id', $user->id);

            if (empty($productIds)) {
                $query->delete();
                return;
            }

            $query->whereNotIn('product_id', $productIds)->delete();

            Cart::upsert(
                $items->map(function ($item) use ($user) {
                    return [
                        'user_id' => $user->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                })->all(),
                ['user_id', 'product_id'],
                ['quantity', 'updated_at']
            );
        });

        $cart = Cart::where('user_id', $user->id)->with('product')->get();
        return response()->json($cart);
    }
}
