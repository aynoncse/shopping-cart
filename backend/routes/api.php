<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Models\User;

Route::prefix('v1')->middleware('firebase.auth')->group(function () {
    Route::get('/users', function (Request $request) {
        return User::all();
    });
});
