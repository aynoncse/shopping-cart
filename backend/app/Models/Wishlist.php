<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Wishlist
 *
 * Model for managing wishlist operations.
 */
class Wishlist extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['user_id', 'product_id'];

    /**
     * Get the user that owns the wishlist item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that the wishlist item belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
