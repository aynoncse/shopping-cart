<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = ['name', 'description', 'price', 'image'];

    protected $casts = [
        'price' => 'double',
    ];

    public function cartItems()
    {
        return $this->hasMany(Cart::class);
    }
}
