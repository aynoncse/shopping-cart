<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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
            if (count($tks) !== 3) {
                throw new \Exception('Malformed token');
            }

            $headb64 = $tks[0];
            $headJson = JWT::urlsafeB64Decode($headb64);
            $header = json_decode($headJson, true);
            $kid = $header['kid'] ?? null;
            $alg = $header['alg'] ?? null;
            $typ = $header['typ'] ?? null;

            if (!$kid) {
                throw new \Exception('No key ID in token header');
            }

            if ($alg !== 'RS256') {
                throw new \Exception('Invalid token algorithm');
            }

            if ($typ !== null && strtoupper((string) $typ) !== 'JWT') {
                throw new \Exception('Invalid token type');
            }

            // Fetch Firebase public keys (cached for 1 hour)
            $publicKeys = $this->fetchPublicKeys();

            if (!isset($publicKeys[$kid])) {
                throw new \Exception('Invalid key ID');
            }

            $key = $publicKeys[$kid];
            $decoded = JWT::decode($token, new Key($key, 'RS256'));

            $projectId = config('services.firebase.project_id');
            $issuer = config('services.firebase.issuer');

            if (!$projectId || !$issuer) {
                throw new \Exception('Firebase configuration is missing');
            }

            if ($decoded->aud !== $projectId) {
                throw new \Exception('Invalid audience');
            }

            if (($decoded->iss ?? null) !== $issuer) {
                throw new \Exception('Invalid issuer');
            }

            if (empty($decoded->sub) || strlen((string) $decoded->sub) > 128) {
                throw new \Exception('Invalid subject');
            }

            if (!isset($decoded->auth_time) || !is_numeric($decoded->auth_time)) {
                throw new \Exception('Missing auth_time claim');
            }

            if ((int) $decoded->auth_time > time()) {
                throw new \Exception('Invalid auth_time claim');
            }

            if (!isset($decoded->firebase)) {
                throw new \Exception('Missing firebase claim');
            }

            $firebaseUid = $decoded->sub;

            $user = User::firstOrCreate(
                ['firebase_uid' => $firebaseUid],
                [
                    'name'  => $decoded->name ?? '',
                    'email' => $decoded->email ?? '',
                    'avatar' => $decoded->picture ?? '',
                ]
            );

            $this->syncUserProfile($user, $decoded);

            Auth::setUser($user);
        } catch (\Exception $e) {
            Log::warning('Firebase token verification failed', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'error' => 'Unauthorized',
                'message' => 'The provided authentication token is invalid.',
            ], 401);
        }

        return $next($request);
    }

    private function syncUserProfile(User $user, object $decoded): void
    {
        $user->fill([
            'name' => $decoded->name ?? $user->name,
            'email' => $decoded->email ?? $user->email,
            'avatar' => $decoded->picture ?? $user->avatar,
        ]);

        if ($user->isDirty()) {
            $user->save();
        }
    }

    private function fetchPublicKeys()
    {
        return Cache::remember('firebase_public_keys', 3600, function () {
            $publicKeysUrl = config('services.firebase.public_keys_url');

            if (!$publicKeysUrl) {
                throw new \Exception('Firebase public keys URL is missing');
            }

            $client = new \GuzzleHttp\Client();
            $response = $client->get($publicKeysUrl);
            return json_decode((string)$response->getBody(), true);
        });
    }
}
