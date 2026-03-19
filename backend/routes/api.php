<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\User;


Route::prefix('v1')->group(function () {
    // Public routes
    Route::get('products', [ProductController::class, 'index']);

    // Protected routes
    Route::middleware('firebase.auth')->group(function () {
        Route::get('/user', function (Request $request) {
            return $request->user();
        });

        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart/sync', [CartController::class, 'sync']);
    });
});
