<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use App\Services\Firebase\FirebaseAuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CartApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_cart_endpoints_require_authentication(): void
    {
        $response = $this->getJson('/api/v1/cart');

        $response
            ->assertUnauthorized()
            ->assertJson([
                'success' => false,
                'message' => 'Unauthorized - No token provided',
            ]);
    }

    public function test_cart_sync_returns_validation_errors_in_consistent_shape(): void
    {
        $this->mockAuthenticatedUser();

        $response = $this->postJson('/api/v1/cart/sync', [
            'items' => [
                ['product_id' => 999999, 'quantity' => 0],
                ['product_id' => 999999, 'quantity' => 1],
            ],
        ], $this->authHeaders());

        $response
            ->assertStatus(422)
            ->assertJson([
                'success' => false,
                'message' => 'The given data was invalid.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'errors' => [
                    'items.0.product_id',
                    'items.0.quantity',
                    'items.1.product_id',
                ],
            ]);
    }

    public function test_cart_sync_returns_standardized_success_response(): void
    {
        $user = $this->mockAuthenticatedUser();
        $product = Product::create([
            'name' => 'Test Product',
            'description' => 'Test description',
            'price' => 19.99,
            'image' => '/storage/products/test.jpg',
        ]);

        $response = $this->postJson('/api/v1/cart/sync', [
            'items' => [
                ['product_id' => $product->id, 'quantity' => 3],
            ],
        ], $this->authHeaders());

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Cart synchronized successfully.',
                'data' => [
                    [
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'quantity' => 3,
                    ],
                ],
            ]);
    }

    public function test_cart_index_returns_standardized_success_response_for_authenticated_user(): void
    {
        $user = $this->mockAuthenticatedUser();
        $product = Product::create([
            'name' => 'Indexed Product',
            'description' => 'Indexed description',
            'price' => 29.99,
            'image' => '/storage/products/indexed.jpg',
        ]);

        $user->cartItems()->create([
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response = $this->getJson('/api/v1/cart', $this->authHeaders());

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Cart retrieved successfully.',
                'data' => [
                    [
                        'user_id' => $user->id,
                        'product_id' => $product->id,
                        'quantity' => 2,
                    ],
                ],
            ]);
    }

    public function test_cart_endpoints_reject_invalid_firebase_token(): void
    {
        $this->app->instance(FirebaseAuthService::class, new class extends FirebaseAuthService {
            public function authenticate(string $token): User
            {
                throw new \RuntimeException('Token validation failed.');
            }
        });

        $response = $this->getJson('/api/v1/cart', $this->authHeaders());

        $response
            ->assertUnauthorized()
            ->assertJson([
                'success' => false,
                'message' => 'The provided authentication token is invalid.',
            ]);
    }

    public function test_existing_user_with_same_email_can_be_linked_to_firebase_uid(): void
    {
        $existingUser = User::create([
            'name' => 'Existing User',
            'email' => 'existing@example.com',
            'firebase_uid' => null,
        ]);

        $product = Product::create([
            'name' => 'Linked Product',
            'description' => 'Linked description',
            'price' => 39.99,
            'image' => '/storage/products/linked.jpg',
        ]);

        $existingUser->cartItems()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $this->app->instance(FirebaseAuthService::class, new class($existingUser) extends FirebaseAuthService {
            public function __construct(private readonly User $user)
            {
            }

            public function authenticate(string $token): User
            {
                $this->user->firebase_uid = 'firebase-linked-user';
                $this->user->save();

                return $this->user->fresh();
            }
        });

        $response = $this->getJson('/api/v1/cart', $this->authHeaders());

        $response
            ->assertOk()
            ->assertJson([
                'success' => true,
                'message' => 'Cart retrieved successfully.',
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $existingUser->id,
            'firebase_uid' => 'firebase-linked-user',
        ]);
    }

    private function mockAuthenticatedUser(): User
    {
        $user = User::create([
            'name' => 'Test User',
            'email' => 'tester@example.com',
            'firebase_uid' => 'firebase-user-1',
        ]);

        $this->app->instance(FirebaseAuthService::class, new class($user) extends FirebaseAuthService {
            public function __construct(private readonly User $user)
            {
            }

            public function authenticate(string $token): User
            {
                return $this->user;
            }
        });

        return $user;
    }

    private function authHeaders(): array
    {
        return [
            'Authorization' => 'Bearer test-token',
        ];
    }
}
