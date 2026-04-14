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

    /**
     * Get or create the authenticated user's wishlist share token.
     *
     * @param User $user
     * @return string
     */
    public function getOrCreateShareToken(User $user): string
    {
        if ($user->wishlist_share_token) {
            return $user->wishlist_share_token;
        }

        $user->wishlist_share_token = Str::uuid()->toString();
        $user->save();

        return $user->wishlist_share_token;
    }

    /**
     * Get a wishlist by its share token.
     *
     * @param string $token
     * @return \Illuminate\Database\Eloquent\Collection|null
     */
    public function getWishlistByShareToken(string $token)
    {
        $user = User::where('wishlist_share_token', $token)->first();

        if (!$user) {
            return null;
        }

        return $this->getUserWishlist($user);
    }
}
