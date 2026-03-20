<?php

namespace App\Services\Firebase;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;

class FirebaseAuthService
{
    public function authenticate(string $token): User
    {
        $header = $this->decodeHeader($token);
        $kid = $header['kid'] ?? null;
        $alg = $header['alg'] ?? null;
        $typ = $header['typ'] ?? null;

        if (!$kid) {
            throw new \RuntimeException('No key ID in token header.');
        }

        if ($alg !== 'RS256') {
            throw new \RuntimeException('Invalid token algorithm.');
        }

        if ($typ !== null && strtoupper((string) $typ) !== 'JWT') {
            throw new \RuntimeException('Invalid token type.');
        }

        $publicKeys = $this->fetchPublicKeys();

        if (!isset($publicKeys[$kid])) {
            throw new \RuntimeException('Invalid key ID.');
        }

        $decoded = JWT::decode($token, new Key($publicKeys[$kid], 'RS256'));
        $this->validateClaims($decoded);

        $user = User::firstOrCreate(
            ['firebase_uid' => $decoded->sub],
            [
                'name' => $decoded->name ?? '',
                'email' => $decoded->email ?? '',
                'avatar' => $decoded->picture ?? '',
            ]
        );

        $this->syncUserProfile($user, $decoded);

        return $user;
    }

    private function decodeHeader(string $token): array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 3) {
            throw new \RuntimeException('Malformed token.');
        }

        $decoded = json_decode(JWT::urlsafeB64Decode($parts[0]), true);

        if (!is_array($decoded)) {
            throw new \RuntimeException('Invalid token header.');
        }

        return $decoded;
    }

    private function validateClaims(object $decoded): void
    {
        $projectId = config('services.firebase.project_id');
        $issuer = config('services.firebase.issuer');

        if (!$projectId || !$issuer) {
            throw new \RuntimeException('Firebase configuration is missing.');
        }

        if (($decoded->aud ?? null) !== $projectId) {
            throw new \RuntimeException('Invalid audience.');
        }

        if (($decoded->iss ?? null) !== $issuer) {
            throw new \RuntimeException('Invalid issuer.');
        }

        if (empty($decoded->sub) || strlen((string) $decoded->sub) > 128) {
            throw new \RuntimeException('Invalid subject.');
        }

        if (!isset($decoded->auth_time) || !is_numeric($decoded->auth_time)) {
            throw new \RuntimeException('Missing auth_time claim.');
        }

        if ((int) $decoded->auth_time > time()) {
            throw new \RuntimeException('Invalid auth_time claim.');
        }

        if (!isset($decoded->firebase) || !is_object($decoded->firebase)) {
            throw new \RuntimeException('Missing firebase claim.');
        }
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

    private function fetchPublicKeys(): array
    {
        return Cache::remember('firebase_public_keys', 3600, function () {
            $publicKeysUrl = config('services.firebase.public_keys_url');

            if (!$publicKeysUrl) {
                throw new \RuntimeException('Firebase public keys URL is missing.');
            }

            $client = new \GuzzleHttp\Client();
            $response = $client->get($publicKeysUrl);
            $keys = json_decode((string) $response->getBody(), true);

            if (!is_array($keys)) {
                throw new \RuntimeException('Unable to decode Firebase public keys.');
            }

            return $keys;
        });
    }
}
