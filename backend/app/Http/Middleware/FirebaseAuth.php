<?php

namespace App\Http\Middleware;

use App\Services\Firebase\FirebaseAuthService;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized - No token provided',
            ], 401);
        }

        try {
            $user = app(FirebaseAuthService::class)->authenticate($token);
            Auth::setUser($user);
        } catch (\Exception $e) {
            Log::warning('Firebase token verification failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'The provided authentication token is invalid.',
            ], 401);
        }

        return $next($request);
    }
}
