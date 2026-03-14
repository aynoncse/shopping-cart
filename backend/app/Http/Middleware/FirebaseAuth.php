<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class FirebaseAuth
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['error' => 'Unauthorized - No token provided'], 401);
        }

        try {
            // Decode token header to get kid (key ID)
            $tks = explode('.', $token);
            $headb64 = $tks[0];
            $headJson = JWT::urlsafeB64Decode($headb64);
            $header = json_decode($headJson, true);
            $kid = $header['kid'] ?? null;

            if (!$kid) {
                throw new \Exception('No key ID in token header');
            }

            // Fetch Firebase public keys (cached for 1 hour)
            $publicKeys = $this->fetchPublicKeys();

            if (!isset($publicKeys[$kid])) {
                throw new \Exception('Invalid key ID');
            }

            $key = $publicKeys[$kid];
            $decoded = JWT::decode($token, new Key($key, 'RS256'));

            // Verify audience
            $projectId = env('FIREBASE_PROJECT_ID');
            if ($decoded->aud !== $projectId) {
                throw new \Exception('Invalid audience');
            }

            $firebaseUid = $decoded->sub;

            // Find or create user
            $user = User::firstOrCreate(
                ['firebase_uid' => $firebaseUid],
                [
                    'name'  => $decoded->name ?? '',
                    'email' => $decoded->email ?? '',
                    'avatar' => $decoded->picture ?? '',
                ]
            );

            auth()->setUser($user);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid token: ' . $e->getMessage()], 401);
        }

        return $next($request);
    }

    private function fetchPublicKeys()
    {
        return Cache::remember('firebase_public_keys', 3600, function () {
            $client = new \GuzzleHttp\Client();
            $response = $client->get('https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com');
            return json_decode((string)$response->getBody(), true);
        });
    }
}
