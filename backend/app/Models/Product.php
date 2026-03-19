<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image'];

    protected $casts = [
        'price' => 'double'
    ];

    protected $appends = ['image_url'];

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }

    public function imageUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => asset($this->image),
        );
    }
}
