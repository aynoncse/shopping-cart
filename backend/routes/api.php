<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\WishlistController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('products', [ProductController::class, 'index']);
    Route::get('/wishlist/public/{token}', [WishlistController::class, 'publicView']);

    // Protected routes
    Route::middleware('firebase.auth')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/sync', [CartController::class, 'sync']);
        Route::get('/wishlist', [WishlistController::class, 'index']);
        Route::post('/wishlist/toggle', [WishlistController::class, 'toggle']);
        Route::get('/wishlist/share', [WishlistController::class, 'share']);
    });
});
