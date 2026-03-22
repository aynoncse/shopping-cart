<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Class Cart
 *
 * Model for managing cart operations.
 */
class Cart extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['user_id', 'product_id', 'quantity'];

    /**
     * Get the user that owns the cart item.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the product that the cart item belongs to.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
