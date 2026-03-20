<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('products', [ProductController::class, 'index']);

    // Protected routes
    Route::middleware('firebase.auth')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/sync', [CartController::class, 'sync']);
    });
});
