<?php

namespace App\Services\Cart;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class CartService
{
    public function getUserCart(User $user)
    {
        return $user->cartItems()->with('product')->get();
    }

    public function syncUserCart(User $user, Collection $items)
    {
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

        return $this->getUserCart($user);
    }
}
