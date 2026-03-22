<?php

namespace App\Services\Firebase;

use App\Models\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Cache;

/**
 * Class FirebaseAuthService
 *
 * Service for verifying Firebase JWTs and authenticating users.
 */
class FirebaseAuthService
{
    /**
     * Authenticate a user by verifying a Firebase ID token.
     *
     * @param string $token The JWT token.
     * @return User
     * @throws \RuntimeException
     */
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
        $user = $this->resolveUser($decoded);

        $this->syncUserProfile($user, $decoded);

        return $user;
    }

    /**
     * Decode the token header to retrieve the key ID and algorithm.
     *
     * @param string $token The JWT token.
     * @return array
     * @throws \RuntimeException
     */
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

    /**
     * Validate the standard Firebase claims.
     *
     * @param object $decoded The decoded token payload.
     * @return void
     * @throws \RuntimeException
     */
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

    /**
     * Sync data from the token into the user's profile and save if changed.
     *
     * @param User $user
     * @param object $decoded
     * @return void
     */
    private function syncUserProfile(User $user, object $decoded): void
    {
        $user->fill([
            'firebase_uid' => $decoded->sub,
            'name' => $decoded->name ?? $user->name,
            'email' => $decoded->email ?? $user->email,
            'avatar' => $decoded->picture ?? $user->avatar,
        ]);

        if ($user->isDirty()) {
            $user->save();
        }
    }

    /**
     * Fetch Google's public keys for verifying the token signature.
     * Keys are cached automatically.
     *
     * @return array
     * @throws \RuntimeException
     */
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

    /**
     * Resolve the corresponding User model by Firebase UID or email,
     * or instantiate a new model if neither matches.
     *
     * @param object $decoded
     * @return User
     */
    private function resolveUser(object $decoded): User
    {
        $firebaseUid = (string) $decoded->sub;
        $email = $decoded->email ?? null;

        $user = User::where('firebase_uid', $firebaseUid)->first();

        if ($user) {
            return $user;
        }

        if ($email) {
            $user = User::where('email', $email)->first();

            if ($user) {
                $user->firebase_uid = $firebaseUid;

                return $user;
            }
        }

        return new User([
            'firebase_uid' => $firebaseUid,
            'name' => $decoded->name ?? '',
            'email' => $email ?? '',
            'avatar' => $decoded->picture ?? '',
        ]);
    }
}
