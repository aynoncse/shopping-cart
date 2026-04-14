<?php

namespace App\Services\Wishlist;

use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * Class WishlistService
 *
 * Service for managing user wishlist operations.
 */
class WishlistService
{
    /**
     * Get the authenticated user's wishlist items.
     *
     * @param User $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserWishlist(User $user)
    {
        return $user->wishlistItems()->with('product')->get();
    }

    /**
     * Toggle a product in the authenticated user's wishlist.
     *
     * @param User $user
     * @param int $productId
     * @return array{items: \Illuminate\Database\Eloquent\Collection, added: bool}
     */
    public function toggleProduct(User $user, int $productId): array
    {
        $added = DB::transaction(function () use ($user, $productId) {
            $wishlistItem = Wishlist::where('user_id', $user->id)
                ->where('product_id', $productId)
                ->first();

            if ($wishlistItem) {
                $wishlistItem->delete();
                return false;
            }

            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);

            return true;
        });

        return [
            'items' => $this->getUserWishlist($user),
            'added' => $added,
        ];
    }
}
